/**
 * API Configuration
 * Centralized configuration for backend API URL
 */

// Get API URL from environment variable, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
    console.log('🔗 API Base URL:', API_BASE_URL);
}
