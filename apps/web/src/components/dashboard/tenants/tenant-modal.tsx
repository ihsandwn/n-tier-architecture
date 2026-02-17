'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Tenant {
    id: string;
    name: string;
    plan: string;
}

interface TenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; plan: string }) => Promise<void>;
    tenant?: Tenant;
    isSubmitting: boolean;
}

export default function TenantModal({
    isOpen,
    onClose,
    onSubmit,
    tenant,
    isSubmitting,
}: TenantModalProps) {
    const [name, setName] = useState('');
    const [plan, setPlan] = useState('free');

    useEffect(() => {
        if (tenant) {
            setName(tenant.name);
            setPlan(tenant.plan);
        } else {
            setName('');
            setPlan('free');
        }
    }, [tenant, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({ name, plan });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{tenant ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
                        <DialogDescription>
                            {tenant
                                ? 'Update the details for this tenant.'
                                : 'Enter the details for the new logistics tenant.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tenant Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Acme Logistics"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="plan">Subscription Plan</Label>
                            <select
                                id="plan"
                                value={plan}
                                onChange={(e) => setPlan(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="free">Free</option>
                                <option value="pro">Pro</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : tenant ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
