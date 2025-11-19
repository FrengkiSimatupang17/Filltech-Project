import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { WrenchScrewdriverIcon, ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function TeknisiDashboard({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Teknisi" />

            <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
                
                <div className="rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 p-5 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Halo, {auth.user.name}</h2>
                        <p className="text-sm text-gray-300 mt-1">Selamat bertugas. Utamakan keselamatan kerja.</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm self-end sm:self-center">
                        <WrenchScrewdriverIcon className="w-6 h-6 text-yellow-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <Link href={route('teknisi.tasks.index')} className="card bg-white shadow-sm border-l-4 border-blue-600 hover:shadow-md transition-all group cursor-pointer">
                        <div className="card-body p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Daftar Tugas</h3>
                                    <p className="text-xs text-gray-500 mt-1">Instalasi & Perbaikan</p>
                                </div>
                                <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="mt-4 text-right">
                                <span className="text-xs font-semibold text-blue-600 flex items-center justify-end gap-1">
                                    Buka Tugas <ArrowIcon />
                                </span>
                            </div>
                        </div>
                    </Link>

                    <Link href={route('teknisi.attendance.index')} className="card bg-white shadow-sm border-l-4 border-green-500 hover:shadow-md transition-all group cursor-pointer">
                        <div className="card-body p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors">Absensi Harian</h3>
                                    <p className="text-xs text-gray-500 mt-1">Clock-In & Clock-Out</p>
                                </div>
                                <ClockIcon className="w-6 h-6 text-green-500" />
                            </div>
                            <div className="mt-4 text-right">
                                <span className="text-xs font-semibold text-green-600 flex items-center justify-end gap-1">
                                    Buka Absensi <ArrowIcon />
                                </span>
                            </div>
                        </div>
                    </Link>

                    <Link href={route('teknisi.equipment.index')} className="card bg-white shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-all group cursor-pointer sm:col-span-2 lg:col-span-1">
                        <div className="card-body p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">Alat Kerja</h3>
                                    <p className="text-xs text-gray-500 mt-1">Pinjam & Kembalikan Alat</p>
                                </div>
                                <WrenchScrewdriverIcon className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="mt-4 text-right">
                                <span className="text-xs font-semibold text-orange-600 flex items-center justify-end gap-1">
                                    Kelola Alat <ArrowIcon />
                                </span>
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
);