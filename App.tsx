
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { IS_AI_ENABLED, GEMINI_API_KEY } from './config';

// FIX: Import TaxonomyItem to be used for explicit typing.
import type { TaxonomyData, Selections, AnalyzedTaxonomyItem, TaxonomyItem } from './types';
import { REMOVE_SELECTION_ID, isRemovalSelection } from './types';
import { VISUAL_ELEMENT_GROUPS, CATEGORIES } from './constants';
import { fetchTaxonomyViaJsonp, saveTaxonomyData } from './api';

import Select from './components/Select';
import OutputBox from './components/OutputBox';
import TaxonomyManager from './components/TaxonomyManager';
import ImageAnalyzerModal from './components/ImageAnalyzerModal';
import ApiConfiguration from './components/ApiConfiguration';
import ConnectionTroubleshooter from './components/ConnectionTroubleshooter';
import { CogIcon, CameraIcon, RefreshIcon, DressIcon, PencilIcon } from './components/Icons';
import Toggle from './components/Toggle';

const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';
const REMOVABLE_CATEGORIES = new Set(['bags', 'accessory']);

const shouldRetryWithFallback = (error: unknown): boolean => {
    if (!error || typeof error !== 'object') return false;
    const err = error as { status?: string; code?: number; message?: string };
    if (err.code === 503) return true;
    if (err.status === 'UNAVAILABLE') return true;
    if (err.message && /overloaded|unavailable/i.test(err.message)) return true;
    return false;
};

const App: React.FC = () => {
    const [taxonomyData, setTaxonomyData] = useState<TaxonomyData | null>(null);
    const [selections, setSelections] = useState<Selections>({});
    const [prompt, setPrompt] = useState<string>('');
    const [status, setStatus] = useState<'loading' | 'idle' | 'error' | 'unconfigured'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    const [isRefining, setIsRefining] = useState<boolean>(false);
    const [refineError, setRefineError] = useState<string | null>(null);
    const [refineModelUsed, setRefineModelUsed] = useState<string | null>(null);

    const [isTaxonomyManagerOpen, setTaxonomyManagerOpen] = useState(false);
    const [isImageAnalyzerOpen, setImageAnalyzerOpen] = useState(false);
    const [isApiConfigOpen, setApiConfigOpen] = useState(false);
    
    // State to hold item from analyzer to add to taxonomy
    const [itemToAddFromAnalyzer, setItemToAddFromAnalyzer] = useState<Partial<TaxonomyItem> | null>(null);

    // Consistency Options State
    const [keepFace, setKeepFace] = useState<boolean>(false);
    const [keepDress, setKeepDress] = useState<boolean>(true);

    const loadTaxonomy = useCallback(async () => {
        setStatus('loading');
        setError(null);
        try {
            const data = await fetchTaxonomyViaJsonp();
            Object.keys(data).forEach(category => {
                data[category].sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.label.localeCompare(b.label));
            });
            setTaxonomyData(data);
            setStatus('idle');
            setIsDirty(false);
        } catch (e) {
            if (e instanceof Error && e.message === 'API_CONFIG_MISSING') {
                setStatus('unconfigured');
            } else {
                setError(e instanceof Error ? e.message : 'An unknown error occurred.');
                setStatus('error');
            }
        }
    }, []);

    useEffect(() => {
        loadTaxonomy();
    }, [loadTaxonomy]);
    
    const handleTaxonomyChange = (newData: TaxonomyData) => {
        setTaxonomyData(newData);
        setIsDirty(true);
    };
    
    const handleSaveTaxonomy = async () => {
        if (!taxonomyData) return;
        try {
            await saveTaxonomyData(taxonomyData);
            setIsDirty(false);
            // Optionally show a success message
        } catch (e) {
            alert("Failed to save taxonomy data: " + (e instanceof Error ? e.message : "Unknown error"));
        }
    };

    const handleSelectionChange = (categoryId: string, itemId: string) => {
        setSelections(prev => {
            const newSelections = { ...prev };

            if (itemId === REMOVE_SELECTION_ID) {
                newSelections[categoryId] = {
                    category: categoryId,
                    id: REMOVE_SELECTION_ID,
                    label: 'Remove'
                };
                return newSelections;
            }

            if (itemId && taxonomyData?.[categoryId]) {
                const selection = taxonomyData[categoryId].find(item => item.id === itemId);
                if (selection) {
                    newSelections[categoryId] = selection;
                } else {
                    delete newSelections[categoryId];
                }
            } else {
                delete newSelections[categoryId];
            }

            return newSelections;
        });
    };

    const generatePrompt = useCallback(() => {
        const finalPromptParts: string[] = [];

        // 1. Consistency Options first
        const consistencyOptions: string[] = [];
        if (keepFace) consistencyOptions.push('face');
        if (keepDress) consistencyOptions.push('dress design detail and fabric texture');

        if (consistencyOptions.length > 0) {
            finalPromptParts.push(`Keep the existing ${consistencyOptions.join(', ')}.`);
        }

        // 2. Build change/keep sentences for all visual elements
        const instructionParts: string[] = [];
        CATEGORIES.forEach(category => {
            const categoryLabel = category.label.toLowerCase();
            const selection = selections[category.id];

            if (isRemovalSelection(selection)) {
                const removalSentence = `Remove the ${categoryLabel}.`;
                instructionParts.push(removalSentence);
            } else if (selection && 'prompt_text' in selection) {
                const promptText = selection.prompt_text;
                const changeSentence = `Change the ${categoryLabel} to ${promptText}.`;
                instructionParts.push(changeSentence);
            } else {
                const keepSentence = `Keep the existing ${categoryLabel}.`;
                instructionParts.push(keepSentence);
            }
        });
        
        if (instructionParts.length > 0) {
            finalPromptParts.push(instructionParts.join(' '));
        }

        setPrompt(finalPromptParts.join(' '));

    }, [selections, keepFace, keepDress]);

    useEffect(() => {
        generatePrompt();
    }, [generatePrompt]);

    const isAiEnabled = IS_AI_ENABLED && Boolean(GEMINI_API_KEY);

    useEffect(() => {
        if (!isAiEnabled && isImageAnalyzerOpen) {
            setImageAnalyzerOpen(false);
        }
    }, [isAiEnabled, isImageAnalyzerOpen]);

    const handleRefinePrompt = async () => {
        if (!isAiEnabled) return;
        if (!prompt) return;
        setIsRefining(true);
        setRefineError(null);
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const refineRequestPrompt = `You are a creative prompt engineer. Refine the following concepts into a cohesive, vivid, and effective prompt for an AI image generator. Enhance the descriptive language and structure it for optimal image generation, but do not add any new core concepts. Concepts: "${prompt}"`;

        const tryModel = async (model: string) => {
            const response = await ai.models.generateContent({
                model,
                contents: refineRequestPrompt
            });
            return response.text.trim();
        };

        try {
            const refined = await tryModel(PRIMARY_MODEL);
            setPrompt(refined);
            setRefineModelUsed(PRIMARY_MODEL);
            setRefineError(null);
        } catch (err) {
            if (shouldRetryWithFallback(err)) {
                try {
                    const refinedFallback = await tryModel(FALLBACK_MODEL);
                    setPrompt(refinedFallback);
                    setRefineModelUsed(FALLBACK_MODEL);
                    setRefineError(`Primary model unavailable. Used ${FALLBACK_MODEL} instead.`);
                } catch (fallbackErr) {
                    setRefineError(fallbackErr instanceof Error ? fallbackErr.message : "An unknown error occurred during refinement.");
                }
            } else {
                setRefineError(err instanceof Error ? err.message : "An unknown error occurred during refinement.");
            }
        } finally {
            setIsRefining(false);
        }
    };
    
    const handleReset = () => {
        setSelections({});
        setKeepFace(false);
        setKeepDress(true);
    };
    
    const handleAddToTaxonomy = (category: string, item: AnalyzedTaxonomyItem) => {
        const newItem: Partial<TaxonomyItem> = {
            category: category,
            label: item.label,
            prompt_text: item.prompt_text,
            tags: item.tags,
        };
        setItemToAddFromAnalyzer(newItem);
        setTaxonomyManagerOpen(true);
    };

    if (status === 'loading') {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-lg">Connecting to Google Sheet...</div>;
    }

    if (status === 'unconfigured') {
        return <ApiConfiguration onClose={() => { if(!localStorage.getItem('API_URL')) setStatus('error')}} onSave={loadTaxonomy} />;
    }
    
    if (status === 'error' && !taxonomyData) {
        return <ConnectionTroubleshooter error={error!} onRetry={loadTaxonomy} onConfigure={() => setStatus('unconfigured')} />;
    }
    
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
            <main className="max-w-screen-2xl mx-auto">
                <header className="flex flex-wrap gap-4 justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <DressIcon className="h-10 w-10 text-fuchsia-400" />
                        <div>
                           <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">Evening Dress Prompt Builder</h1>
                           <p className="text-sm text-slate-400">Edits are saved in-session. Click "Save to Google Sheet" in the manager to persist changes.</p>
                        </div>
                    </div>
            <div className="flex items-center gap-2">
                         {isAiEnabled && (
                        <button onClick={() => setImageAnalyzerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-md transition-colors">
                            <CameraIcon className="h-5 w-5"/> Analyze Image
                        </button>
                        )}
                        <button onClick={() => setTaxonomyManagerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-md transition-colors">
                            <PencilIcon className="h-5 w-5"/> Manage Taxonomy
                        </button>
                         <button 
                            onClick={() => setApiConfigOpen(true)} 
                            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition-colors" 
                            aria-label="API Settings"
                            title="API Settings"
                        >
                            <CogIcon className="h-5 w-5"/>
                       </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-stretch">
                    <div className="flex flex-col gap-8 lg:h-full">
                        <div className="flex flex-col gap-8 flex-1">
                            <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
                            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Consistency Options</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <Toggle label="Face" checked={keepFace} onChange={setKeepFace} />
                                <Toggle label="Dress" checked={keepDress} onChange={setKeepDress} description="Design detail & fabric texture"/>
                            </div>
                        </div>
                        {VISUAL_ELEMENT_GROUPS.map(group => (
                            <div key={group.title} className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-4">{group.title}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {group.categories.map(category => (
                                    <Select
                                        key={category.id}
                                        label={category.label}
                                        options={taxonomyData?.[category.id] || []}
                                        value={selections[category.id]?.id || ''}
                                        onChange={(e) => handleSelectionChange(category.id, e.target.value)}
                                        allowRemove={REMOVABLE_CATEGORIES.has(category.id)}
                                    />
                                ))}
                                </div>
                            </div>
                        ))}
                        </div>
                        <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
                            <RefreshIcon className="h-4 w-4" /> Reset All Selections
                        </button>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="flex-1 flex">
                            <OutputBox
                                prompt={prompt}
                                onPromptChange={setPrompt}
                                onRefine={handleRefinePrompt}
                                isRefining={isRefining}
                                error={refineError}
                                modelUsed={refineModelUsed}
                                aiEnabled={isAiEnabled}
                            />
                        </div>
                    </div>
                </div>

            </main>

            {isTaxonomyManagerOpen && taxonomyData && (
                <TaxonomyManager 
                    initialData={taxonomyData} 
                    onClose={() => setTaxonomyManagerOpen(false)}
                    onDataChange={handleTaxonomyChange}
                    onSave={handleSaveTaxonomy}
                    isDirty={isDirty}
                    onConfigureApi={() => setApiConfigOpen(true)}
                    itemToAdd={itemToAddFromAnalyzer}
                    onClearItemToAdd={() => setItemToAddFromAnalyzer(null)}
                />
            )}
             {isImageAnalyzerOpen && isAiEnabled && (
                <ImageAnalyzerModal onClose={() => setImageAnalyzerOpen(false)} onAddToTaxonomy={handleAddToTaxonomy}/>
            )}
            {isApiConfigOpen && (
                <ApiConfiguration onClose={() => {setApiConfigOpen(false); if (!localStorage.getItem('API_URL')) { setStatus('error'); setError('Configuration was cancelled.'); }}} onSave={loadTaxonomy}/>
            )}
        </div>
    );
};

export default App;
