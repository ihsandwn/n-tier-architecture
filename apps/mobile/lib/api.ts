import axios from 'axios';
import Constants from 'expo-constants';

// In a real app, use environment variables from app.json/expo-constants
const API_URL = 'http://localhost:3000/api/v1'; // Default for local dev

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor (stub for future Auth integration)
api.interceptors.request.use(
    async (config) => {
        // Here you would get the token from SecureStore or similar
        const token = null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
