'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { api } from '@/lib/api';
import { DataTable, Column } from '@/components/ui/data-table';
import {
    Plus,
    Search,
    Filter,
    UserRound,
    MoreHorizontal,
    Edit,
    Trash2,
    Shield,
    AlertCircle,
    CheckCircle,
    Mail,
    Phone,
    Calendar,
    XCircle,
    CheckCircle2
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface Role {
    id: string;
    name: string;
}

interface User {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    twoFactorEnabled: boolean;
    createdAt: string;
    roles: Role[];
}

export default function UsersPage() {
    const { data: users, isLoading, error } = useSWR<User[]>('/users', fetcher);
    const { data: roles } = useSWR<Role[]>('/roles', fetcher);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        password: '',
        roleIds: [] as string[]
    });

    const filteredUsers = users?.filter(user => {
        const matchesSearch =
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole =
            selectedRole === 'all' ||
            user.roles.some(r => r.name === selectedRole);

        return matchesSearch && matchesRole;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (selectedUser) {
                // Update User
                const { password, ...updateData } = formData;
                await api.patch(`/users/${selectedUser.id}`, {
                    ...updateData,
                    ...(password ? { password } : {})
                });
                toast.success('User updated successfully');
            } else {
                // Create User
                await api.post('/users', formData);
                toast.success('User created successfully');
            }
            mutate('/users');
            setIsModalOpen(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success('User deleted');
            mutate('/users');
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            toast.error('Failed to delete user', {
                description: error.response?.data?.message || 'An error occurred while communicating with the server.'
            });
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            name: user.name || '',
            phone: user.phone || '',
            password: '',
            roleIds: user.roles.map(r => r.id)
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setSelectedUser(null);
        setFormData({
            email: '',
            name: '',
            phone: '',
            password: '',
            roleIds: []
        });
        setIsModalOpen(true);
    };

    if (error) return <div className="p-8 text-center text-red-500">Failed to load users.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <UserRound className="w-6 h-6 mr-2 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage system users, their profiles, and assigned roles.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-3 md:w-48">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {roles?.map(r => (
                                <SelectItem key={r.id} value={r.name}>
                                    {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Users Table */}
            {isLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 space-y-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-50 dark:bg-gray-900 rounded-xl" />)}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Roles</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {filteredUsers?.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                    {(user.name || user.email).substring(0, 1).toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{user.name || 'Anonymous'}</div>
                                                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map(role => (
                                                    <span key={role.id} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {user.twoFactorEnabled ? (
                                                    <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        2FA Armed
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-gray-400 text-xs font-medium">
                                                        <Shield className="w-3 h-3 mr-1 opacity-50" />
                                                        Standard
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-400 hover:text-blue-600 rounded-lg transition-all"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/40 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold dark:text-white flex items-center">
                                {selectedUser ? <Edit className="w-5 h-5 mr-2 text-blue-600" /> : <Plus className="w-5 h-5 mr-2 text-blue-600" />}
                                {selectedUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        disabled={!!selectedUser}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all disabled:opacity-50"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1..."
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {selectedUser ? 'New Password (Optional)' : 'Password'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!selectedUser}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Roles</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {roles?.map(role => (
                                        <label key={role.id} className="flex items-center p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/40 cursor-pointer transition-all">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                checked={formData.roleIds.includes(role.id)}
                                                onChange={(e) => {
                                                    const newIds = e.target.checked
                                                        ? [...formData.roleIds, role.id]
                                                        : formData.roleIds.filter(id => id !== role.id);
                                                    setFormData({ ...formData, roleIds: newIds });
                                                }}
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t dark:border-gray-700 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all font-sans"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : (selectedUser ? 'Save Changes' : 'Create User')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
