'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Column<T> {
    header: string;
    accessorKey: keyof T | ((row: T) => any);
    cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchKey?: keyof T;
    searchKeys?: (keyof T | string)[]; // Supports nested keys via custom logic or simple keys
    customFilter?: (item: T) => boolean;
    onRowClick?: (row: T) => void;
    isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchKey,
    searchKeys,
    customFilter,
    onRowClick,
    isLoading,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const itemsPerPage = 10;

    // Filter
    const filteredData = useMemo(() => {
        let result = data;

        // Apply Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => {
                if (searchKeys) {
                    return searchKeys.some(key => {
                        const value = typeof key === 'string' && key.includes('.')
                            ? key.split('.').reduce((obj, k) => (obj as any)?.[k], item)
                            : item[key as keyof T];
                        return String(value || '').toLowerCase().includes(query);
                    });
                }
                if (searchKey) {
                    return String(item[searchKey] || '').toLowerCase().includes(query);
                }
                return true;
            });
        }

        // Apply Custom Filter
        if (customFilter) {
            result = result.filter(customFilter);
        }

        return result;
    }, [data, searchKey, searchKeys, searchQuery, customFilter]);

    // Sort
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;
        return [...filteredData].sort((a, b) => {
            // @ts-ignore
            const aValue = a[sortConfig.key];
            // @ts-ignore
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Paginate
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header / Actions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                {searchKey && (
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 font-medium">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => typeof col.accessorKey === 'string' && handleSort(col.accessorKey as string)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{col.header}</span>
                                        <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {columns.map((_, idx) => (
                                        <td key={idx} className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <AnimatePresence>
                                {paginatedData.map((row) => (
                                    <motion.tr
                                        key={row.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        className={`group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                    >
                                        {columns.map((col, idx) => (
                                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                                                {col.cell ? col.cell(row) : (
                                                    typeof col.accessorKey === 'function'
                                                        ? col.accessorKey(row)
                                                        : (row[col.accessorKey] as React.ReactNode)
                                                )}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                        {!isLoading && paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
                </p>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
