// src/components/locations/LocationModal/MaterialsTab.tsx
'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/redux/hooks';
import Material from '@/components/Material/Material'; // Adjust path as needed

interface Props {
  editingLocation: any;
  onBack: () => void;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MaterialsTab({ editingLocation, onBack, onClose, onSuccess }: Props) {
  const { user } = useAppSelector(state => state.auth);

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Authentication required');
      return;
    }

    const infoData = JSON.parse(sessionStorage.getItem('locationFormInfo') || '{}');
    const hoursData = JSON.parse(sessionStorage.getItem('locationFormHours') || '{}');

    const body = {
      ...infoData,
      userId: user.id,
      hours: JSON.stringify(hoursData),
      // materials handled inside your Material component if needed
    };

    const url = editingLocation?._id
      ? `/api/locations/${editingLocation._id}`
      : '/api/locations';

    const method = editingLocation?._id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success || res.ok) {
        toast.success('Location saved successfully!');
        sessionStorage.removeItem('locationFormInfo');
        sessionStorage.removeItem('locationFormHours');
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  return (
    <div>
      <Material /> {/* Your existing Material component */}

      <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium"
          >
            {editingLocation ? 'Save Changes' : 'Add Location'}
          </button>
        </div>
      </div>
    </div>
  );
}