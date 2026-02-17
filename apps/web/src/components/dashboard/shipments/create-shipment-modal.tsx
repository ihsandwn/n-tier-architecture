'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { Loader2, Truck } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

interface CreateShipmentModalProps {
    orderId: string;
    onSuccess?: () => void;
}

export function CreateShipmentModal({ orderId, onSuccess }: CreateShipmentModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        driverId: '',
        vehicleId: '',
        trackingNumber: '',
    });

    const { data: drivers } = useSWR<any[]>('/drivers', fetcher);
    const { data: vehicles } = useSWR<any[]>('/vehicles', fetcher);

    // Generate specific tracking number on open if empty
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen && !formData.trackingNumber) {
            setFormData(prev => ({ ...prev, trackingNumber: `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}` }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/shipments', {
                orderId,
                ...formData
            });
            mutate(`/orders/${orderId}`); // Refresh order details
            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to create shipment:', error);
            alert('Failed to create shipment');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Truck className="w-4 h-4 mr-2" />
                    Create Shipment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Shipment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Driver</Label>
                        <Select
                            value={formData.driverId}
                            onValueChange={(value) => setFormData({ ...formData, driverId: value })}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Driver" />
                            </SelectTrigger>
                            <SelectContent>
                                {drivers?.map((driver) => (
                                    <SelectItem key={driver.id} value={driver.id}>{driver.name} ({driver.license})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Vehicle</Label>
                        <Select
                            value={formData.vehicleId}
                            onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicles?.map((vehicle) => (
                                    <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.plateNumber} ({vehicle.type})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Tracking Number</Label>
                        <Input
                            value={formData.trackingNumber}
                            onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 text-white">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Shipment
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
