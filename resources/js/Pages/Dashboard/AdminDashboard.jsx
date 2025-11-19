import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    BanknotesIcon, 
    UserGroupIcon, 
    ClipboardDocumentCheckIcon, 
    ExclamationCircleIcon, 
    ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default function AdminDashboard({ auth, stats }) {

    const StatCard = ({ title, value, link, icon: Icon, color }) => {
        return (
            <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4" style={{ borderColor: color }}>
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
                            <p className="text-3xl font-extrabold text-gray-800 mt-2">{value}</p>
                        </div>
                        <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: color }}>
                            <Icon className="w-8 h-8" style={{ color: color }} />
                        </div>
                    </div>
                    {link && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                            <Link href={link} className="text-sm font-medium flex items-center gap-1 hover:underline" style={{ color: color }}>
                                Lihat Detail <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Admin Dashboard" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                
                {/* --- HEADER SECTION (Gaya Welcome Page) --- */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-900 p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Selamat Datang, Administrator!</h2>
                        <p className="text-blue-100 text-lg">Berikut adalah ringkasan aktivitas bisnis Filltech hari ini.</p>
                    </div>
                    {/* Dekorasi Background */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-yellow-400 opacity-20 rounded-full blur-2xl"></div>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Verifikasi Pembayaran" 
                        value={stats.pending_payments} 
                        link={route('admin.payments.index')}
                        icon={BanknotesIcon}
                        color="#2563eb" // Blue
                    />
                    <StatCard 
                        title="Tugas Pending" 
                        value={stats.pending_tasks} 
                        link={route('admin.tasks.index')} 
                        icon={ClipboardDocumentCheckIcon}
                        color="#f59e0b" // Amber/Yellow
                    />
                    <StatCard 
                        title="Klien Baru (Bulan Ini)" 
                        value={stats.new_clients_monthly} 
                        link={route('admin.clients.index')} 
                        icon={UserGroupIcon}
                        color="#10b981" // Green
                    />
                    <StatCard 
                        title="Pendapatan (Bulan Ini)" 
                        value={`Rp ${parseFloat(stats.monthly_revenue).toLocaleString('id-ID')}`} 
                        link={route('admin.reports.index')}
                        icon={BanknotesIcon}
                        color="#7c3aed" // Violet
                    />
                </div>
                
                {/* --- SECTION BAWAH (Contoh Layout Tambahan) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="card bg-white shadow-md border border-gray-100">
                        <div className="card-body">
                            <h3 className="card-title text-gray-700 mb-4">Aksi Cepat</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Link href={route('admin.clients.index')} className="btn btn-outline btn-primary">Tambah Klien</Link>
                                <Link href={route('admin.packages.index')} className="btn btn-outline btn-secondary">Kelola Paket</Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}