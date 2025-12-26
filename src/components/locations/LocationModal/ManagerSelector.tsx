import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Props {
  selected: string[];
  onChange: (managers: string[]) => void;
  availableManagers: string[];
}

export default function ManagerSelector({ selected, onChange, availableManagers }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Assign Manager(s)</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex justify-between items-center hover:border-gray-400"
      >
        <span className={`text-sm ${selected?.length ? 'text-gray-900' : 'text-gray-500'}`}>
          {selected?.length ? selected.join(', ') : 'Select managers...'}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {availableManagers.map(manager => {
            const isSelected = selected?.includes(manager) || false;
            return (
              <div
                key={manager}
                onClick={() => {
                  onChange(isSelected ? (selected || []).filter(m => m !== manager) : [...(selected || []), manager]);
                }}
                className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer text-sm"
              >
                <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                  {isSelected && <div className="w-3 h-3 bg-yellow-500 rounded-sm" />}
                </div>
                {manager}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}