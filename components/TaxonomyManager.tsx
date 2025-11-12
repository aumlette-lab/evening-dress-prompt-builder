
import React, { useState, useEffect } from 'react';
import type { TaxonomyData, TaxonomyItem } from '../types';
import { CATEGORIES } from '../constants';
import TaxonomyItemForm from './TaxonomyItemForm';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, CogIcon, ArrowUpIcon, ArrowDownIcon, DuplicateIcon } from './Icons';

interface TaxonomyManagerProps {
  initialData: TaxonomyData;
  onClose: () => void;
  onDataChange: (newData: TaxonomyData) => void;
  onSave: () => Promise<void>;
  isDirty: boolean;
  onConfigureApi: () => void;
  itemToAdd?: Partial<TaxonomyItem> | null;
  onClearItemToAdd: () => void;
}

const TaxonomyManager: React.FC<TaxonomyManagerProps> = ({ initialData, onClose, onDataChange, onSave, isDirty, onConfigureApi, itemToAdd, onClearItemToAdd }) => {
    const [localData, setLocalData] = useState<TaxonomyData>(() => JSON.parse(JSON.stringify(initialData)));
    const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]?.id || '');
    const [editingItem, setEditingItem] = useState<Partial<TaxonomyItem> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (itemToAdd) {
            setActiveCategory(itemToAdd.category || CATEGORIES[0]?.id || '');
            setEditingItem(itemToAdd);
            setIsFormOpen(true);
            onClearItemToAdd();
        }
    }, [itemToAdd, onClearItemToAdd]);

    const handleLocalUpdate = (newData: TaxonomyData) => {
        setLocalData(newData);
        onDataChange(newData);
    };

    const handleSaveItem = (itemToSave: TaxonomyItem) => {
        const newData = JSON.parse(JSON.stringify(localData));
        const categoryItems = newData[itemToSave.category] || [];
        const itemIndex = categoryItems.findIndex(i => i.id === itemToSave.id);

        if (itemIndex > -1) {
            categoryItems[itemIndex] = itemToSave;
        } else {
            categoryItems.push(itemToSave);
        }
        newData[itemToSave.category] = categoryItems;
        handleLocalUpdate(newData);
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const generateDuplicateLabel = (label: string, category: string) => {
        const existingLabels = new Set((localData[category] || []).map(item => item.label.toLowerCase()));
        const baseLabel = `${label} Copy`;
        if (!existingLabels.has(baseLabel.toLowerCase())) {
            return baseLabel;
        }

        let counter = 2;
        while (true) {
            const candidate = `${baseLabel} ${counter}`;
            if (!existingLabels.has(candidate.toLowerCase())) {
                return candidate;
            }
            counter += 1;
        }
    };

    const handleDuplicate = (itemToDuplicate: TaxonomyItem) => {
        const duplicateLabel = generateDuplicateLabel(itemToDuplicate.label, itemToDuplicate.category);
        setActiveCategory(itemToDuplicate.category);
        setEditingItem({
            ...itemToDuplicate,
            id: undefined,
            label: duplicateLabel,
            order: undefined,
        });
        setIsFormOpen(true);
    };
    
    const handleDelete = (itemToDelete: TaxonomyItem) => {
        setLocalData(prevData => {
            const sortedItems = [...(prevData[itemToDelete.category] || [])].sort(
                (a, b) => (a.order ?? 999) - (b.order ?? 999) || a.label.localeCompare(b.label)
            );

            const updatedItems = sortedItems
                .filter(item => item.id !== itemToDelete.id)
                .map((item, index) => ({
                    ...item,
                    order: index,
                }));

            const newData = {
                ...prevData,
                [itemToDelete.category]: updatedItems,
            };

            onDataChange(newData);
            return newData;
        });
    };

    const handleReorder = (index: number, direction: 'up' | 'down') => {
        // IMPORTANT: Operate on the sorted list to ensure indexes match the UI.
        const sortedItems = [...(localData[activeCategory] || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.label.localeCompare(b.label));

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sortedItems.length) return;

        // Perform the swap on the sorted list
        const [movedItem] = sortedItems.splice(index, 1);
        sortedItems.splice(newIndex, 0, movedItem);

        // Re-assign order based on the new sequence
        const updatedItems = sortedItems.map((item, idx) => ({ ...item, order: idx }));

        const newData = { ...localData, [activeCategory]: updatedItems };
        handleLocalUpdate(newData);
    };
    
    const handleSaveChanges = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await onSave();
        } catch(e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsSaving(false);
        }
    };

    const sortedActiveCategoryItems = localData[activeCategory]?.slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.label.localeCompare(b.label)) || [];
    
    return (
    <>
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
          <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
             <div className="flex items-center gap-4"> 
                <h2 className="text-2xl font-bold text-slate-100">Manage Taxonomy 3.0</h2>
                <button onClick={onConfigureApi} className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 border border-slate-600 px-2 py-1 rounded-md transition-colors">
                    <CogIcon className="h-4 w-4" /> API Settings
                </button>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close taxonomy manager">
              <XMarkIcon className="h-7 w-7" />
            </button>
          </header>
          
          <div className="flex-grow flex overflow-hidden">
            <aside className="w-1/3 md:w-1/4 border-r border-slate-700 overflow-y-auto p-4 flex-shrink-0">
              <nav className="flex flex-col space-y-1">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-fuchsia-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
                    {cat.label}
                  </button>
                ))}
              </nav>
            </aside>
            <main className="flex-grow p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-semibold text-cyan-400">{CATEGORIES.find(c => c.id === activeCategory)?.label} Items</h3>
                 <button onClick={() => { setEditingItem(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-medium rounded-md transition-colors">
                    <PlusIcon className="h-4 w-4" /> Add New Item
                </button>
              </div>

              <div className="space-y-2">
                 {sortedActiveCategoryItems.length > 0 ? sortedActiveCategoryItems.map((item, index) => (
                    <div
                        key={item.id}
                        className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center gap-4"
                        data-taxonomy-item-id={item.id}
                        data-taxonomy-category={item.category}
                    >
                        <div className="flex-grow min-w-0">
                            <p className="font-semibold text-slate-200 truncate">{item.label}</p>
                            <p className="text-sm text-slate-400 font-mono truncate">{item.prompt_text}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0 items-center">
                             <button onClick={() => handleReorder(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-white disabled:opacity-30"><ArrowUpIcon className="h-4 w-4" /></button>
                             <button onClick={() => handleReorder(index, 'down')} disabled={index === sortedActiveCategoryItems.length - 1} className="p-1 text-slate-400 hover:text-white disabled:opacity-30"><ArrowDownIcon className="h-4 w-4" /></button>
                             <button onClick={() => handleDuplicate(item)} className="p-2 text-slate-400 hover:text-indigo-400" title="Duplicate item"><DuplicateIcon className="h-5 w-5" /></button>
                             <button onClick={() => { setEditingItem(item); setIsFormOpen(true); }} className="p-2 text-slate-400 hover:text-cyan-400"><PencilIcon className="h-5 w-5" /></button>
                             <button onClick={() => handleDelete(item)} className="p-2 text-slate-400 hover:text-red-400"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                 )) : <p className="text-slate-500 text-center py-8">No items in this category.</p>}
              </div>
            </main>
          </div>
          <footer className="p-4 border-t border-slate-700 flex justify-between items-center bg-slate-800/50">
                <p className={`text-sm transition-opacity duration-300 ${isDirty ? 'opacity-100' : 'opacity-0'}`}>
                    You have unsaved changes.
                </p>
                <button
                    onClick={handleSaveChanges}
                    disabled={!isDirty || isSaving}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md transition-colors disabled:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save to Google Sheet'}
                </button>
            </footer>
        </div>
      </div>
      
      {isFormOpen && (
          <TaxonomyItemForm
            item={editingItem}
            category={activeCategory}
            onSave={handleSaveItem}
            onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
            itemCount={sortedActiveCategoryItems.length}
          />
      )}
    </>
  );
};

export default TaxonomyManager;
