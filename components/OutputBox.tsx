
import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardIcon, CheckIcon, SparklesIcon } from './Icons';
import type { PromptSegment } from '../types';
import { CATEGORY_HIGHLIGHT_CLASSES } from '../constants';

interface OutputBoxProps {
  prompt: string;
  onRefine: () => void;
  isRefining: boolean;
  error: string | null;
  modelUsed: string | null;
  aiEnabled?: boolean;
  segments?: PromptSegment[];
  onSegmentChange?: (index: number, newValue: string) => void;
}

const OutputBox: React.FC<OutputBoxProps> = ({
  prompt,
  onRefine,
  isRefining,
  error,
  modelUsed,
  aiEnabled = true,
  segments = [],
  onSegmentChange,
}) => {
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

  const segmentCards = useMemo(() => {
    if (!segments.length) return null;

    const getSegmentClasses = (segment: PromptSegment) => {
      if (segment.mode === 'consistency') {
        return 'bg-slate-700/50 border border-slate-500/40 text-slate-100';
      }
      if (segment.mode === 'keep') {
        return 'bg-slate-800/40 border border-slate-600 text-slate-100';
      }
      if (segment.mode === 'remove') {
        return 'bg-rose-700/25 border border-rose-500/40 text-rose-100';
      }
      if (segment.mode === 'custom') {
        return 'bg-slate-800/60 border border-slate-500/50 text-slate-100';
      }
      if (segment.mode === 'refined') {
        return 'bg-fuchsia-800/30 border border-fuchsia-500/40 text-fuchsia-100';
      }
      const categoryClass = CATEGORY_HIGHLIGHT_CLASSES[segment.id];
      if (categoryClass) {
        return `${categoryClass} text-slate-100`;
      }
      return 'bg-slate-700/50 border border-slate-600 text-slate-100';
    };

    return segments.map((segment, index) => (
      <div
        key={`${segment.id}-${segment.mode}`}
        className={`rounded-lg px-3 py-2 text-sm leading-relaxed shadow-sm ${getSegmentClasses(segment)}`}
      >
        <div className="text-[0.65rem] uppercase tracking-widest text-white/80 font-semibold mb-2">
          {segment.label}
        </div>
        <textarea
          value={segment.text}
          onChange={(e) => onSegmentChange?.(index, e.target.value)}
          className="w-full bg-transparent border border-white/10 rounded-md px-2 py-2 text-[0.95rem] leading-relaxed text-slate-50/90 resize-y focus:outline-none focus:ring-2 focus:ring-white/40"
          rows={Math.max(2, Math.ceil(segment.text.length / 80))}
          aria-label={`Edit ${segment.label}`}
        />
      </div>
    ));
  }, [segments, onSegmentChange]);

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
      {segmentCards && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Visual Elements Overview</div>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {segmentCards}
          </div>
        </div>
      )}
      <textarea
        value={prompt}
        readOnly
        className="flex-grow bg-slate-900/70 p-4 rounded-lg text-slate-300 leading-relaxed text-[0.95rem] min-h-[400px] border border-slate-700 w-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-150 ease-in-out resize-y"
        aria-label="Generated Prompt"
        placeholder="Select visual elements to generate a prompt..."
      />
    </div>
  );
};

export default OutputBox;
