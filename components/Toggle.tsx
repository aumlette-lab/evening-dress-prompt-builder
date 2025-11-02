import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, description }) => {
  const id = `toggle-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2 pr-4">
            <span 
              id={`${id}-label`}
              className="font-medium text-slate-200 cursor-pointer"
              onClick={() => onChange(!checked)}
            >
              {label}
            </span>
             {description && (
                <span 
                    className="text-sm text-slate-400 cursor-pointer"
                    onClick={() => onChange(!checked)}
                >
                    ({description})
                </span>
            )}
        </div>
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            aria-labelledby={`${id}-label`}
            onClick={() => onChange(!checked)}
            className={`${
            checked ? 'bg-fuchsia-600' : 'bg-slate-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-slate-800`}
        >
            <span
            aria-hidden="true"
            className={`${
                checked ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
  );
};

export default Toggle;