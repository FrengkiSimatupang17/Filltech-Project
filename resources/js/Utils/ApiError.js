export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        this.timestamp = new Date();
    }

    // Helper untuk cek tipe error
    get isNetworkError() {
        return this.status === 0;
    }

    get isServerError() {
        return this.status >= 500;
    }

    get isAuthError() {
        return this.status === 401 || this.status === 419;
    }
}