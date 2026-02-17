import axios from 'axios';

// Use environment-specific API URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Add a request interceptor for auth and error handling
api.interceptors.request.use(
    async (config) => {
        // Auth token will be added by AuthContext through api.defaults.headers
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Unauthorized - handle in app
            console.error('Unauthorized access');
        } else if (error.response?.status === 403) {
            console.error('Forbidden');
        } else if (error.response?.status === 404) {
            console.error('Not found');
        } else if (error.response?.status === 500) {
            console.error('Server error');
        }
        return Promise.reject(error);
    }
);

