'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { mutate } from 'swr';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

interface Notification {
    id: string;
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
    title: string;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotifications();

            const newSocket = io(`${process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000'}/notifications`, {
                auth: {
                    token: getCookie('token'),
                },
            });

            newSocket.on('connect', () => {
                setIsConnected(true);
                console.log('Notification socket connected');
            });

            newSocket.on('notification', (notification: Notification) => {
                setNotifications(prev => [notification, ...prev]);
                const toastType = notification.type.toLowerCase() as 'success' | 'info' | 'warning' | 'error';
                toast[toastType || 'info'](notification.title, {
                    description: notification.message,
                });
            });

            newSocket.on('data_update', (payload: { domain: string }) => {
                console.log('Real-time data update signal received:', payload);
                if (payload.domain === 'ORDERS') {
                    mutate('/orders');
                    // Also refresh analytics as they depend on orders
                    mutate((key: any) => typeof key === 'string' && key.includes('/analytics'));
                } else if (payload.domain === 'INVENTORY') {
                    mutate((key: any) => typeof key === 'string' && key.includes('/inventory'));
                    mutate((key: any) => typeof key === 'string' && key.includes('/analytics'));
                } else if (payload.domain === 'PRODUCTS') {
                    mutate('/products');
                }
            });

            newSocket.on('disconnect', () => {
                setIsConnected(false);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else {
            setNotifications([]);
            setIsConnected(false);
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user, fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/notifications/read-all`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, isConnected }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

// Helper for cookies
function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
}
