// src/components/locations/LocationsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import LocationHeader from './LocationHeader';
import LocationSummaryCards from './LocationSummaryCards';
import LocationCard from './LocationCard';
import LocationModal from './LocationModal/LocationModal';
import toast, { Toaster } from 'react-hot-toast';

interface Location {
  _id: string;
  userId: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  hours?: string;
  materials?: string;
  status: 'active' | 'inactive';
  managers: string[];
  checkIns: number;
  redemptions: number;
  payouts: number;
}

export default function LocationsDashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  const fetchLocations = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/locations?userId=${user.id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const locationsData = data.success ? data.data : data;
      setLocations(locationsData || []);
    } catch (error) {
      toast.error('Failed to load locations');
    }
  };

  useEffect(() => {
    if (user?.id) fetchLocations();
  }, [user?.id]);

  const openModal = (location?: Location) => {
    setEditingLocation(location || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
    fetchLocations(); // Refresh after save
  };

  const totalCheckIns = locations.reduce((sum, loc) => sum + loc.checkIns, 0);
  const totalRedemptions = locations.reduce((sum, loc) => sum + loc.redemptions, 0);
  const totalPayouts = locations.reduce((sum, loc) => sum + loc.payouts, 0);
  const activeLocations = locations.filter((loc) => loc.status === 'active').length;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <LocationHeader onAddNew={() => openModal()} />
          <LocationSummaryCards
            activeLocations={activeLocations}
            totalLocations={locations.length}
            totalCheckIns={totalCheckIns}
            totalRedemptions={totalRedemptions}
            totalPayouts={totalPayouts}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {locations.map((location) => (
              <LocationCard
                key={location._id}
                location={location}
                onEdit={() => openModal(location)}
                onRefresh={fetchLocations}
              />
            ))}
          </div>
        </div>
      </div>

      <LocationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingLocation={editingLocation}
        onSuccess={fetchLocations}
      />

      <Toaster position="top-right" />
    </>
  );
}