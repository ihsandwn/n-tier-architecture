'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface WarehouseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
    isSubmitting: boolean;
}

export default function WarehouseModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: WarehouseModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        lat: '',
        lng: '',
        capacity: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                location: initialData.location,
                lat: initialData.lat?.toString() || '',
                lng: initialData.lng?.toString() || '',
                capacity: initialData.capacity?.toString() || '0',
            });
        } else {
            // Reset for create mode
            setFormData({
                name: '',
                location: '',
                lat: '',
                lng: '',
                capacity: '',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            ...formData,
            lat: parseFloat(formData.lat) || 0,
            lng: parseFloat(formData.lng) || 0,
            capacity: parseInt(formData.capacity) || 0,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4 dark:text-white">
                    {initialData ? 'Edit Warehouse' : 'Add New Warehouse'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Warehouse Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Central Hub"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Location</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            placeholder="City, State"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.lat}
                                onChange={e => setFormData({ ...formData, lat: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.lng}
                                onChange={e => setFormData({ ...formData, lng: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Capacity</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.capacity}
                            onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                            placeholder="Max items"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                                    Saving...
                                </>
                            ) : (
                                initialData ? 'Save Changes' : 'Create Warehouse'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
