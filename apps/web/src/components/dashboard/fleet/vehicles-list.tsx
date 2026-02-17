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
import { Trash2, Truck, Car, Bike, Search } from 'lucide-react';
import { AddVehicleModal } from './add-vehicle-modal';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function VehiclesList() {
    const { data: vehicles, isLoading } = useSWR<any[]>('/vehicles', fetcher);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            await api.delete(`/vehicles/${id}`);
            mutate('/vehicles');
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
            alert('Failed to delete vehicle');
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'truck': return <Truck className="w-4 h-4" />;
            case 'van': return <Car className="w-4 h-4" />; // Using Car for Van for now
            case 'bike': return <Bike className="w-4 h-4" />;
            default: return <Truck className="w-4 h-4" />;
        }
    };

    if (isLoading) return <div>Loading vehicles...</div>;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search plate number..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <AddVehicleModal />
            </div>

            <div className="border rounded-lg dark:border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-gray-900 dark:text-gray-100">Type</TableHead>
                            <TableHead className="text-gray-900 dark:text-gray-100">Plate Number</TableHead>
                            <TableHead className="text-right text-gray-900 dark:text-gray-100">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles?.filter(v =>
                            !searchQuery ||
                            v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No vehicles found
                                </TableCell>
                            </TableRow>
                        ) : (
                            vehicles?.filter(v =>
                                !searchQuery ||
                                v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((vehicle) => (
                                <TableRow key={vehicle.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2 capitalize text-gray-900 dark:text-gray-100">
                                            {getIcon(vehicle.type)}
                                            {vehicle.type}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-gray-900 dark:text-gray-100">{vehicle.plateNumber}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            onClick={() => handleDelete(vehicle.id)}
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
