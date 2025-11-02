import React from 'react';
import { REMOVE_SELECTION_ID, type TaxonomyItem } from '../types';

interface SelectProps {
  label: string;
  options: TaxonomyItem[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  allowRemove?: boolean;
}

const Select: React.FC<SelectProps> = ({ label, options, value, onChange, allowRemove = false }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={label} className="text-sm font-medium text-slate-300">{label}</label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-150 ease-in-out"
      >
        <option value="">--- None ---</option>
        {allowRemove && <option value={REMOVE_SELECTION_ID}>--- Remove ---</option>}
        {options.map(option => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
