'use client';

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
    X,
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';

interface ImportProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ImportProductsModal({ isOpen, onClose, onSuccess }: ImportProductsModalProps) {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            parseFile(selectedFile);
        }
    };

    const parseFile = (file: File) => {
        setIsParsing(true);
        setFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);

                // Basic validation: must have SKU and Name
                const validRows = json.filter((row: any) => row.sku && row.name);
                setPreviewData(validRows.slice(0, 10)); // Preview first 10
                setIsParsing(false);

                if (validRows.length === 0) {
                    toast.error('No valid products found', {
                        description: 'Please ensure your file has "sku" and "name" columns.'
                    });
                } else {
                    toast.success(`Found ${json.length} rows`, {
                        description: `${validRows.length} valid products ready for import.`
                    });
                }
            } catch (err) {
                console.error('Error parsing file:', err);
                toast.error('Failed to parse file');
                setIsParsing(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleUpload = async () => {
        if (!file || !user?.tenantId) return;

        setIsUploading(true);
        try {
            // Re-parse the full file for upload
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const products = XLSX.utils.sheet_to_json(worksheet);

                await api.post('/products/import', {
                    tenantId: user.tenantId,
                    products
                });

                toast.success('Import Successful', {
                    description: `Successfully imported ${products.length} products.`
                });
                onSuccess();
                onClose();
            };
            reader.readAsArrayBuffer(file);
        } catch (err) {
            console.error('Import failed:', err);
            toast.error('Import Failed', {
                description: 'Please check your file format and try again.'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        const template = [
            { sku: 'PROD-001', name: 'Sample Product 1', description: 'Premium quality', price: 99.99 },
            { sku: 'PROD-002', name: 'Sample Product 2', description: 'Essential tool', price: 49.50 },
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "product_import_template.xlsx");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Import Products</h2>
                        <p className="text-sm text-gray-500">Bulk upload your catalog via Excel or CSV</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Upload Zone */}
                    {!file ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
                        >
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">Drop your file here</p>
                            <p className="text-sm text-gray-500 mt-1">Supports .xlsx, .xls, .csv</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".xlsx, .xls, .csv"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mr-3">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setFile(null); setPreviewData([]); }}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Change File
                                </button>
                            </div>

                            {/* Preview Table */}
                            <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Data Preview (First 10 rows)</span>
                                    {previewData.length > 0 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 text-left">SKU</th>
                                                <th className="px-4 py-2 text-left">Name</th>
                                                <th className="px-4 py-2 text-right">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                            {previewData.map((row, i) => (
                                                <tr key={i} className="text-gray-600 dark:text-gray-400">
                                                    <td className="px-4 py-2 font-mono text-xs">{row.sku}</td>
                                                    <td className="px-4 py-2">{row.name}</td>
                                                    <td className="px-4 py-2 text-right">${parseFloat(row.price || 0).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800 dark:text-amber-400">
                            <p className="font-bold">Important Notice</p>
                            <p>Importing will update existing products if the SKU matches. New products will be added automatically.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={downloadTemplate}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Instructions & Template
                    </button>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!file || isUploading || isParsing}
                            className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                'Confirm Import'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
