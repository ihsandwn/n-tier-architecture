'use client';

import { motion } from 'framer-motion';

export default function Campaigns() {
    return (
        <section id="campaigns" className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                            Revolutionize Your Supply Chain
                        </h2>
                        <p className="mt-3 max-w-3xl text-lg text-gray-500 dark:text-gray-400">
                            Join thousands of businesses that trust OmniLogistics to manage their global operations.
                            Our platform scales with you, from a single warehouse to a worldwide network.
                        </p>
                        <div className="mt-8 sm:flex">
                            <div className="rounded-md shadow">
                                <a href="/register" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                    Start Free Trial
                                </a>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-3">
                                <a href="#" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                                    Contact Sales
                                </a>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mt-10 lg:mt-0 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl filter blur-3xl opacity-20 animate-pulse"></div>
                        <div className="relative rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 shadow-2xl">
                            {/* Abstract UI Mockup */}
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-800 rounded w-1/3"></div>
                                <div className="h-32 bg-gray-800 rounded w-full"></div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-24 bg-gray-800 rounded"></div>
                                    <div className="h-24 bg-gray-800 rounded"></div>
                                    <div className="h-24 bg-gray-800 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
