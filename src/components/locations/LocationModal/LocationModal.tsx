// src/components/locations/LocationModal/LocationModal.tsx
'use client';

import { useState } from 'react';
import InfoTab from './InfoTab';
import HoursTab from './HoursTab';
import MaterialsTab from './MaterialsTab';

interface Location {
  _id?: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  hours?: string; // JSON string
  materials?: string;
  managers?: string[];
  status?: 'active' | 'inactive';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingLocation: Location | null;
  onSuccess: () => void;
}

export default function LocationModal({ isOpen, onClose, editingLocation, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'materials'>('info');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingLocation ? 'Edit Location' : 'Add New Location'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-8 py-4 text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Location Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hours')}
            className={`px-8 py-4 text-sm font-medium transition-colors ${
              activeTab === 'hours'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Working Hours
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('materials')}
            className={`px-8 py-4 text-sm font-medium transition-colors ${
              activeTab === 'materials'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Materials Accepted
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <InfoTab
              editingLocation={editingLocation}
              onNext={() => setActiveTab('hours')}
            />
          )}
          {activeTab === 'hours' && (
            <HoursTab
              editingLocation={editingLocation}
              onNext={() => setActiveTab('materials')}
              onBack={() => setActiveTab('info')}
            />
          )}
          {activeTab === 'materials' && (
            <MaterialsTab
              editingLocation={editingLocation}
              onBack={() => setActiveTab('hours')}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}