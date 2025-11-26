import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatCard from '@/Components/Dashboard/StatCard';
import RevenueChart from '@/Components/Dashboard/RevenueChart';
import { FaWallet, FaClipboardCheck, FaUserPlus, FaTasks, FaWifi, FaUsers } from 'react-icons/fa';

export default function AdminDashboard({ auth, stats, chart }) {
    
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard Admin" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Selamat Datang, {auth.user.name}!</h1>
                            <p className="text-blue-100 opacity-90">Berikut ringkasan aktivitas bisnis hari ini.</p>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-white opacity-5 transform skew-x-12"></div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Verifikasi Pembayaran" value={stats?.pending_payments || 0} icon={FaClipboardCheck} color="blue" />
                        <StatCard title="Tugas Pending" value={stats?.pending_tasks || 0} icon={FaTasks} color="yellow" />
                        <StatCard title="Klien Baru" value={stats?.new_clients_monthly || 0} icon={FaUserPlus} color="green" />
                        <StatCard title="Pendapatan" value={formatRupiah(stats?.monthly_revenue || 0)} icon={FaWallet} color="purple" />
                    </div>

                    {/* Split View */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Aksi Cepat */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Aksi Cepat</h3>
                                <div className="space-y-4">
                                    <Link href={route('admin.clients.create')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-colors border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-md shadow-sm text-blue-500"><FaUserPlus /></div>
                                            <span className="font-semibold text-sm">Tambah Klien</span>
                                        </div>
                                        <span>→</span>
                                    </Link>
                                    <Link href={route('admin.packages.index')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-600 rounded-lg transition-colors border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-md shadow-sm text-purple-500"><FaWifi /></div>
                                            <span className="font-semibold text-sm">Kelola Paket</span>
                                        </div>
                                        <span>→</span>
                                    </Link>
                                    <Link href={route('admin.technicians.index')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-600 rounded-lg transition-colors border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-md shadow-sm text-green-500"><FaUsers /></div>
                                            <span className="font-semibold text-sm">Data Teknisi</span>
                                        </div>
                                        <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Grafik */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Analitik Pendapatan</h3>
                                        <p className="text-sm text-gray-400 mt-1">Tren pemasukan 12 bulan terakhir</p>
                                    </div>
                                </div>
                                
                                {/* CONTAINER HEIGHT WAJIB ADA */}
                                <div className="w-full h-80">
                                    <RevenueChart data={chart} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}