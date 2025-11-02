
import React, { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon, SparklesIcon } from './Icons';

interface OutputBoxProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onRefine: () => void;
  isRefining: boolean;
  error: string | null;
  modelUsed: string | null;
  aiEnabled?: boolean;
}

const OutputBox: React.FC<OutputBoxProps> = ({ prompt, onPromptChange, onRefine, isRefining, error, modelUsed, aiEnabled = true }) => {
  const [copied, setCopied] = useState(false);

  const handleRefineClick = () => {
    if (!aiEnabled) return;
    onRefine();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 h-full flex flex-col">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-slate-100">Generated Prompt</h2>
            <div className="flex gap-2">
                {aiEnabled && (
                <button
                    onClick={handleRefineClick}
                    disabled={isRefining || !prompt}
                    className="flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200 bg-fuchsia-600 hover:bg-fuchsia-500 border-fuchsia-500 text-white disabled:bg-fuchsia-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRefining ? (
                        <>
                        <SparklesIcon className="h-5 w-5 mr-2 animate-spin" />
                        Refining...
                        </>
                    ) : (
                        <>
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        Refine with AI
                        </>
                    )}
                </button>
                )}
                <button
                    onClick={handleCopy}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                    copied
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-500 border-cyan-500 text-white'
                    }`}
                >
                    {copied ? (
                        <>
                        <CheckIcon className="h-5 w-5 mr-2" />
                        Copied!
                        </>
                    ) : (
                        <>
                        <ClipboardIcon className="h-5 w-5 mr-2" />
                        Copy Prompt
                        </>
                    )}
                </button>
            </div>
      </div>
      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</div>}
      {aiEnabled && modelUsed && !error && (
        <div className="bg-slate-900/50 border border-slate-700 text-slate-300 p-2 rounded-md mb-4 text-xs uppercase tracking-wider">
          Model: {modelUsed}
        </div>
      )}
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        className="flex-grow bg-slate-900/70 p-4 rounded-lg text-slate-300 leading-relaxed text-lg min-h-[400px] border border-slate-700 w-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-150 ease-in-out resize-y"
        aria-label="Generated Prompt"
        placeholder="Select visual elements to generate a prompt..."
      />
    </div>
  );
};

export default OutputBox;
