'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';
import useSWR from 'swr';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Fetcher function
const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function TenantsPage() {
    const { data: tenants, error, mutate } = useSWR('/tenants', fetcher);
    const [isCreating, setIsCreating] = useState(false);
    const [newTenantName, setNewTenantName] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tenants', { name: newTenantName, plan: 'free' });
            setNewTenantName('');
            setIsCreating(false);
            mutate(); // Refresh list
        } catch (err) {
            alert('Failed to create tenant');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/tenants/${id}`);
            mutate();
        } catch (err) {
            alert('Failed to delete tenant');
        }
    };

    if (error) return <div>Failed to load</div>;
    if (!tenants) return <div>Loading...</div>;

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Tenant
                </button>
            </div>

            {isCreating && (
                <div className="mb-6 p-4 bg-white rounded-lg shadow border">
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Tenant Name"
                            value={newTenantName}
                            onChange={(e) => setNewTenantName(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg"
                            required
                        />
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plan
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tenants.map((tenant: any) => (
                            <tr key={tenant.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {tenant.id.split('-')[0]}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {tenant.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {tenant.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(tenant.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
