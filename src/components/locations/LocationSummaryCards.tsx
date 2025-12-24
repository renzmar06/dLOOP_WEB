// src/components/locations/LocationSummaryCards.tsx
import { MapPin, Users, ArrowUp, DollarSign } from 'lucide-react';

interface Props {
  activeLocations: number;
  totalLocations: number;
  totalCheckIns: number;
  totalRedemptions: number;
  totalPayouts: number;
}

export default function LocationSummaryCards({
  activeLocations,
  totalLocations,
  totalCheckIns,
  totalRedemptions,
  totalPayouts,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-3 rounded-lg">
            <MapPin className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Locations</p>
            <p className="text-2xl font-bold text-gray-900">
              {activeLocations} / {totalLocations}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Check-ins</p>
            <p className="text-2xl font-bold text-gray-900">{totalCheckIns}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded-lg">
            <ArrowUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Redemptions</p>
            <p className="text-2xl font-bold text-gray-900">{totalRedemptions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Combined Payouts</p>
            <p className="text-2xl font-bold text-gray-900">${totalPayouts.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}