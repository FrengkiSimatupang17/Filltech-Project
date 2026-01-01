import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatCard from '@/Components/Dashboard/StatCard';
import RevenueChart from '@/Components/Dashboard/RevenueChart';
import { FaWallet, FaClipboardCheck, FaUserPlus, FaTasks, FaWifi, FaUsers, FaArrowRight } from 'react-icons/fa';

export default function AdminDashboard({ auth, stats, chart }) {
    
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Admin</h2>}
        >
            <Head title="Dashboard Admin" />

            {/* Container utama dengan padding responsif (kecil di mobile, luas di desktop) */}
            <div className="py-6 sm:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* --- WELCOME BANNER --- */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 p-6 sm:p-10 mb-6 sm:mb-8 shadow-lg text-white">
                        {/* Dekorasi Background */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white opacity-10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-blue-300 opacity-20 blur-2xl"></div>
                        
                        <div className="relative z-10">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                                Halo, {auth.user.name}! 👋
                            </h1>
                            <p className="text-blue-100 text-sm sm:text-base max-w-xl">
                                Selamat datang kembali di panel admin. Berikut adalah ringkasan performa bisnis dan tugas yang perlu diselesaikan hari ini.
                            </p>
                        </div>
                    </div>

                    {/* --- STATS GRID --- */}
                    {/* Menggunakan gap yang lebih rapat di mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <StatCard 
                            title="Verifikasi Pending" 
                            value={stats?.pending_payments || 0} 
                            icon={FaClipboardCheck} 
                            color="blue" 
                            description="Menunggu dicek"
                        />
                        <StatCard 
                            title="Tugas Aktif" 
                            value={stats?.pending_tasks || 0} 
                            icon={FaTasks} 
                            color="yellow" 
                            description="Perlu tindakan"
                        />
                        <StatCard 
                            title="Klien Baru (Bln)" 
                            value={stats?.new_clients_monthly || 0} 
                            icon={FaUserPlus} 
                            color="green" 
                            description="Bulan ini"
                        />
                        <StatCard 
                            title="Pendapatan (Bln)" 
                            value={formatRupiah(stats?.monthly_revenue || 0)} 
                            icon={FaWallet} 
                            color="purple" 
                            description="Estimasi bulan ini"
                        />
                    </div>

                    {/* --- MAIN CONTENT GRID --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        
                        {/* Left Column: Quick Actions */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-bold text-gray-800">Aksi Cepat</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    <QuickActionButton 
                                        href={route('admin.clients.index')} 
                                        icon={FaUserPlus} 
                                        label="Tambah Klien Baru" 
                                        color="text-blue-600" 
                                        bgColor="bg-blue-50"
                                    />
                                    <QuickActionButton 
                                        href={route('admin.packages.index')} 
                                        icon={FaWifi} 
                                        label="Kelola Paket Internet" 
                                        color="text-purple-600" 
                                        bgColor="bg-purple-50"
                                    />
                                    <QuickActionButton 
                                        href={route('admin.technicians.index')} 
                                        icon={FaUsers} 
                                        label="Manajemen Teknisi" 
                                        color="text-green-600" 
                                        bgColor="bg-green-50"
                                    />
                                </div>
                            </div>

                            {/* Info Card Kecil (Opsional) */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-sm p-5 text-white">
                                <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-gray-400">Sistem Info</h3>
                                <p className="text-xs text-gray-400 mb-4">Pastikan data selalu terupdate untuk laporan yang akurat.</p>
                                <div className="flex items-center justify-between text-sm font-medium">
                                    <span>Status Server</span>
                                    <span className="flex items-center gap-2 text-green-400">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Chart */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
                                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-800">Analitik Pendapatan</h3>
                                        <p className="text-xs text-gray-500 mt-1">Grafik pemasukan tahun ini</p>
                                    </div>
                                    {/* Bisa tambah dropdown filter tahun disini kedepannya */}
                                </div>
                                <div className="p-6">
                                    <div className="w-full h-64 sm:h-80">
                                        <RevenueChart data={chart} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Sub-component kecil untuk tombol agar kode lebih bersih
function QuickActionButton({ href, icon: Icon, label, color, bgColor }) {
    return (
        <Link 
            href={href} 
            className="group flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200 bg-white"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                </div>
                <span className="font-medium text-gray-700 text-sm group-hover:text-gray-900">{label}</span>
            </div>
            <FaArrowRight className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={14} />
        </Link>
    );
}