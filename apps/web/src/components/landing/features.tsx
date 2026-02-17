'use client';

import { motion } from 'framer-motion';
import { Warehouse, Truck, BarChart3, Users, Zap, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: Warehouse,
        title: "Multi-Warehouse Management",
        description: "Track inventory across unlimited locations using interactive maps. Real-time sync."
    },
    {
        icon: Truck,
        title: "Smart Logistics",
        description: "Optimize routes and manage fleet dispatching with integrated tracking tools."
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Gain insights with predictive forecasting and real-time dashboards."
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Role-based access control (RBAC) ensures your team sees exactly what they need."
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Built on modern N-Tier architecture powered by Rust, Go, and Redis."
    },
    {
        icon: ShieldCheck,
        title: "Enterprise Security",
        description: "SOC2 compliant standards, end-to-end encryption, and automated backups."
    }
];

export default function Features() {
    return (
        <section id="features" className="bg-gray-50 dark:bg-gray-800 py-24">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <div className="max-w-screen-md mb-8 lg:mb-16 mx-auto text-center">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for Scale</h2>
                    <p className="text-gray-500 sm:text-xl dark:text-gray-400">Whatever your logistical challenge, OmniLogistics has the tools to solve it.</p>
                </div>
                <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-blue-100 lg:h-16 lg:w-16 dark:bg-blue-900">
                                <feature.icon className="w-6 h-6 text-blue-600 lg:w-8 lg:h-8 dark:text-blue-300" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
