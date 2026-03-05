// authService.js — Refactored to use Axios via centralized API config
import { authApi } from '../config/api';

/**
 * Log in a user and store the JWT token.
 */
export async function loginUser(credentials) {
    const response = await authApi.post('/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('userToken', token);
    return response.data;
}

/**
 * Get the current authenticated user's details.
 */
export async function getCurrentUser() {
    const response = await authApi.get('/auth/current_user');
    return response.data;
}

/**
 * Register a new user.
 */
export async function registerNewUser(userData) {
    const response = await authApi.post('/auth/register', userData);
    return response.data;
}

/**
 * Change the user's password.
 */
export async function changePassword(passwordData) {
    const response = await authApi.post('/auth/change-password', passwordData);
    return response.data;
}

/**
 * Update personal details.
 */
export async function updatePersonalDetails(detailsData) {
    const response = await authApi.post('/auth/update-details', detailsData);
    return response.data;
}

/**
 * Update high security settings.
 */
export async function updateSecuritySettings(securitySettings) {
    const response = await authApi.post('/auth/update-security-settings', securitySettings);
    return response.data;
}

/**
 * Check if user is logged in.
 */
export function isLoggedIn() {
    return !!localStorage.getItem('userToken');
}

/**
 * Logout the user — clear all stored auth data.
 */
export function logoutUser() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userDetails');
}
