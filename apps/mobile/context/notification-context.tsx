import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { mutate } from 'swr';
import Toast from 'react-native-toast-message';
import { api } from '../lib/api';

const WS_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3000/api/v1';

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

interface NotificationProviderProps {
    children: React.ReactNode;
    token: string | null; // JWT token passed from auth
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, token }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchNotifications();

            const newSocket = io(`${WS_URL}/notifications`, {
                auth: { token },
            });

            newSocket.on('connect', () => {
                setIsConnected(true);
                console.log('[Mobile] Notification socket connected');
            });

            newSocket.on('notification', (notification: Notification) => {
                setNotifications(prev => [notification, ...prev]);

                const toastType = notification.type === 'ERROR' ? 'error'
                    : notification.type === 'SUCCESS' ? 'success'
                        : 'info';

                Toast.show({
                    type: toastType,
                    text1: notification.title,
                    text2: notification.message,
                    visibilityTime: 4000,
                });
            });

            // Real-time data revalidation (same logic as web)
            newSocket.on('data_update', (payload: { domain: string }) => {
                console.log('[Mobile] Real-time data update signal received:', payload);
                if (payload.domain === 'ORDERS') {
                    mutate('/orders');
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
                console.log('[Mobile] Notification socket disconnected');
            });

            socketRef.current = newSocket;
            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
                socketRef.current = null;
            };
        } else {
            // Not authenticated — clean up
            setNotifications([]);
            setIsConnected(false);
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        }
    }, [token, fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
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
