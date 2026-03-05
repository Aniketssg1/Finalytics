import axios from 'axios';

// API base URLs — configurable via environment variables
const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:8082/api';
const ACCOUNT_API_URL = process.env.REACT_APP_ACCOUNT_API_URL || 'http://localhost:8083/api';

/**
 * Creates an Axios instance with JWT interceptors.
 * Automatically attaches token to requests and handles 401 responses.
 */
function createApiClient(baseURL) {
    const client = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 15000,
    });

    // Request interceptor — attach JWT token
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor — handle 401 errors globally
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Token expired or invalid — clear auth state and redirect
                localStorage.removeItem('userToken');
                localStorage.removeItem('userDetails');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            return Promise.reject(error);
        }
    );

    return client;
}

export const authApi = createApiClient(AUTH_API_URL);
export const accountApi = createApiClient(ACCOUNT_API_URL);
export { AUTH_API_URL, ACCOUNT_API_URL };
