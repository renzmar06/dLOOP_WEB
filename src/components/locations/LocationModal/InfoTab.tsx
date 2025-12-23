// src/components/locations/LocationModal/InfoTab.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/redux/hooks';
import ManagerSelector from './ManagerSelector';

// Extend Window interface to include Google Maps
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: any;
        event?: any;
        [key: string]: any;
      };
    };
  }
}

interface Location {
  name: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  managers?: string[];
}

interface Props {
  editingLocation: Location | null;
  onNext: () => void;
}

export default function InfoTab({ editingLocation, onNext }: Props) {
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    managers: [],
  });

  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load data when editing an existing location
  useEffect(() => {
    if (editingLocation) {
      setFormData({
        name: editingLocation.name || '',
        address: editingLocation.address || '',
        city: editingLocation.city || '',
        state: editingLocation.state || '',
        zip: editingLocation.zip || '',
        phone: editingLocation.phone || '',
        managers: editingLocation.managers || [],
      });
    } else {
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        managers: [],
      });
    }
  }, [editingLocation]);

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('locationFormInfo', JSON.stringify(formData));
  }, [formData]);

  // Load Google Maps API if not already loaded
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google?.maps?.places) return Promise.resolve();
      
      return new Promise<void>((resolve) => {
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
          // Script exists, wait for it to load
          const checkLoaded = () => {
            if (window.google?.maps?.places) {
              resolve();
            } else {
              setTimeout(checkLoaded, 100);
            }
          };
          checkLoaded();
        } else {
          // Load the script
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&libraries=places`;
          script.async = true;
          script.onload = () => resolve();
          document.head.appendChild(script);
        }
      });
    };

    loadGoogleMapsAPI().then(() => {
      console.log('Google Maps API loaded successfully');
    });
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return false;

      try {
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'formatted_address'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place?.address_components) return;

          let street = '';
          let city = '';
          let state = '';
          let zip = '';

          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes('street_number')) street += component.long_name + ' ';
            if (types.includes('route')) street += component.long_name;
            if (types.includes('locality')) city = component.long_name;
            if (types.includes('administrative_area_level_1')) state = component.short_name;
            if (types.includes('postal_code')) zip = component.long_name;
          }

          setFormData((prev) => ({
            ...prev,
            address: street.trim(),
            city,
            state,
            zip,
          }));
        });

        autocompleteRef.current = autocomplete;
        console.log('Google Places Autocomplete initialized successfully');
        return true;
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
        return false;
      }
    };

    // Try to initialize with retries
    const maxAttempts = 10;
    let attempts = 0;
    
    const tryInit = () => {
      attempts++;
      if (initAutocomplete()) {
        return; // Success
      }
      
      if (attempts < maxAttempts) {
        setTimeout(tryInit, 500);
      } else {
        console.log('Failed to initialize Google Places after', maxAttempts, 'attempts');
      }
    };

    tryInit();

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, []);

  const isFormValid =
    !!formData.name &&
    !!formData.address &&
    !!formData.city &&
    !!formData.state &&
    !!formData.zip;

  return (
    <div className="space-y-6">
      {/* Location Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>

      {/* Street Address with Autocomplete */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          ref={inputRef}
          type="text"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Start typing address..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Google Places autocomplete enabled</p>
      </div>

      {/* City & State */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.state || ''}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="e.g., OR"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      {/* ZIP Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ZIP Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.zip || ''}
          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Manager Selector */}
      <ManagerSelector
        selected={formData.managers || []}
        onChange={(managers) => setFormData({ ...formData, managers })}
        availableManagers={['Sarah Chen', 'Mike Johnson', 'Emily Davis', 'Alex Thompson']}
      />

      {/* Next Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          Next: Hours →
        </button>
      </div>
    </div>
  );
}