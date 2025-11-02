
import React, { useState, useEffect } from 'react';
import type { TaxonomyItem } from '../types';
import { XMarkIcon } from './Icons';

interface TaxonomyItemFormProps {
  item?: Partial<TaxonomyItem> | null;
  category: string;
  onSave: (item: TaxonomyItem) => void;
  onCancel: () => void;
  itemCount: number;
}

const TaxonomyItemForm: React.FC<TaxonomyItemFormProps> = ({ item, category, onSave, onCancel, itemCount }) => {
  const [label, setLabel] = useState('');
  const [promptText, setPromptText] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (item) {
      setLabel(item.label || '');
      setPromptText(item.prompt_text || '');
      setTags(Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '');
    } else {
      // For a new item, clear the fields
      setLabel('');
      setPromptText('');
      setTags('');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !promptText.trim()) {
        alert('Label and Prompt Text cannot be empty.');
        return;
    }
    
    // An item is being edited if it already has an ID.
    const isEditing = !!item?.id;
    
    const newItem: TaxonomyItem = {
      id: isEditing ? item.id! : `${category}_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}_${Date.now()}`,
      category: item?.category || category,
      label,
      prompt_text: promptText,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      // If editing, preserve the existing order. If it's a new item, assign it to the end of the list.
      // Use a fallback to itemCount for the unlikely case an existing item has no order.
      order: isEditing ? (item.order ?? itemCount) : itemCount,
    };
    onSave(newItem);
  };

  const formTitle = item?.id ? 'Edit Item' : 'Add New Item';

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[60] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">{formTitle}</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors" aria-label="Close form">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-slate-300 mb-1">Label</label>
            <input
              id="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">The display name in the dropdown menu.</p>
          </div>
          <div>
            <label htmlFor="prompt_text" className="block text-sm font-medium text-slate-300 mb-1">Prompt Text</label>
            <textarea
              id="prompt_text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">The text that will be inserted into the generated prompt.</p>
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-1">Tags</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <p className="text-xs text-slate-500 mt-1">Comma-separated tags for organization (optional).</p>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-medium rounded-md transition-colors"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxonomyItemForm;
