'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'For small businesses just getting started.',
        features: ['Up to 5 Users', '1 Warehouse', 'Basic Inventory', 'Community Support'],
        cta: 'Start for Free',
        popular: false
    },
    {
        name: 'Pro',
        price: '$49',
        description: 'For growing companies with multiple locations.',
        features: ['Up to 20 Users', '5 Warehouses', 'Advanced Analytics', 'Priority Email Support', 'API Access'],
        cta: 'Get Started',
        popular: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations needing full control.',
        features: ['Unlimited Users', 'Unlimited Warehouses', 'Dedicated Account Manager', 'On-Premise Deployment', 'SLA Guarantee'],
        cta: 'Contact Sales',
        popular: false
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Simple, Transparent Pricing</h2>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Choose the plan that fits your business needs.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border ${plan.popular ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-50' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            {plan.popular && (
                                <span className="absolute top-0 right-0 -mt-3 mr-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                                    Most Popular
                                </span>
                            )}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">{plan.description}</p>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                                {plan.price !== 'Custom' && <span className="ml-1 text-xl text-gray-500">/month</span>}
                            </div>

                            <ul className="mt-6 space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Check className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="ml-3 text-base text-gray-600 dark:text-gray-300">{feature}</p>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8">
                                <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'}`}>
                                    {plan.cta}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
