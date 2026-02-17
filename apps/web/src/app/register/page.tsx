'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        tenantName: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // TODO: Call API to register
            // await api.post('/auth/register', formData);
            setTimeout(() => {
                router.push('/login?registered=true');
            }, 1000);
        } catch (error) {
            alert('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-900">
            {/* Left Side - Image / Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-purple-900/80"></div>

                <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">OmniLogistics</h1>
                        <p className="text-xl text-blue-100">The operating system for modern commerce.</p>
                    </div>
                    <div className="space-y-6">
                        <blockquote className="text-lg font-light italic">
                            "Since switching to OmniLogistics, our warehouse efficiency has increased by 40% and stockouts are a thing of the past."
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-12 h-12 rounded-full border-2 border-white/50" />
                            <div>
                                <p className="font-semibold">Sarah Jenko</p>
                                <p className="text-sm text-blue-200">COO, Global Freight Inc.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create your account</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Start your 14-day free trial. No credit card required.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work Email</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        placeholder="Acme Logistics"
                                        value={formData.tenantName}
                                        onChange={e => setFormData({ ...formData, tenantName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                        <path d="M12.0003 20.45c4.6667 0 8.45-3.7833 8.45-8.45 0-.4167-.0334-.8167-.1-1.2167H12.0003v3.2334h4.7834c-.2 1.1333-1.1667 2.0666-2.45 2.0666v1.6834h3.95c2.3166-2.1334 3.65-5.2667 3.65-8.9834 0-.5833-.05-1.15-.15-1.7H12.0003v3.4h-3.4v-3.4H5.16698v3.4h-3.4v-3.4H.583645c-.1.55-.15 1.1167-.15 1.7 0 6.2667 5.083335 11.35 11.350035 11.35 2.6667 0 5.1167-1.0334 6.9667-2.7334l-2.75-2.2z" fill="currentColor" />
                                        {/* Google SVG simplified placeholder */}
                                        <path d="M4.60352 14.5L3.72949 15.1699L3.48352 16.0957C4.60852 18.3369 6.92452 19.8965 9.60352 19.8965C12.1815 19.8965 14.3465 18.9955 15.9395 17.5195L15.9085 17.3115L14.7735 16.4268L14.6595 16.3271C13.2505 17.2666 11.6035 17.6973 9.60352 17.6973C7.60352 17.6973 5.86752 16.5986 5.09352 14.9951L4.60352 14.5Z" fill="#34A853" />
                                        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#fff" fillOpacity="0" />
                                        <path d="M23.4901 12.275C23.4901 11.45 23.4181 10.729 23.2791 10.038H12.0001V14.524H18.5281C18.2571 15.986 17.3911 17.25 16.0821 18.109V21.139H19.9571C22.2221 19.049 23.4901 15.976 23.4901 12.275Z" fill="#4285F4" />
                                        <path d="M12.0001 24.0001C15.2281 24.0001 17.9391 22.9241 19.9611 21.1391L16.0821 18.1091C15.0221 18.8351 13.6391 19.2311 12.0001 19.2311C8.87405 19.2311 6.22305 17.1361 5.27505 14.2881L1.24805 17.3611C3.25405 21.3121 7.37305 24.0001 12.0001 24.0001Z" fill="#34A853" />
                                        <path d="M5.275 14.288C5.035 13.563 4.901 12.793 4.901 12C4.901 11.207 5.035 10.437 5.275 9.712V6.639H1.248C0.442998 8.239 0 10.063 0 12C0 13.937 0.442998 15.761 1.248 17.361L5.275 14.288Z" fill="#FBBC05" />
                                        <path d="M12.0001 4.7689C13.7291 4.7689 15.2811 5.3689 16.4971 6.5419L19.9961 3.0429C17.9331 1.1199 15.2231 -0.0001 12.0001 -0.0001C7.37305 -0.0001 3.25405 2.6879 1.24805 6.6389L5.27505 9.7119C6.22305 6.8639 8.87405 4.7689 12.0001 4.7689Z" fill="#EA4335" />
                                    </svg>
                                    <span className="ml-3">Google</span>
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Log in
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
