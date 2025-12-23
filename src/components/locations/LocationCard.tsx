// src/components/locations/LocationCard.tsx
import { MapPin, Users, Settings, MoreVertical, Power, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Location } from './LocationsDashboard';

interface Props {
  location: Location;
  onEdit: () => void;
  onRefresh: () => void;
}

export default function LocationCard({ location, onEdit, onRefresh }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleStatus = async () => {
    try {
      const res = await fetch(`/api/locations/${location._id}`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Status updated');
        onRefresh();
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch {
      toast.error('Failed to toggle status');
    } finally {
      setDropdownOpen(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 pr-4">{location.name}</h3>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                location.status === 'active'
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {location.status === 'active' ? 'Active' : 'Inactive'}
            </span>
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-600 mb-5">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
          <div>
            <p>{location.address}, {location.city}, {location.state}</p>
            <p className="font-medium">{location.zip}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span className="font-medium">Managers:</span>
          {location.managers.length > 0 ? (
            location.managers.map((m, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-xs">
                {m}
              </span>
            ))
          ) : (
            <span className="text-gray-400">None assigned</span>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Check-ins Today</span>
            <span className="text-2xl font-bold">{location.checkIns}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Redemptions Today</span>
            <span className="text-xl font-semibold">{location.redemptions}</span>
          </div>
          <div className="flex justify-between pt-3 border-t">
            <span className="text-sm text-gray-600">Payouts Today</span>
            <span className="text-2xl font-bold text-teal-600">
              ${location.payouts.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 px-5 pb-5">
        <button
          onClick={onEdit}
          className="flex-1 border rounded-lg py-2 text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <Settings className="w-4 h-4" /> Manage
        </button>
      </div>

      {dropdownOpen && (
        <div className="absolute right-6 top-20 z-40 w-56 bg-white rounded-lg shadow-xl border">
          <button
            onClick={() => { onEdit(); setDropdownOpen(false); }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm"
          >
            <Settings className="w-4 h-4" /> Manage Settings
          </button>
          <button
            onClick={() => { toast('Coming soon'); setDropdownOpen(false); }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm"
          >
            <ArrowUp className="w-4 h-4 rotate-90" /> Switch To Location
          </button>
          <button
            onClick={toggleStatus}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-red-600"
          >
            <Power className="w-4 h-4" />
            {location.status === 'active' ? 'Disable' : 'Enable'}
          </button>
        </div>
      )}
    </div>
  );
}