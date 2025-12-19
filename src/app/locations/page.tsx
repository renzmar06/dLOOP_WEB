'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, ArrowUp, DollarSign, Plus, Settings, Power, MoreVertical } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout';

interface Location {
    _id: string;
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
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [formData, setFormData] = useState<Partial<Location>>({});
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [managerDropdownOpen, setManagerDropdownOpen] = useState(false);

    const AVAILABLE_MANAGERS = [
        'Sarah Chen',
        'Mike Johnson',
        'Emily Davis',
        'Alex Thompson',
    ];
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchLocations = async () => {
        try {
            const res = await fetch('/api/locations');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            const locationsData = data.success ? data.data : data;

            // Force every location to have string _id
            const normalized = locationsData.map((loc: any) => ({
                ...loc,
                _id: loc._id?.toString() || loc.id?.toString() || '',
                managers: loc.managers || [],
            }));

            setLocations(normalized.filter((loc: any) => loc._id)); // remove any invalid
        } catch (error) {
            console.error('Failed to fetch locations');
            toast.error('Failed to load locations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const totalCheckIns = locations.reduce((sum, loc) => sum + loc.checkIns, 0);
    const totalRedemptions = locations.reduce((sum, loc) => sum + loc.redemptions, 0);
    const totalPayouts = locations.reduce((sum, loc) => sum + loc.payouts, 0);
    const activeLocations = locations.filter(loc => loc.status === 'active').length;

    const openModal = (location?: Location) => {
        if (location) {
            setEditingLocation(location);
            setFormData({
                ...location,
                managers: location.managers || [],
            });
        } else {
            setEditingLocation(null);
            setFormData({
                name: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                phone: '',
                hours: '',
                materials: '',
                managers: [],
                status: 'active',
            });
        }
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLocation(null);
        setFormData({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const body = {
            ...formData,
            managers: formData.managers || [],
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
                fetchLocations();
                closeModal();
            } else {
                toast.error(data.error || 'Failed to save location');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Network error. Please try again.');
        }
    };

    const toggleStatus = async (location: Location) => {
        const id = location._id;

        try {
            const res = await fetch(`/api/locations/${id}`, { method: 'PATCH' });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                fetchLocations();
            } else {
                toast.error(data.error || 'Failed to update status');
            }
        } catch (error) {
            toast.error('Failed to toggle status');
        } finally {
            setActiveDropdown(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                Loading...
            </div>
        );
    }

    return (
        <Layout>

            <div className="min-h-screen bg-gray-50" ref={containerRef}>
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Locations</h1>
                            <p className="text-sm text-gray-600">Add and manage multiple business locations</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Location
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-teal-100 p-3 rounded-lg">
                                    <MapPin className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Active Locations</p>
                                    <p className="text-2xl font-bold text-gray-900">{activeLocations} / {locations.length}</p>
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
                                                <p>{location.address}, {location.city || 'Portland'}, {location.state || 'OR'}</p>
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
                                            className="flex-1 border rounded-lg py-2 text-sm flex items-center justify-center gap-2"
                                        >
                                            <Settings className="w-4 h-4" /> Manage
                                        </button>
                                    </div>
                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-6 top-20 z-30 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                                            <button
                                                onClick={() => openModal(location)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm"
                                            >
                                                <Settings className="w-4 h-4 text-gray-600" />
                                                Manage Settings
                                            </button>
                                            <button
                                                onClick={() => {
                                                    toast.info('Switch To Location - Coming soon');
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

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-6">
                                {editingLocation ? 'Edit Location' : 'Add New Location'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address || ''}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city || ''}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.state || ''}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.zip || ''}
                                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours of Operation</label>
                                    <textarea
                                        rows={3}
                                        value={formData.hours || ''}
                                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Materials Accepted</label>
                                    <textarea
                                        rows={3}
                                        value={formData.materials || ''}
                                        onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assign Manager(s)
                                    </label>

                                    {/* Select Box */}
                                    <div
                                        onClick={() => setManagerDropdownOpen(!managerDropdownOpen)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex justify-between items-center"
                                    >
                                        <span className="text-gray-600 text-sm">
                                            {formData.managers && formData.managers.length > 0
                                                ? formData.managers.join(', ')
                                                : 'Select managers...'}
                                        </span>
                                        <span className="text-gray-400">▾</span>
                                    </div>

                                    {/* Dropdown */}
                                    {managerDropdownOpen && (
                                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-sm max-h-48 overflow-auto">
                                            {AVAILABLE_MANAGERS.map((manager) => {
                                                const selected = formData.managers?.includes(manager);

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
                                                        className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selected}
                                                            readOnly
                                                            className="accent-teal-500"
                                                        />
                                                        {manager}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>


                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md"
                                    >
                                        {editingLocation ? 'Save Changes' : 'Add Location'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}