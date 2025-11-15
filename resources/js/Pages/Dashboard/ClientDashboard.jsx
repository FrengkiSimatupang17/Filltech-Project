import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ClientDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Client Dashboard</h2>}
        >
            <Head title="Client Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Selamat datang, {auth.user.name}!</div>
                    </div>

                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                         <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium">Navigasi</h3>
                         </div>
                         <div className="p-6 space-y-4">
                            <div>
                                <Link
                                    href={route('client.subscribe.index')}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    → Pendaftaran & Langganan
                                </Link>
                            </div>
                            <div>
                                <Link
                                    href={route('client.invoices.index')}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    → Tagihan & Pembayaran
                                </Link>
                            </div>
                            <div>
                                <Link
                                    href={route('client.complaints.index')}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    → Aduan & Kendala
                                </Link>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}