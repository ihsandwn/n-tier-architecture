'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { api } from '@/lib/api';
import { DataTable, Column } from '@/components/ui/data-table';
import { Plus, User, Shield, MoreHorizontal, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface UserData {
    id: string;
    email: string;
    roles: string[];
    createdAt: string;
}

export default function UsersPage() {
    const { data: users, isLoading, error } = useSWR<UserData[]>('/users', fetcher);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    // Form States
    const [formData, setFormData] = useState({ email: '', password: '', roles: ['user'] });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            mutate('/users');
            setIsCreateModalOpen(false);
            setFormData({ email: '', password: '', roles: ['user'] });
            // Add toast notification here
        } catch (err) {
            console.error('Failed to create user:', err);
            // Add error handling
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            await api.patch(`/users/${selectedUser.id}`, { roles: formData.roles });
            mutate('/users');
            setIsEditModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Failed to update user:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            mutate('/users');
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    const columns: Column<UserData>[] = [
        {
            header: 'User',
            accessorKey: 'email',
            cell: (row: UserData) => (
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mr-3">
                        <User className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{row.email}</p>
                        <p className="text-xs text-gray-500">ID: {row.id.substring(0, 8)}...</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Roles',
            accessorKey: 'roles',
            cell: (row: UserData) => (
                <div className="flex flex-wrap gap-1">
                    {row.roles.map(role => (
                        <span key={role} className={`px-2 py-0.5 rounded text-xs font-medium border ${role === 'admin'
                            ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                            : role === 'manager'
                                ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                                : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                            }`}>
                            {role}
                        </span>
                    ))}
                </div>
            )
        },
        {
            header: 'Joined',
            accessorKey: 'createdAt',
            cell: (row: UserData) => (
                <span className="text-sm text-gray-500">
                    {format(new Date(row.createdAt), 'MMM d, yyyy')}
                </span>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (row: UserData) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setSelectedUser(row);
                            setFormData({ ...formData, roles: row.roles });
                            setIsEditModalOpen(true);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-blue-600 transition-colors"
                        title="Edit Roles"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete User"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (error) return <div className="p-8 text-center text-red-500">Failed to load users. You might not have permission.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage system access and assign roles.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-64 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-full"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <DataTable data={users || []} columns={columns} searchKey="email" />
                </div>
            )}

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Add New User</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Roles</label>
                                <select
                                    multiple
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24"
                                    value={formData.roles}
                                    onChange={e => setFormData({ ...formData, roles: Array.from(e.target.selectedOptions, option => option.value) })}
                                >
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Edit User: {selectedUser.email}</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Roles</label>
                                <select
                                    multiple
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24"
                                    value={formData.roles}
                                    onChange={e => setFormData({ ...formData, roles: Array.from(e.target.selectedOptions, option => option.value) })}
                                >
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
