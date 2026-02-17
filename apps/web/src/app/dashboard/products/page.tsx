'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';
import { DataTable, Column } from '@/components/ui/data-table';
import { Plus, Package, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductModal from '@/components/dashboard/product-modal';
import ImportProductsModal from '@/components/dashboard/products/import-modal';
import {
    Search,
    Filter,
    ChevronDown,
    ArrowUpDown,
    Upload
} from 'lucide-react';
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    price: number;
    updatedAt: string;
}

export default function ProductsPage() {
    const { data: products, error, isLoading, mutate } = useSWR<Product[]>('/products', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [priceFilter, setPriceFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter valid products and apply local filtering
    const productList = useMemo(() => {
        let list = Array.isArray(products) ? products : (products as any)?.data || [];

        if (priceFilter !== 'all') {
            const [min, max] = priceFilter.split('-').map(Number);
            list = list.filter((p: Product) => {
                if (max) return p.price >= min && p.price <= max;
                return p.price >= min;
            });
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter((p: Product) =>
                p.name.toLowerCase().includes(query) ||
                p.sku.toLowerCase().includes(query)
            );
        }

        return list;
    }, [products, priceFilter, searchQuery]);

    const handleCreate = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.post('/products', data);
            await mutate(); // Refresh list
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to create product:', err);
            toast.error('Failed to create product', {
                description: 'The SKU might already exist in the system.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedProduct) return;
        setIsSubmitting(true);
        try {
            await api.patch(`/products/${selectedProduct.id}`, data);
            await mutate();
            setIsModalOpen(false);
            setSelectedProduct(undefined);
        } catch (err) {
            console.error('Failed to update product:', err);
            toast.error('Failed to update product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            mutate();
            toast.success('Product deleted successfully');
        } catch (err) {
            console.error('Failed to delete product:', err);
            toast.error('Failed to delete product');
        }
    };

    const openCreateModal = () => {
        setSelectedProduct(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const columns: Column<Product>[] = [
        {
            header: 'Product Name',
            accessorKey: 'name',
            cell: (row: Product) => (
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mr-3">
                        <Package className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{row.name}</span>
                </div>
            )
        },
        {
            header: 'SKU',
            accessorKey: 'sku',
            cell: (row: Product) => (
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                    {row.sku}
                </span>
            )
        },
        {
            header: 'Price',
            accessorKey: 'price',
            cell: (row: Product) => (
                <span className="font-medium text-green-600 dark:text-green-400">
                    ${Number(row.price).toFixed(2)}
                </span>
            )
        },
        {
            header: 'Last Updated',
            accessorKey: 'updatedAt',
            cell: (row: Product) => new Date(row.updatedAt).toLocaleDateString()
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (row: Product) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => openEditModal(row)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (error) return <div className="p-8 text-center text-red-500">Failed to load products. API might be down or unreachable.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your product catalog and inventory base.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-750 flex items-center"
                    >
                        <Upload className="w-4 h-4 mr-2 text-blue-600" />
                        Import
                    </button>
                    <button
                        onClick={openCreateModal}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        ) : (
                            <Plus className="w-4 h-4 mr-2" />
                        )}
                        Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-3 md:w-64">
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-11 rounded-xl">
                            <SelectValue placeholder="Price Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="0-50">$0 - $50</SelectItem>
                            <SelectItem value="50-200">$50 - $200</SelectItem>
                            <SelectItem value="200-500">$200 - $500</SelectItem>
                            <SelectItem value="500-999999">$500+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
                    <div className="h-64 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-full"></div>
                </div>
            ) : (
                <DataTable<Product>
                    data={productList}
                    columns={columns}
                    isLoading={isLoading}
                />
            )}

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedProduct(undefined);
                    }}
                    onSubmit={selectedProduct ? handleUpdate : handleCreate}
                    initialData={selectedProduct}
                    isSubmitting={isSubmitting}
                />
            )}

            <ImportProductsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={() => mutate()}
            />
        </div>
    );
}
