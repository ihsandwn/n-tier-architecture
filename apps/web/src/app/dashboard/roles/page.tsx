'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { api } from '@/lib/api';
import { Shield, Check, X, Lock, Plus, Edit, Trash2, Info, Save, Search, Filter } from 'lucide-react';
import { Fragment } from 'react';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface PermissionData {
    id: string;
    name: string;
    description: string | null;
}

interface RoleData {
    id: string;
    name: string;
    description: string | null;
    permissions: PermissionData[];
}

export default function RolesPage() {
    const { data: roles, isLoading: isRolesLoading, error: rolesError } = useSWR<RoleData[]>('/roles', fetcher);
    const { data: allPermissions, isLoading: isPermsLoading } = useSWR<PermissionData[]>('/permissions', fetcher);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', permissionIds: [] as string[] });
    const [searchQuery, setSearchQuery] = useState('');

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/roles', formData);
            mutate('/roles');
            setIsCreateModalOpen(false);
            setFormData({ name: '', description: '', permissionIds: [] });
        } catch (err) {
            console.error('Failed to create role:', err);
        }
    };

    const handleUpdateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;
        try {
            await api.patch(`/roles/${selectedRole.id}`, formData);
            mutate('/roles');
            setIsEditModalOpen(false);
            setSelectedRole(null);
        } catch (err) {
            console.error('Failed to update role:', err);
        }
    };

    const handleDeleteRole = async (id: string) => {
        if (!confirm('Are you sure? This will affect all users assigned to this role.')) return;
        try {
            await api.delete(`/roles/${id}`);
            mutate('/roles');
        } catch (err) {
            console.error('Failed to delete role:', err);
        }
    };

    const togglePermission = async (role: RoleData, permissionId: string) => {
        const hasPermission = role.permissions.some(p => p.id === permissionId);
        const newPermissionIds = hasPermission
            ? role.permissions.filter(p => p.id !== permissionId).map(p => p.id)
            : [...role.permissions.map(p => p.id), permissionId];

        try {
            await api.patch(`/roles/${role.id}`, { permissionIds: newPermissionIds });
            mutate('/roles');
        } catch (err) {
            console.error('Failed to toggle permission:', err);
        }
    };

    if (rolesError) return <div className="p-8 text-center text-red-500">Failed to load roles. Admin access required.</div>;

    const isLoading = isRolesLoading || isPermsLoading;

    // Group permissions by prefix (e.g., "users", "inventory")
    const groupedPermissions = allPermissions?.reduce((acc, perm) => {
        const [category] = perm.name.split(':');
        if (!acc[category]) acc[category] = [];
        acc[category].push(perm);
        return acc;
    }, {} as Record<string, PermissionData[]>);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="flex-1 w-full">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Define dynamic system roles and map granular permissions.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Filter roles..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans text-sm shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setFormData({ name: '', description: '', permissionIds: [] });
                            setIsCreateModalOpen(true);
                        }}
                        className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Role
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 animate-pulse space-y-4">
                    <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg w-full"></div>
                    <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg w-full"></div>
                    <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg w-full"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Role Name</th>
                                    <th className="px-6 py-4 font-bold">Description</th>
                                    <th className="px-6 py-4 font-bold text-center">Permissions</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {roles?.filter(role =>
                                    !searchQuery ||
                                    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    role.description?.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map(role => (
                                    <tr key={role.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-lg mr-3 ${role.name === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                    <Shield size={16} />
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white capitalize">{role.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-md truncate">
                                            {role.description || 'No description provided.'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                                                {role.permissions.length}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRole(role);
                                                        setFormData({
                                                            name: role.name,
                                                            description: role.description || '',
                                                            permissionIds: role.permissions.map(p => p.id)
                                                        });
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                                                    title="Edit Role"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {role.name !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteRole(role.id)}
                                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Delete Role"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Basic Pagination (UI only for now, since SWR handles global data) */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
                        <span>Showing 1 to {roles?.length} of {roles?.length} roles</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals for Create/Edit Role */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center">
                            <Shield className="w-6 h-6 mr-3 text-indigo-600" />
                            {isCreateModalOpen ? 'Create New Role' : 'Edit Role Definition'}
                        </h2>
                        <form onSubmit={isCreateModalOpen ? handleCreateRole : handleUpdateRole} className="space-y-6">
                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Internal Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. auditor"
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Description</label>
                                        <textarea
                                            rows={2}
                                            placeholder="Describe what this role should be used for..."
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Granular Permission Selection */}
                                <div className="pt-4 border-t dark:border-gray-700">
                                    <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                                        <Lock className="w-4 h-4 mr-2 text-indigo-500" />
                                        Assign Permissions
                                    </h3>
                                    <div className="space-y-6">
                                        {groupedPermissions && Object.entries(groupedPermissions).map(([category, perms]) => (
                                            <div key={category} className="space-y-2">
                                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 px-3 py-1.5 rounded-lg">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                                        {category}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const allIds = perms.map(p => p.id);
                                                            const areAllSelected = allIds.every(id => formData.permissionIds.includes(id));
                                                            const newIds = areAllSelected
                                                                ? formData.permissionIds.filter(id => !allIds.includes(id))
                                                                : Array.from(new Set([...formData.permissionIds, ...allIds]));
                                                            setFormData({ ...formData, permissionIds: newIds });
                                                        }}
                                                        className="text-[10px] font-medium text-gray-400 hover:text-indigo-600 transition-colors"
                                                    >
                                                        {perms.map(p => p.id).every(id => formData.permissionIds.includes(id)) ? 'Deselect All' : 'Select All'}
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
                                                    {perms.map(perm => {
                                                        const isChecked = formData.permissionIds.includes(perm.id);
                                                        return (
                                                            <label key={perm.id} className="flex items-center group cursor-pointer p-1">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                                                    checked={isChecked}
                                                                    onChange={() => {
                                                                        const newIds = isChecked
                                                                            ? formData.permissionIds.filter(id => id !== perm.id)
                                                                            : [...formData.permissionIds, perm.id];
                                                                        setFormData({ ...formData, permissionIds: newIds });
                                                                    }}
                                                                />
                                                                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                                                    {perm.name.split(':')[1].replace(/_/g, ' ')}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setIsEditModalOpen(false);
                                    }}
                                    className="px-5 py-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                                >
                                    {isCreateModalOpen ? 'Create Role' : 'Update Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
