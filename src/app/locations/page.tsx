'use client';

import React, { useState, useEffect, useRef } from 'react';

// Google Maps type declarations
declare global {
    interface Window {
        google: any;
    }
}
import {
    MapPin,
    Users,
    ArrowUp,
    DollarSign,
    Plus,
    Settings,
    Power,
    MoreVertical,
    ChevronDown,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAppSelector } from '@/redux/hooks';
import Layout from '@/components/Layout';

interface Location {
    _id: string;
    userId: string;
    name: string;
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    hours?: string; // JSON string of structured hours
    materials?: string;
    status: 'active' | 'inactive';
    managers: string[];
    checkIns: number;
    redemptions: number;
    payouts: number;
}

interface DayHours {
    open: boolean;
    from: string;
    to: string;
}

interface StructuredHours {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
}

export default function LocationsDashboard() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [formData, setFormData] = useState<Partial<Location>>({});
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [managerDropdownOpen, setManagerDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'materials'>('info');

    const [structuredHours, setStructuredHours] = useState<StructuredHours>({
        monday: { open: true, from: '09:00', to: '17:00' },
        tuesday: { open: true, from: '09:00', to: '17:00' },
        wednesday: { open: true, from: '09:00', to: '17:00' },
        thursday: { open: true, from: '09:00', to: '17:00' },
        friday: { open: true, from: '09:00', to: '17:00' },
        saturday: { open: true, from: '09:00', to: '17:00' },
        sunday: { open: true, from: '09:00', to: '17:00' },
    });

    const { user } = useAppSelector((state) => state.auth);

    const AVAILABLE_MANAGERS = [
        'Sarah Chen',
        'Mike Johnson',
        'Emily Davis',
        'Alex Thompson',
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);

    // Load Google Maps script
    useEffect(() => {
        if (typeof window === 'undefined' || window.google?.maps?.places) return;

        if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }, []);

    // Google Places Autocomplete
    useEffect(() => {
        if (!isModalOpen || !addressInputRef.current || !window.google?.maps?.places) return;

        if (autocompleteRef.current) {
            window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }

        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
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
                address: street.trim() || prev.address || '',
                city: city || prev.city || '',
                state: state || prev.state || '',
                zip: zip || prev.zip || '',
            }));
        });

        autocompleteRef.current = autocomplete;
        setTimeout(() => addressInputRef.current?.focus(), 200);

        return () => {
            if (autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                autocompleteRef.current = null;
            }
        };
    }, [isModalOpen]);

    const fetchLocations = async () => {
        try {
            const userId = user?.id;
            if (!userId) {
                setLocations([]);
                return;
            }

            const res = await fetch(`/api/locations?userId=${userId}`);
            if (!res.ok) throw new Error('Failed to fetch locations');

            const data = await res.json();
            const locationsData = data.success ? data.data : data;

            const normalized: Location[] = (locationsData || []).map((loc: any) => ({
                _id: loc._id?.toString() || '',
                userId: loc.userId || '',
                name: loc.name || 'Unnamed Location',
                address: loc.address || '',
                city: loc.city || '',
                state: loc.state || '',
                zip: loc.zip || '',
                phone: loc.phone || '',
                hours: loc.hours || '',
                materials: loc.materials || '',
                status: loc.status || 'active',
                managers: Array.isArray(loc.managers) ? loc.managers : [],
                checkIns: Number(loc.checkIns) || 0,
                redemptions: Number(loc.redemptions) || 0,
                payouts: Number(loc.payouts) || 0,
            }));

            setLocations(normalized.filter((loc) => loc._id));
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to load locations');
        }
    };

    useEffect(() => {
        if (user?.id) fetchLocations();
    }, [user?.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setManagerDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const totalCheckIns = locations.reduce((sum, loc) => sum + loc.checkIns, 0);
    const totalRedemptions = locations.reduce((sum, loc) => sum + loc.redemptions, 0);
    const totalPayouts = locations.reduce((sum, loc) => sum + loc.payouts, 0);
    const activeLocations = locations.filter((loc) => loc.status === 'active').length;

    const openModal = (location?: Location) => {
        if (location) {
            setEditingLocation(location);
            setFormData({ ...location, managers: location.managers || [] });

            if (location.hours) {
                try {
                    const parsed = JSON.parse(location.hours);
                    if (typeof parsed === 'object' && parsed.monday) {
                        setStructuredHours(parsed);
                    }
                } catch (e) {
                    console.log('Invalid hours JSON, using defaults');
                }
            }
        } else {
            setEditingLocation(null);
            setFormData({
                name: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                phone: '',
                materials: '',
                managers: [],
                status: 'active',
                userId: user?.id,
            });
            setStructuredHours({
                monday: { open: true, from: '09:00', to: '17:00' },
                tuesday: { open: true, from: '09:00', to: '17:00' },
                wednesday: { open: true, from: '09:00', to: '17:00' },
                thursday: { open: true, from: '09:00', to: '17:00' },
                friday: { open: true, from: '09:00', to: '17:00' },
                saturday: { open: true, from: '09:00', to: '17:00' },
                sunday: { open: true, from: '09:00', to: '17:00' },
            });
        }
        setActiveTab('info');
        setIsModalOpen(true);
        setManagerDropdownOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLocation(null);
        setFormData({});
        setManagerDropdownOpen(false);
        setActiveTab('info');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = user?.id;
        if (!userId) {
            toast.error('You must be logged in to manage locations');
            return;
        }

        const body = {
            ...formData,
            userId,
            managers: formData.managers || [],
            hours: JSON.stringify(structuredHours),
        };

        const id = editingLocation?._id;
        const url = editingLocation ? `/api/locations/${id}` : '/api/locations';
        const method = editingLocation ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message || 'Location saved successfully');
                await fetchLocations();
                closeModal();
            } else {
                toast.error(data.error || 'Failed to save location');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        }
    };

    const toggleStatus = async (location: Location) => {
        try {
            const res = await fetch(`/api/locations/${location._id}`, { method: 'PATCH' });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success(data.message || 'Status updated');
                await fetchLocations();
            } else {
                toast.error(data.error || 'Failed to update status');
            }
        } catch (error) {
            toast.error('Failed to toggle status');
        } finally {
            setActiveDropdown(null);
        }
    };

    const generateTimeOptions = () => {
        const options = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                options.push(<option key={time} value={time}>{time}</option>);
            }
        }
        return options;
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50" ref={containerRef}>
                <div className="max-w-7xl mx-auto px-4 ">
                    {/* Header */}
                    <header className="mb-8 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
                        <div className="px-6 py-4 flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">Locations</h1>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Add and manage multiple business locations
                                </p>
                            </div>
                            <button
                                onClick={() => openModal()}
                                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add New Location
                            </button>
                        </div>
                    </header>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-teal-100 p-3 rounded-lg">
                                    <MapPin className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Active Locations</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {activeLocations} / {locations.length}
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
                                    <p className="text-xs text-gray-500">Today across all locations</p>
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
                                    <p className="text-xs text-gray-500">Today across all locations</p>
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
                                    <p className="text-xs text-gray-500">Today across all locations</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Locations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {locations.map((location) => {
                            const isDropdownOpen = activeDropdown === location._id;

                            return (
                                <div
                                    key={location._id}
                                    className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-visible hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 pr-4">{location.name}</h3>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${location.status === 'active'
                                                            ? 'bg-teal-100 text-teal-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {location.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                                <button
                                                    onClick={() => setActiveDropdown(isDropdownOpen ? null : location._id)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-5">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                            <div>
                                                <p>
                                                    {location.address}, {location.city || 'Portland'}, {location.state || 'OR'}
                                                </p>
                                                <p className="font-medium">{location.zip}</p>
                                            </div>
                                        </div>

                                        <div className="mb-6 flex items-center gap-3 text-sm text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <span className="font-medium">Managers:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {location.managers.length > 0 ? (
                                                    location.managers.map((manager, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-medium text-xs"
                                                        >
                                                            {manager}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400">None assigned</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Check-ins Today</span>
                                                <span className="text-2xl font-bold text-gray-900">{location.checkIns}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Redemptions Today</span>
                                                <span className="text-xl font-semibold text-gray-900">{location.redemptions}</span>
                                            </div>
                                            <div className="flex justify-between pt-3 border-t border-gray-100">
                                                <span className="text-sm text-gray-600">Payouts Today</span>
                                                <span className="text-2xl font-bold text-teal-600">
                                                    ${location.payouts.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 px-5 pb-5">
                                        <button
                                            onClick={() => openModal(location)}
                                            className="flex-1 border rounded-lg py-2 text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
                                        >
                                            <Settings className="w-4 h-4" /> Manage
                                        </button>
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute right-6 top-20 z-40 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                                            <button
                                                onClick={() => {
                                                    openModal(location);
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm"
                                            >
                                                <Settings className="w-4 h-4 text-gray-600" />
                                                Manage Settings
                                            </button>
                                            <button
                                                onClick={() => {
                                                    toast('Switch To Location - Coming soon');
                                                    setActiveDropdown(null);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm"
                                            >
                                                <ArrowUp className="w-4 h-4 rotate-90 text-gray-600" />
                                                Switch To Location
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(location)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-red-600"
                                            >
                                                <Power className="w-4 h-4" />
                                                {location.status === 'active' ? 'Disable' : 'Enable'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Toaster position="top-right" />

                {/* Modal with Tabs */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingLocation ? 'Edit Location' : 'Add New Location'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('info')}
                                    className={`px-8 py-4 text-sm font-medium transition-colors ${activeTab === 'info'
                                            ? 'text-teal-600 border-b-2 border-teal-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Location Information
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('hours')}
                                    className={`px-8 py-4 text-sm font-medium transition-colors ${activeTab === 'hours'
                                            ? 'text-teal-600 border-b-2 border-teal-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Working Hours
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('materials')}
                                    className={`px-8 py-4 text-sm font-medium transition-colors ${activeTab === 'materials'
                                            ? 'text-teal-600 border-b-2 border-teal-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Materials Accepted
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                {/* Tab: Location Information */}
                                {activeTab === 'info' && (
                                    <div className="space-y-6 pb-12">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Location Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name || ''}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Street Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                ref={addressInputRef}
                                                type="text"
                                                required
                                                value={formData.address || ''}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                placeholder="Start typing an address..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Start typing for address suggestions (powered by Google)
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.city || ''}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    State <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.state || ''}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    placeholder="e.g., OR"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ZIP Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.zip || ''}
                                                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

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

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Assign Manager(s)
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setManagerDropdownOpen(!managerDropdownOpen)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex justify-between items-center hover:border-gray-400 transition-colors"
                                            >
                                                <span className={`text-sm ${formData.managers?.length ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {(formData.managers?.length ?? 0) > 0
                                                        ? formData.managers?.join(', ')
                                                        : 'Select managers...'}
                                                </span>
                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${managerDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {managerDropdownOpen && (
                                                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                    {AVAILABLE_MANAGERS.map((manager) => {
                                                        const selected = formData.managers?.includes(manager) || false;
                                                        return (
                                                            <div
                                                                key={manager}
                                                                onClick={() => {
                                                                    const current = formData.managers || [];
                                                                    const updated = selected
                                                                        ? current.filter((m) => m !== manager)
                                                                        : [...current, manager];
                                                                    setFormData({ ...formData, managers: updated });
                                                                }}
                                                                className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer text-sm"
                                                            >
                                                                <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                                                                    {selected && <div className="w-3 h-3 bg-teal-500 rounded-sm" />}
                                                                </div>
                                                                {manager}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Tab: Working Hours */}
                                {activeTab === 'hours' && (
                                    <div className="space-y-6 pb-12">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-gray-700">
                                                Hours of Operation <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const allOpen: StructuredHours = {
                                                            monday: { open: true, from: '09:00', to: '17:00' },
                                                            tuesday: { open: true, from: '09:00', to: '17:00' },
                                                            wednesday: { open: true, from: '09:00', to: '17:00' },
                                                            thursday: { open: true, from: '09:00', to: '17:00' },
                                                            friday: { open: true, from: '09:00', to: '17:00' },
                                                            saturday: { open: true, from: '09:00', to: '17:00' },
                                                            sunday: { open: true, from: '09:00', to: '17:00' },
                                                        };
                                                        setStructuredHours(allOpen);
                                                    }}
                                                    className="text-xs px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    Set All Open
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const allClosed: StructuredHours = {
                                                            monday: { open: false, from: '09:00', to: '17:00' },
                                                            tuesday: { open: false, from: '09:00', to: '17:00' },
                                                            wednesday: { open: false, from: '09:00', to: '17:00' },
                                                            thursday: { open: false, from: '09:00', to: '17:00' },
                                                            friday: { open: false, from: '09:00', to: '17:00' },
                                                            saturday: { open: false, from: '09:00', to: '17:00' },
                                                            sunday: { open: false, from: '09:00', to: '17:00' },
                                                        };
                                                        setStructuredHours(allClosed);
                                                    }}
                                                    className="text-xs px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    Set All Closed
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                                                const dayKey = day as keyof StructuredHours;
                                                const hours = structuredHours[dayKey];
                                                const capitalized = day.charAt(0).toUpperCase() + day.slice(1);

                                                return (
                                                    <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                                                        <div className="w-24 text-sm font-medium text-gray-700">
                                                            {capitalized}
                                                        </div>

                                                        <input
                                                            type="checkbox"
                                                            checked={hours.open}
                                                            onChange={(e) =>
                                                                setStructuredHours((prev) => ({
                                                                    ...prev,
                                                                    [dayKey]: { ...prev[dayKey], open: e.target.checked },
                                                                }))
                                                            }
                                                            className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                                                        />
                                                        <span className="text-sm text-gray-600 w-12">Open</span>

                                                        <select
                                                            value={hours.from}
                                                            disabled={!hours.open}
                                                            onChange={(e) =>
                                                                setStructuredHours((prev) => ({
                                                                    ...prev,
                                                                    [dayKey]: { ...prev[dayKey], from: e.target.value },
                                                                }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                                                        >
                                                            {generateTimeOptions()}
                                                        </select>

                                                        <span className="text-sm text-gray-500">to</span>

                                                        <select
                                                            value={hours.to}
                                                            disabled={!hours.open}
                                                            onChange={(e) =>
                                                                setStructuredHours((prev) => ({
                                                                    ...prev,
                                                                    [dayKey]: { ...prev[dayKey], to: e.target.value },
                                                                }))
                                                            }
                                                            className="px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                                                        >
                                                            {generateTimeOptions()}
                                                        </select>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Tab: Materials Accepted (with action buttons) */}
                                {activeTab === 'materials' && (
                                    <>
                                        <div className="space-y-6 pb-12">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Materials Accepted
                                                </label>
                                                <textarea
                                                    rows={8}
                                                    value={formData.materials || ''}
                                                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                                                    placeholder="List materials this location accepts, one per line or comma-separated...&#10;e.g.&#10;Aluminum cans&#10;Plastic bottles (#1-7)&#10;Glass bottles&#10;Cardboard"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    This information will be shown to customers checking in.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons - Only on the last tab */}
                                        <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
                                            >
                                                {editingLocation ? 'Save Changes' : 'Add Location'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}