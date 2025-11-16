import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard({ auth, stats }) {

    const StatCard = ({ title, value, link }) => {
        const content = (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
                    <p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>
                </div>
            </div>
        );

        if (link) {
            return <Link href={link}>{content}</Link>;
        }
        return content;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            title="Verifikasi Pembayaran" 
                            value={stats.pending_payments} 
                            link={route('admin.payments.index')} 
                        />
                        <StatCard 
                            title="Tugas Belum Ditugaskan" 
                            value={stats.pending_tasks} 
                            link={route('admin.tasks.index')} 
                        />
                        <StatCard 
                            title="Klien Baru (Bulan Ini)" 
                            value={stats.new_clients_monthly} 
                            link={route('admin.clients.index')} 
                        />
                        <StatCard 
                            title="Pendapatan (Bulan Ini)" 
                            value={`Rp ${parseFloat(stats.monthly_revenue).toLocaleString('id-ID')}`} 
                            link={route('admin.reports.index')}
                        />
                    </div>

                    <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                         <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium">Navigasi Cepat</h3>
                         </div>
                         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                href={route('admin.reports.index')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                → Laporan Pendapatan
                            </Link>
                            <Link
                                href={route('admin.tasks.index')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                → Manajemen Tugas
                            </Link>
                            <Link
                                href={route('admin.payments.index')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                → Verifikasi Pembayaran
                            </Link>
                            <Link
                                href={route('admin.subscriptions.index')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                → Manajemen Langganan
                            </Link>
                            <Link
                                href={route('admin.equipment.index')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                → Manajemen Alat Kantor
                            </Link>
                            <Link
                                href={route('admin.packages.index')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                → Manajemen Paket WiFi
                            </Link>
                            <Link
                                href={route('admin.clients.index')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                → Manajemen Klien & User
                            </Link>
                             <Link
                                href={route('admin.activity-log.index')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                → Log Aktivitas Sistem
                            </Link>
                         </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}