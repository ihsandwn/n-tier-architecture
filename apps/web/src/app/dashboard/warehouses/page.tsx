'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';
import useSWR from 'swr';
import { Plus, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function WarehousesPage() {
    const { user } = useAuth();
    // If user is Admin, they can create. If generic user, maybe read-only.
    const { data: warehouses, error, mutate } = useSWR('/warehouses', fetcher);
    const { data: tenants } = useSWR(user?.roles.includes('admin') ? '/tenants' : null, fetcher);

    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ name: '', location: '', tenantId: '' });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/warehouses', formData);
            setFormData({ name: '', location: '', tenantId: '' });
            setIsCreating(false);
            mutate();
        } catch (err) {
            alert('Failed to create warehouse');
        }
    };

    if (error) return <div>Failed to load</div>;
    if (!warehouses) return <div>Loading...</div>;

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
                {user?.roles.includes('admin') && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Warehouse
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="mb-6 p-4 bg-white rounded-lg shadow border">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                        />
                        <select
                            value={formData.tenantId}
                            onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                        >
                            <option value="">Select Tenant</option>
                            {tenants?.map((t: any) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">
                            Save
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {warehouses.map((wh: any) => (
                    <div key={wh.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">{wh.name}</h3>
                        <div className="flex items-center text-gray-500 mt-2 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {wh.location}
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <span className="text-xs text-gray-400 font-mono">{wh.id.substring(0, 8)}...</span>
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                {wh.tenant?.name || 'Unknown Tenant'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
