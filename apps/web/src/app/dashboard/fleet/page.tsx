'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VehiclesList } from '@/components/dashboard/fleet/vehicles-list';
import { DriversList } from '@/components/dashboard/fleet/drivers-list';

export default function FleetPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Fleet Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your vehicles and drivers.</p>
            </div>

            <Tabs defaultValue="vehicles" className="w-full">
                <TabsList className="mb-4 text-gray-900 dark:text-gray-100">
                    <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                    <TabsTrigger value="drivers">Drivers</TabsTrigger>
                </TabsList>
                <TabsContent value="vehicles">
                    <VehiclesList />
                </TabsContent>
                <TabsContent value="drivers">
                    <DriversList />
                </TabsContent>
            </Tabs>
        </div>
    );
}
