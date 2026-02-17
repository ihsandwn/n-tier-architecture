'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Warehouse } from 'lucide-react';
import Link from 'next/link';

// Fix Leaflet Default Icon issue in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WarehouseLocation {
    id: string;
    name: string;
    location: string;
    lat: number;
    lng: number;
    capacity: number;
}

export default function WarehouseMap({ warehouses }: { warehouses: WarehouseLocation[] }) {
    // Default to a central location (e.g., Jakarta or user's region) if no warehouses or invalid data
    const center: [number, number] = warehouses.length > 0 && warehouses[0].lat && warehouses[0].lng
        ? [warehouses[0].lat, warehouses[0].lng]
        : [-6.2088, 106.8456]; // Jakarta Default

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 relative z-0">
            <MapContainer center={center} zoom={4} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {warehouses.map((warehouse) => (
                    <Marker key={warehouse.id} position={[warehouse.lat || 0, warehouse.lng || 0]}>
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg mb-1">{warehouse.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{warehouse.location}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                                    <span>Capacity: {warehouse.capacity}</span>
                                    <span>ID: {warehouse.id}</span>
                                </div>
                                <Link href={`/dashboard/warehouses/${warehouse.id}`} className="block w-full text-center bg-blue-600 text-white py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors">
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
