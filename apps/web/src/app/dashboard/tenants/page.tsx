'use client';

import { api } from '@/lib/api';
import useSWR from 'swr';
import { Plus, Trash2, Users, Crown, Activity, MoreHorizontal, Edit } from 'lucide-react';
import { useState, useMemo } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import TenantModal from '@/components/dashboard/tenants/tenant-modal';
import { motion } from 'framer-motion';

// Fetcher function
const fetcher = (url: string) => api.get(url).then((res) => res.data);

interface Tenant {
    id: string;
    name: string;
    plan: string;
}

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group"
    >
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${color}`}></div>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </motion.div>
);

export default function TenantsPage() {
    const { data: tenants, error, isLoading, mutate } = useSWR<Tenant[]>('/tenants', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tenantList = useMemo(() => tenants || [], [tenants]);

    const handleCreate = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.post('/tenants', data);
            setIsModalOpen(false);
            mutate();
        } catch (err) {
            console.error('Failed to create tenant:', err);
            alert('Failed to create tenant');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedTenant) return;
        setIsSubmitting(true);
        try {
            await api.patch(`/tenants/${selectedTenant.id}`, data);
            setIsModalOpen(false);
            setSelectedTenant(undefined);
            mutate();
        } catch (err) {
            console.error('Failed to update tenant:', err);
            alert('Failed to update tenant');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tenant? All data for this tenant will be inaccessible.')) return;
        try {
            await api.delete(`/tenants/${id}`);
            mutate();
        } catch (err) {
            console.error('Failed to delete tenant:', err);
            alert('Failed to delete tenant');
        }
    };

    const openCreateModal = () => {
        setSelectedTenant(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsModalOpen(true);
    };

    const columns: Column<Tenant>[] = [
        {
            header: 'Tenant Name',
            accessorKey: 'name',
            cell: (row: Tenant) => (
                <div className="flex items-center">
                    <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mr-3">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-bold text-gray-900 dark:text-white block">{row.name}</span>
                        <span className="text-xs text-gray-500 font-mono">ID: {row.id.split('-')[0]}...</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Subscription Plan',
            accessorKey: 'plan',
            cell: (row: Tenant) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${row.plan === 'enterprise'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400'
                        : row.plan === 'pro'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {row.plan}
                </span>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (row: Tenant) => (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(row)}
                        className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row.id)}
                        className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const stats = {
        total: tenantList.length,
        enterprise: tenantList.filter(t => t.plan === 'enterprise').length,
        pro: tenantList.filter(t => t.plan === 'pro').length,
    };

    return (
        <div className="space-y-8">
            {/* Header section with Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tenant Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage platform tenants, subscriptions, and access logic.</p>
                </div>
                <Button onClick={openCreateModal} className="shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tenant
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Tenants"
                    value={stats.total}
                    icon={Users}
                    color="bg-blue-500 text-blue-600"
                    delay={0.1}
                />
                <StatCard
                    title="Enterprise Tier"
                    value={stats.enterprise}
                    icon={Crown}
                    color="bg-purple-500 text-purple-600"
                    delay={0.2}
                />
                <StatCard
                    title="System Activity"
                    value="Stable"
                    icon={Activity}
                    color="bg-green-500 text-green-600"
                    delay={0.3}
                />
            </div>

            {/* Main Table section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <DataTable<Tenant>
                    data={tenantList}
                    columns={columns}
                    isLoading={isLoading}
                    searchKey="name"
                />
            </div>

            <TenantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={selectedTenant ? handleUpdate : handleCreate}
                tenant={selectedTenant}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
