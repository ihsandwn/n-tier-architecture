'use client';

import { Shield, Check, X, Lock } from 'lucide-react';
import { Fragment } from 'react';

const PERMISSIONS = {
    'Dashboard': {
        'View Analytics': ['admin', 'manager'],
        'View Activity Logs': ['admin'],
    },
    'Identity & Access': {
        'Manage Users': ['admin'],
        'Manage Roles': ['admin'],
        'Audit Logs': ['admin'],
    },
    'Inventory': {
        'View Stock': ['admin', 'manager', 'user'],
        'Adjust Stock': ['admin', 'manager'],
        'Manage Warehouses': ['admin'],
    },
    'Products': {
        'View Products': ['admin', 'manager', 'user'],
        'Create/Edit Products': ['admin', 'manager'],
        'Delete Products': ['admin'],
    }
};

const ROLES = [
    { key: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    { key: 'manager', label: 'Manager', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { key: 'user', label: 'User', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
];

export default function RolesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Overview of system roles and their assigned permissions.</p>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ROLES.map(role => (
                    <div key={role.key} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 ${role.key === 'admin' ? 'text-purple-500' : 'text-gray-500'}`}>
                            <Shield className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${role.color}`}>
                                {role.label}
                            </span>
                            <h3 className="text-lg font-bold mt-4 text-gray-900 dark:text-white">
                                {role.key === 'admin' ? 'Full Access' : role.key === 'manager' ? 'Operational Access' : 'Read-Only Access'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">
                                {role.key === 'admin'
                                    ? 'Can manage users, settings, and all data.'
                                    : role.key === 'manager'
                                        ? 'Can manage products and inventory.'
                                        : 'Can view data but cannot modify critical settings.'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Permission Matrix */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Permission Matrix</h2>
                    <span className="text-xs text-gray-500 flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        <Lock className="w-3 h-3 mr-1" /> System Defined
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Permission</th>
                                {ROLES.map(role => (
                                    <th key={role.key} className="px-6 py-3 text-center">{role.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(PERMISSIONS).map(([category, actions]) => (
                                <Fragment key={category}>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/80 border-y border-gray-100 dark:border-gray-700">
                                        <td colSpan={4} className="px-6 py-2 font-bold text-gray-900 dark:text-white">{category}</td>
                                    </tr>
                                    {Object.entries(actions).map(([action, allowedRoles]) => (
                                        <tr key={action} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300 pl-10">
                                                {action}
                                            </td>
                                            {ROLES.map(role => {
                                                const isAllowed = allowedRoles.includes(role.key);
                                                return (
                                                    <td key={role.key} className="px-6 py-4 text-center">
                                                        {isAllowed ? (
                                                            <div className="flex justify-center">
                                                                <Check className="w-5 h-5 text-green-500" />
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-center">
                                                                <X className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
