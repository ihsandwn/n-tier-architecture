'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, ShoppingCart, Package } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => api.get(url).then(res => res.data);

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    inventory?: {
        warehouseId: string;
        quantity: number;
    }[];
}

interface CartItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}

export default function CreateOrderPage() {
    const router = useRouter();
    const { data: products, isLoading: isLoadingProducts } = useSWR<Product[]>('/products', fetcher);

    // Form State
    const [customerName, setCustomerName] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    // Item Selection State
    const [selectedProductId, setSelectedProductId] = useState('');
    const [itemQuantity, setItemQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addItem = () => {
        if (!selectedProductId || !products) return;

        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;

        // Check if already in cart
        const existingItemIndex = cart.findIndex(item => item.productId === selectedProductId);

        if (existingItemIndex > -1) {
            // Update quantity
            const newCart = [...cart];
            newCart[existingItemIndex].quantity += itemQuantity;
            setCart(newCart);
        } else {
            // Add new item
            setCart([...cart, {
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity: itemQuantity
            }]);
        }

        // Reset selection
        setSelectedProductId('');
        setItemQuantity(1);
    };

    const removeItem = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0 || !customerName.trim()) return;

        setIsSubmitting(true);
        try {
            await api.post('/orders', {
                customerName: customerName,
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            });
            router.push('/dashboard/orders');
        } catch (err: any) {
            console.error('Failed to create order:', err);
            const message = err.response?.data?.message || 'Failed to create order';
            alert(message); // Simple alert for MVP
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/orders"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Order</h1>
                    <p className="text-gray-500 dark:text-gray-400">Draft a new order for a customer.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Form */}
                <div className="md:col-span-2 space-y-6">
                    {/* Customer Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <ShoppingCart className="w-5 h-5 mr-2 text-blue-500" />
                            Customer Information
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                required
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Enter customer name..."
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Add Items */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-purple-500" />
                            Add Products
                        </h2>

                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Product
                                </label>
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                    disabled={isLoadingProducts}
                                >
                                    <option value="">Select a product...</option>
                                    {isLoadingProducts ? (
                                        <option>Loading...</option>
                                    ) : (
                                        products?.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.sku}) - ${p.price}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Qty
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={itemQuantity}
                                    onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addItem}
                                disabled={!selectedProductId}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                            {cart.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p>Cart is empty</p>
                                </div>
                            ) : (
                                cart.map((item, index) => (
                                    <div key={`${item.productId}-${index}`} className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-900 rounded-lg group">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white text-sm">{item.productName}</div>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || cart.length === 0 || !customerName}
                            className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-wait flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Create Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
