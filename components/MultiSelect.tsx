import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { TaxonomyItem } from '../types';

interface MultiSelectProps {
  label: string;
  options: TaxonomyItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = '--- None ---',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedIds.includes(option.id)),
    [options, selectedIds]
  );

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedLabel =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.map((option) => option.label).join(', ');

  return (
    <div className="relative flex flex-col space-y-2" ref={containerRef}>
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg shadow-sm py-2 px-3 text-left text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-150 ease-in-out flex justify-between items-center"
      >
        <span className={selectedOptions.length === 0 ? 'text-slate-400' : ''}>{selectedLabel}</span>
        <svg
          className={`h-4 w-4 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 shadow-xl">
          <div className="max-h-60 overflow-y-auto py-2">
            {options.map((option) => {
              const checked = selectedIds.includes(option.id);
              return (
                <label
                  key={option.id}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelection(option.id)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-fuchsia-500 focus:ring-fuchsia-500"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
            {options.length === 0 && (
              <div className="px-4 py-2 text-sm text-slate-400">No accessories available.</div>
            )}
          </div>
          <div className="flex justify-between border-t border-slate-700 px-4 py-2">
            <span className="text-xs text-slate-400">
              {selectedOptions.length} selected
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-fuchsia-400 hover:text-fuchsia-300"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
