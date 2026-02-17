'use client';

import { useState } from 'react';

import useSWR, { mutate } from 'swr';
import { api } from '@/lib/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, User, Search } from 'lucide-react';
import { AddDriverModal } from './add-driver-modal';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function DriversList() {
    const { data: drivers, isLoading } = useSWR<any[]>('/drivers', fetcher);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this driver?')) return;
        try {
            await api.delete(`/drivers/${id}`);
            mutate('/drivers');
        } catch (error) {
            console.error('Failed to delete driver:', error);
            alert('Failed to delete driver');
        }
    };

    if (isLoading) return <div>Loading drivers...</div>;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search driver name..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <AddDriverModal />
            </div>

            <div className="border rounded-lg dark:border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Name</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">License</TableHead>
                            <TableHead className="text-right text-gray-900 dark:text-gray-100">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drivers?.filter(d =>
                            !searchQuery ||
                            d.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No drivers found
                                </TableCell>
                            </TableRow>
                        ) : (
                            drivers?.filter(d =>
                                !searchQuery ||
                                d.name.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((driver) => (
                                <TableRow key={driver.id}>
                                    <TableCell>
                                        <User className="w-8 h-8 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500" />
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{driver.name}</TableCell>
                                    <TableCell className="font-mono text-gray-500 dark:text-gray-400">{driver.license}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            onClick={() => handleDelete(driver.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
