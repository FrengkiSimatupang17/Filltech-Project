import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { WrenchScrewdriverIcon, ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
);

export default function TeknisiDashboard({ auth, taskStats, isClockedIn, todayAttendance }) {
    
    // Fungsi Absensi (Check-in/Check-out)
    const handleClock = () => {
        const action = isClockedIn ? 'Clock-Out' : 'Clock-In';
        if (confirm(`Anda yakin ingin melakukan ${action} sekarang?`)) {
            router.post(route('teknisi.attendance.store'), {}, {
                preserveScroll: true,
                onSuccess: () => router.reload()
            });
        }
    };
    
    // Helper Status Absensi
    const getAttendanceStatus = () => {
        if (isClockedIn) {
            return { label: `Clocked-in ${todayAttendance.clock_in}`, color: 'text-green-500', icon: CheckCircleIcon, action: 'out' };
        }
        if (todayAttendance?.clock_out) {
            return { label: `Selesai (${todayAttendance.clock_out})`, color: 'text-gray-500', icon: CheckCircleIcon, action: 'done' };
        }
        return { label: 'Belum Clock-in Hari Ini', color: 'text-red-500', icon: ClockIcon, action: 'in' };
    };

    const attendanceStatus = getAttendanceStatus();
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Teknisi" />

            <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
                
                {/* Header & Absensi Action */}
                <div className="rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 p-5 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="w-full">
                        <h2 className="text-xl font-bold">Halo, {auth.user.name}</h2>
                        <p className="text-sm text-gray-300 mt-1">Selamat bertugas. Utamakan keselamatan kerja.</p>
                    </div>
                    
                    {/* Status & Action Card */}
                    <div className="w-full md:w-auto p-3 bg-white/10 rounded-xl backdrop-blur-sm shadow-inner flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <attendanceStatus.icon className={`w-5 h-5 ${attendanceStatus.color}`} />
                                <span className={`text-sm font-semibold ${attendanceStatus.color}`}>{attendanceStatus.label}</span>
                            </div>
                            
                            {attendanceStatus.action !== 'done' && (
                                <button onClick={handleClock} className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                                    {attendanceStatus.action === 'in' ? 'Check-In' : 'Check-Out'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Task Statistics (FIXED: Using optional chaining '?' and default '|| 0') */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-blue-600">
                        <p className="text-sm text-gray-500 font-medium">Tugas Baru</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{taskStats?.assigned || 0}</h3>
                        <Link href={route('teknisi.tasks.index', {status: 'assigned'})} className="text-xs font-semibold text-blue-600 flex items-center mt-2">
                            Lihat Detail <ArrowPathIcon className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-yellow-600">
                        <p className="text-sm text-gray-500 font-medium">Sedang Dikerjakan</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{taskStats?.in_progress || 0}</h3>
                        <Link href={route('teknisi.tasks.index', {status: 'in_progress'})} className="text-xs font-semibold text-yellow-600 flex items-center mt-2">
                            Lanjut Tugas <ArrowPathIcon className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-green-600">
                        <p className="text-sm text-gray-500 font-medium">Selesai Hari Ini</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{taskStats?.completed_today || 0}</h3>
                        <span className="text-xs text-gray-500 mt-2 block">Total tugas selesai hari ini.</span>
                    </div>

                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                    
                    {/* Tugas */}
                    <Link href={route('teknisi.tasks.index')} className="p-4 bg-white shadow-sm border border-gray-200 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
                            <h3 className="font-bold text-gray-800">Daftar Tugas</h3>
                        </div>
                        <ArrowIcon className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Absensi */}
                    <Link href={route('teknisi.attendance.index')} className="p-4 bg-white shadow-sm border border-gray-200 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <ClockIcon className="w-6 h-6 text-green-600" />
                            <h3 className="font-bold text-gray-800">Absensi Harian</h3>
                        </div>
                        <ArrowIcon className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Alat Kerja */}
                    <Link href={route('teknisi.equipment.index')} className="p-4 bg-white shadow-sm border border-gray-200 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <WrenchScrewdriverIcon className="w-6 h-6 text-orange-600" />
                            <h3 className="font-bold text-gray-800">Kelola Alat</h3>
                        </div>
                        <ArrowIcon className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                    </Link>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}