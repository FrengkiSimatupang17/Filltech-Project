import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state agar render berikutnya menampilkan UI fallback
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Anda bisa mengirim log error ke layanan monitoring (Sentry, LogRocket, dll) di sini
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                    <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-red-100">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6 animate-pulse">
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
                        <p className="text-gray-500 mb-6 leading-relaxed text-sm">
                            Aplikasi mengalami kendala teknis. Kami telah mencatat kejadian ini. 
                            Silakan coba muat ulang halaman.
                        </p>

                        {/* Dev Mode Detail (Optional: remove in production) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-6 p-3 bg-gray-100 rounded text-left overflow-auto max-h-32">
                                <code className="text-xs text-red-600 font-mono break-all">
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}

                        <button
                            onClick={this.handleReload}
                            className="btn btn-error w-full text-white font-bold shadow-lg shadow-red-500/30"
                        >
                            <ArrowPathIcon className="w-5 h-5 mr-2" />
                            Muat Ulang Aplikasi
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}