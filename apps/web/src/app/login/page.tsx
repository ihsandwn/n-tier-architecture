'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Loader2, ArrowRight, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [is2FARequired, setIs2FARequired] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post('/auth/login', {
                email,
                password,
                twoFactorCode: is2FARequired ? twoFactorCode : undefined
            });

            if (res.data.requiresTwoFactor) {
                setIs2FARequired(true);
                toast.info('Two-Factor Authentication required');
                setIsLoading(false);
                return;
            }

            const { access_token, user } = res.data;
            login(access_token, user);
            toast.success('Landing back... Welcome!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 dark:shadow-none mb-6">
                        <Shield size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {is2FARequired ? 'Security Check' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {is2FARequired ? 'Please enter your verification code.' : 'Sign in to OmniLogistics ERP'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {!is2FARequired ? (
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Email address"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <div className="relative group">
                                <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    autoFocus
                                    value={twoFactorCode}
                                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center tracking-[0.5em] font-mono text-2xl"
                                    placeholder="000000"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setIs2FARequired(false)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-bold block mx-auto py-2"
                            >
                                Back to password
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-200 dark:shadow-none active:scale-95 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                {is2FARequired ? 'Verify & Sign In' : 'Sign In'}
                                {!is2FARequired && <ArrowRight className="ml-2 w-5 h-5" />}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
