'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Check } from 'lucide-react';

interface StockAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    product?: {
        id: string;
        name: string;
        sku: string;
    };
    warehouseId: string;
    isSubmitting: boolean;
}

export default function StockAdjustmentModal({ isOpen, onClose, onSubmit, product, warehouseId, isSubmitting }: StockAdjustmentModalProps) {
    const [type, setType] = useState<'IN' | 'OUT'>('IN');
    const [quantity, setQuantity] = useState<string>('1');
    const [note, setNote] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setType('IN');
            setQuantity('1');
            setNote('');
        }
    }, [isOpen, product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !warehouseId) return;

        await onSubmit({
            productId: product.id,
            warehouseId,
            quantity: parseInt(quantity),
            type,
            note
        });
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-gray-800">
                                <form onSubmit={handleSubmit}>
                                    <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="flex justify-between items-center mb-5">
                                            <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 dark:text-white">
                                                Adjust Stock
                                            </Dialog.Title>
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Product Info */}
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Product</div>
                                                <div className="font-medium text-gray-900 dark:text-white">{product?.name}</div>
                                                <div className="text-xs font-mono text-gray-500 mt-1">{product?.sku}</div>
                                            </div>

                                            {/* Type Selection */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setType('IN')}
                                                    className={`p-3 rounded-lg border font-medium text-center transition-all ${type === 'IN'
                                                            ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 ring-2 ring-green-500/20'
                                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                                                        }`}
                                                >
                                                    Check In (+)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setType('OUT')}
                                                    className={`p-3 rounded-lg border font-medium text-center transition-all ${type === 'OUT'
                                                            ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 ring-2 ring-red-500/20'
                                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                                                        }`}
                                                >
                                                    Check Out (-)
                                                </button>
                                            </div>

                                            {/* Quantity */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            {/* Note */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Note (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    placeholder="Reason for adjustment..."
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-wait transition-colors"
                                        >
                                            {isSubmitting ? 'Saving...' : 'Confirm Adjustment'}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto transition-colors"
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
