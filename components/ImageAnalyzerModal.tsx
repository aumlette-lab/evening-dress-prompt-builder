
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES } from '../constants';
import type { AnalyzedTaxonomyItem, AnalyzedTaxonomyResult } from '../types';
import { XMarkIcon, UploadIcon, SparklesIcon, ClipboardIcon, CheckIcon, PlusIcon } from './Icons';
import { GEMINI_API_KEY } from '../config';

const PRIMARY_MODEL = 'gemini-2.0-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash-latest';

const shouldRetryWithFallback = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const err = error as { status?: string; code?: number; message?: string };
  if (err.code === 503) return true;
  if (err.status === 'UNAVAILABLE') return true;
  if (err.message && /overloaded|unavailable/i.test(err.message)) return true;
  return false;
};

interface ImageAnalyzerModalProps {
  onClose: () => void;
  onAddToTaxonomy: (category: string, item: AnalyzedTaxonomyItem) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // remove the `data:...;base64,` prefix
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const ImageAnalyzerModal: React.FC<ImageAnalyzerModalProps> = ({ onClose, onAddToTaxonomy }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzedTaxonomyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setAnalysisResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
      setError("Please select a valid image file (e.g., PNG, JPG, WEBP).");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if(isEntering) setIsDragging(true);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      if (!GEMINI_API_KEY) {
        setError('AI key missing. Set GEMINI_API_KEY to use image analysis.');
        setIsAnalyzing(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const base64Data = await blobToBase64(selectedFile);

      const categoryList = CATEGORIES.map(c => `\`${c.id}\``).join(', ');
      
      const properties = CATEGORIES.reduce((acc, category) => {
          const isScene = category.id === 'scene';
          const isLighting = category.id === 'lighting';
          const description = isScene
              ? 'Scene description with environment, spatial layout, foreground/background details, mood, and notable elements. Do NOT describe lighting here; reserve lighting for the lighting category.'
              : isLighting
                  ? 'Lighting description covering direction, quality, color temperature, intensity, shadows/highlights, and how it shapes the scene.'
                  : `Analysis for the ${category.label} category.`;

          acc[category.id] = {
              type: Type.OBJECT,
              description,
              properties: {
                  label: { type: Type.STRING, description: 'A short, descriptive title (2-4 words).' },
                  prompt_text: { type: Type.STRING, description: 'A detailed, evocative description suitable for an AI image generator prompt.' },
                  tags: { type: Type.ARRAY, description: 'An array of 3-4 relevant, single-word, lowercase tags.', items: { type: Type.STRING } }
              },
              required: ['label', 'prompt_text', 'tags']
          };
          return acc;
      }, {} as any);

      const schema = {
          type: Type.OBJECT,
          properties,
      };

      const metaPrompt = `You are an expert fashion photographer and stylist with a deep understanding of visual language. Analyze the provided image. For EACH of the following categories, provide a single, best-fit description.

Categories: ${categoryList}.

Your output must be a valid JSON object matching the provided schema. For each category key, provide an object with three properties: 
1. 'label': a short, descriptive title.
2. 'prompt_text': a detailed, evocative description.
3. 'tags': an array of 3-4 relevant, single-word, lowercase string tags.

If the image depicts a broader scene or environment, clearly explain the scene setup. Keep all lighting details ONLY in the lighting category (direction, quality, color, intensity, and how they affect subjects) and do not mix lighting into the scene description.`;

      const analyzeWithModel = async (model: string) => {
        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              { inlineData: { mimeType: selectedFile.type, data: base64Data } },
              { text: metaPrompt }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
          }
        });
        return response.text.trim();
      };

      try {
        const jsonStr = await analyzeWithModel(PRIMARY_MODEL);
        setAnalysisResult(JSON.parse(jsonStr));
        setModelUsed(PRIMARY_MODEL);
        setError(null);
      } catch (primaryErr) {
        if (shouldRetryWithFallback(primaryErr)) {
          try {
            const jsonStrFallback = await analyzeWithModel(FALLBACK_MODEL);
            setAnalysisResult(JSON.parse(jsonStrFallback));
            setModelUsed(FALLBACK_MODEL);
            setError(`Primary model unavailable. Used ${FALLBACK_MODEL} instead.`);
          } catch (fallbackErr) {
            setError(fallbackErr instanceof Error ? fallbackErr.message : "An unknown error occurred during analysis.");
          }
        } else {
          setError(primaryErr instanceof Error ? primaryErr.message : "An unknown error occurred during analysis.");
        }
      }

    } catch (err) {
      if (!analysisResult) {
        setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
      }
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
  };
  
  useEffect(() => {
    if (copiedField) {
      const timer = setTimeout(() => setCopiedField(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedField]);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-100">Analyze Visuals from Image</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close analyzer">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </header>
        <div className="flex-grow p-6 overflow-y-auto">
          {!imagePreview && (
            <div 
                className={`flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-slate-600 hover:border-slate-500'}`}
                onDrop={handleDrop}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragLeave={() => setIsDragging(false)}
            >
              <UploadIcon className="h-12 w-12 text-slate-400 mb-4" />
              <p className="text-lg font-semibold text-slate-300">Drag & drop your image here</p>
              <p className="text-slate-500">or</p>
              <label className="mt-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-md cursor-pointer hover:bg-slate-600 transition-colors">
                Select a file
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
              </label>
              {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
            </div>
          )}
      {imagePreview && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                    <img src={imagePreview} alt="Selected preview" className="max-h-96 w-auto object-contain rounded-lg shadow-lg mb-4" />
                    <div className="flex gap-4">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="flex items-center justify-center px-6 py-2 border rounded-md shadow-sm text-base font-medium transition-colors duration-200 bg-fuchsia-600 hover:bg-fuchsia-500 border-fuchsia-500 text-white disabled:bg-fuchsia-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? (
                                <><SparklesIcon className="h-5 w-5 mr-2 animate-spin" /> Analyzing...</>
                            ) : (
                                <><SparklesIcon className="h-5 w-5 mr-2" /> Analyze with Gemini</>
                            )}
                        </button>
                        <button onClick={() => { setImagePreview(null); setSelectedFile(null); setAnalysisResult(null); setError(null); }} className="px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
                            Choose another image
                        </button>
                    </div>
                </div>
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    {isAnalyzing && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                           <SparklesIcon className="h-10 w-10 animate-spin text-fuchsia-400 mb-4" />
                           <p className="text-lg">Analyzing image...</p>
                           <p className="text-sm">This may take a few moments.</p>
                        </div>
                    )}
                    {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md text-sm">{error}</div>}
                    {modelUsed && !error && (
                        <div className="bg-slate-900/50 border border-slate-700 text-slate-300 p-2 rounded-md text-xs uppercase tracking-wider mb-4">
                          Model: {modelUsed}
                        </div>
                    )}
                    {analysisResult && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-cyan-400">Analysis Results</h3>
                            {CATEGORIES.map(category => analysisResult[category.id] && (
                                <div key={category.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-slate-200">{category.label}</h4>
                                        <button 
                                            onClick={() => onAddToTaxonomy(category.id, analysisResult[category.id])}
                                            className="flex items-center gap-2 px-2.5 py-1 bg-cyan-600/50 hover:bg-cyan-600 text-white text-xs font-medium rounded-md transition-colors"
                                            title={`This will open the Taxonomy Manager where you can add this item.`}
                                        >
                                            <PlusIcon className="h-3 w-3" /> Add to Taxonomy
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <p className="flex-grow bg-slate-700/50 p-2 rounded text-sm text-slate-300 font-mono"><strong>Label:</strong> {analysisResult[category.id].label}</p>
                                            <button onClick={() => handleCopy(analysisResult[category.id].label, `${category.id}-label`)} className="p-1.5 text-slate-400 hover:text-white transition-colors" aria-label="Copy label">
                                                {copiedField === `${category.id}-label` ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
                                            </button>
                                        </div>
                                         <div className="flex items-start gap-2">
                                            <p className="flex-grow bg-slate-700/50 p-2 rounded text-sm text-slate-300 font-mono"><strong>Prompt:</strong> {analysisResult[category.id].prompt_text}</p>
                                            <button onClick={() => handleCopy(analysisResult[category.id].prompt_text, `${category.id}-prompt`)} className="p-1.5 text-slate-400 hover:text-white transition-colors" aria-label="Copy prompt text">
                                                {copiedField === `${category.id}-prompt` ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
                                            </button>
                                        </div>
                                         <div className="flex items-start gap-2">
                                            <p className="flex-grow bg-slate-700/50 p-2 rounded text-sm text-slate-300 font-mono"><strong>Tags:</strong> {(analysisResult[category.id].tags || []).join(', ')}</p>
                                            <button onClick={() => handleCopy((analysisResult[category.id].tags || []).join(', '), `${category.id}-tags`)} className="p-1.5 text-slate-400 hover:text-white transition-colors" aria-label="Copy tags">
                                                {copiedField === `${category.id}-tags` ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzerModal;
