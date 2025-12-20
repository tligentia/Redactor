import React from 'react';

interface SelectorOption<T extends string> {
  value: T;
  label: string;
}

interface SelectorProps<T extends string> {
  id: string;
  label: string;
  options: SelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean; // Added disabled prop
}

const Selector = <T extends string,>({ 
  id,
  label, 
  options, 
  value, 
  onChange,
  className = '',
  disabled = false // Default value for disabled
}: SelectorProps<T>): React.ReactNode => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-neutral-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-white border border-neutral-300 text-neutral-800 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 shadow-sm disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-200 disabled:cursor-not-allowed"
        disabled={disabled} // Apply disabled prop
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;