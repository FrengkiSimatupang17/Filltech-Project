import axios from 'axios';
import { ApiError } from './Utils/ApiError';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// --- GLOBAL ERROR INTERCEPTOR ---
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        // 1. Handle Network Error (Offline / Server Down)
        if (!response) {
            console.error('Network Error:', error.message);
            // Optional: Dispatch custom event untuk trigger Toast "Anda Offline" di Layout
            // window.dispatchEvent(new CustomEvent('app:network-error'));
            return Promise.reject(new ApiError('Koneksi internet terputus. Periksa jaringan Anda.', 0));
        }

        // 2. Handle HTTP Errors
        const status = response.status;
        const message = response.data?.message || error.message;

        switch (status) {
            case 419: // CSRF Token Mismatch (Session Expired)
                window.location.reload(); // Reload otomatis untuk refresh token
                break;
            case 401: // Unauthorized
                // Biarkan Inertia menangani redirect ke login, tapi log di console
                console.warn('Sesi berakhir, silakan login kembali.');
                break;
            case 500: // Server Error
                console.error('Terjadi kesalahan di server:', message);
                break;
            case 429: // Too Many Requests
                console.warn('Terlalu banyak permintaan. Mohon tunggu sebentar.');
                break;
        }

        // Teruskan error sebagai ApiError standar
        return Promise.reject(new ApiError(message, status, response.data));
    }
);