'use client';

import { useState, useEffect } from 'react';
import { Save, Shield, Smartphone, QrCode, Loader2, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 2FA Modal state
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [twoFactorData, setTwoFactorData] = useState<any>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [is2FALoading, setIs2FALoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await api.get('/auth/me');
            setProfile(data);
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await api.patch(`/users/${user.id}`, {
                name: profile.name,
                phone: profile.phone,
            });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEnable2FA = async () => {
        setIs2FALoading(true);
        try {
            const data = await api.post('/auth/2fa/generate', {});
            setTwoFactorData(data);
            setIs2FAModalOpen(true);
        } catch (error) {
            toast.error('Failed to generate 2FA secret');
        } finally {
            setIs2FALoading(false);
        }
    };

    const confirmEnable2FA = async () => {
        if (!verificationCode) return;
        setIs2FALoading(true);
        try {
            await api.post('/auth/2fa/enable', {
                secret: twoFactorData.secret,
                code: verificationCode
            });
            toast.success('2FA enabled successfully');
            setIs2FAModalOpen(false);
            fetchProfile();
        } catch (error) {
            toast.error('Invalid verification code');
        } finally {
            setIs2FALoading(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!confirm('Are you sure you want to disable 2FA? This will reduce your account security.')) return;
        try {
            await api.post('/auth/2fa/disable', {});
            toast.success('2FA disabled successfully');
            fetchProfile();
        } catch (error) {
            toast.error('Failed to disable 2FA');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your professional profile and security preferences.</p>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Smartphone className="w-5 h-5 mr-3 text-blue-600" />
                        Account Profile
                    </h2>
                </div>
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Display Name</label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={profile?.name || ''}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Login Email</label>
                            <input
                                type="email"
                                disabled
                                value={profile?.email || ''}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={profile?.phone || ''}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none font-bold active:scale-95 disabled:opacity-70"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Shield className="w-5 h-5 mr-3 text-green-600" />
                        Security & Privacy
                    </h2>
                </div>
                <div className="p-8">
                    <div className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/10">
                        <div className="flex items-start">
                            <div className={`p-3 rounded-xl mr-4 ${profile?.twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                <QrCode size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Two-Factor Authentication (2FA)</h3>
                                <p className="text-sm text-gray-500 mt-1 max-w-md">Protects your account with an extra security layer. A unique code from your mobile app will be required during login.</p>
                                {profile?.twoFactorEnabled && (
                                    <span className="inline-flex items-center mt-3 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                        <CheckCircle2 size={12} className="mr-1.5" /> Currently Enabled
                                    </span>
                                )}
                            </div>
                        </div>
                        {profile?.twoFactorEnabled ? (
                            <button
                                onClick={handleDisable2FA}
                                className="px-6 py-2.5 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold transition-all"
                            >
                                Disable
                            </button>
                        ) : (
                            <button
                                onClick={handleEnable2FA}
                                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 font-bold transition-all shadow-xl active:scale-95"
                            >
                                Enable TOTP
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 2FA Modal */}
            {is2FAModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-100 dark:border-gray-700 relative animate-in zoom-in duration-300">
                        <button
                            onClick={() => setIs2FAModalOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>

                        <div className="text-center space-y-6">
                            <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                                <QrCode size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold dark:text-white">Secure your account</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.).</p>
                            </div>

                            {twoFactorData?.qrCodeDataUrl && (
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 inline-block shadow-inner">
                                    <img src={twoFactorData.qrCodeDataUrl} alt="2FA QR Code" className="w-48 h-48" />
                                </div>
                            )}

                            <div className="space-y-4 text-left">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Verification Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-center text-2xl tracking-[0.5em] font-mono px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <button
                                onClick={confirmEnable2FA}
                                disabled={verificationCode.length !== 6 || is2FALoading}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {is2FALoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Confirm & Enable'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
