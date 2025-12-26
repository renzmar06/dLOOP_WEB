// src/components/locations/LocationHeader.tsx
import { Plus } from 'lucide-react';

interface Props {
  onAddNew: () => void;
}

export default function LocationHeader({ onAddNew }: Props) {
  return (
    <header className="mb-8 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Locations</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Add and manage multiple business locations
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Location
        </button>
      </div>
    </header>
  );
}