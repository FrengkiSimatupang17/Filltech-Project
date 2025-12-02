import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    WrenchScrewdriverIcon, 
    ClipboardDocumentListIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    ArrowPathIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
);

export default function TeknisiDashboard({ auth, taskStats, isClockedIn, todayAttendance }) {
    
    const handleClock = () => {
        const action = isClockedIn ? 'Clock-Out' : 'Clock-In';
        if (confirm(`Anda yakin ingin melakukan ${action} sekarang?`)) {
            router.post(route('teknisi.attendance.store'), {}, {
                preserveScroll: true,
                onSuccess: () => router.reload()
            });
        }
    };
    
    const getAttendanceStatus = () => {
        if (isClockedIn) {
            return { label: `Masuk: ${todayAttendance?.clock_in || '-'}`, color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircleIcon, action: 'out' };
        }
        if (todayAttendance?.clock_out) {
            return { label: 'Selesai Bekerja', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: CheckCircleIcon, action: 'done' };
        }
        return { label: 'Belum Absen', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: MapPinIcon, action: 'in' };
    };

    const attendanceStatus = getAttendanceStatus();
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Teknisi" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
                
                <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-700">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">Halo, {auth.user.name}</h2>
                        <p className="text-gray-400 mt-1 text-sm">Selamat bertugas. Utamakan keselamatan dan kepuasan pelanggan.</p>
                    </div>
                    
                    <div className={`flex items-center gap-4 px-5 py-3 rounded-xl backdrop-blur-md border border-white/10 ${attendanceStatus.bg}`}>
                        <attendanceStatus.icon className={`w-8 h-8 ${attendanceStatus.color}`} />
                        <div>
                            <p className="text-xs text-gray-300 font-bold uppercase tracking-wider">Status Kehadiran</p>
                            <p className={`text-lg font-bold ${attendanceStatus.color}`}>{attendanceStatus.label}</p>
                        </div>
                        
                        {attendanceStatus.action !== 'done' && (
                            <button 
                                onClick={handleClock} 
                                className="ml-2 px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                {attendanceStatus.action === 'in' ? 'Clock-In' : 'Clock-Out'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition-colors relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ClipboardDocumentListIcon className="w-16 h-16 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Tugas Baru</p>
                        <h3 className="text-4xl font-black text-gray-900 mt-1">{taskStats?.assigned || 0}</h3>
                        <Link href={route('teknisi.tasks.index', {status: 'assigned'})} className="text-xs font-bold text-blue-600 flex items-center mt-4 hover:underline">
                            Lihat Daftar <ArrowPathIcon className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-yellow-400 transition-colors relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <WrenchScrewdriverIcon className="w-16 h-16 text-yellow-600" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Proses</p>
                        <h3 className="text-4xl font-black text-gray-900 mt-1">{taskStats?.in_progress || 0}</h3>
                        <Link href={route('teknisi.tasks.index', {status: 'in_progress'})} className="text-xs font-bold text-yellow-600 flex items-center mt-4 hover:underline">
                            Lanjutkan <ArrowPathIcon className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-green-400 transition-colors relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircleIcon className="w-16 h-16 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Selesai Hari Ini</p>
                        <h3 className="text-4xl font-black text-gray-900 mt-1">{taskStats?.completed_today || 0}</h3>
                        <span className="text-xs text-gray-400 mt-4 block">Kerja bagus!</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href={route('teknisi.tasks.index')} className="p-5 bg-white shadow-sm border border-gray-200 rounded-xl flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ClipboardDocumentListIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Manajemen Tugas</h3>
                                <p className="text-xs text-gray-500">Lihat dan update status pekerjaan</p>
                            </div>
                        </div>
                        <ArrowIcon />
                    </Link>

                    <Link href={route('teknisi.equipment.index')} className="p-5 bg-white shadow-sm border border-gray-200 rounded-xl flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <WrenchScrewdriverIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Peminjaman Alat</h3>
                                <p className="text-xs text-gray-500">Kelola inventaris & logistik</p>
                            </div>
                        </div>
                        <ArrowIcon />
                    </Link>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}