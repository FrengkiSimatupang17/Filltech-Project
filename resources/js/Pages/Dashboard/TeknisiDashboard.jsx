import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    MapPinIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    WrenchScrewdriverIcon, 
    BriefcaseIcon,
    ArrowRightIcon,
    BoltIcon
} from '@heroicons/react/24/solid';

export default function TeknisiDashboard({ auth, taskStats, todayAttendance }) {
    const user = auth.user;

    // --- Helper: Sapaan Berdasarkan Waktu ---
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    // --- WIDGET ABSENSI ---
    const AttendanceWidget = ({ attendance }) => {
        const [loading, setLoading] = useState(false);
        const [currentTime, setCurrentTime] = useState(new Date());
        const [locationStatus, setLocationStatus] = useState({ msg: '', type: '' });

        useEffect(() => {
            const timer = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(timer);
        }, []);

        const handleClockAction = (type) => {
            setLoading(true);
            setLocationStatus({ msg: 'Mencari lokasi GPS...', type: 'info' });

            if (!navigator.geolocation) {
                setLocationStatus({ msg: "Browser tidak support GPS.", type: 'error' });
                setLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationStatus({ msg: 'Lokasi ditemukan. Mengirim data...', type: 'success' });
                    
                    router.post(route('teknisi.attendance.store'), {
                        type: type, 
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        status: 'present',
                        notes: `Absensi Mobile pada ${new Date().toLocaleTimeString('id-ID')}`
                    }, {
                        onSuccess: () => {
                            setLoading(false);
                            setLocationStatus({ msg: '', type: '' });
                        },
                        onError: () => {
                            setLoading(false);
                            setLocationStatus({ msg: "Gagal mengirim data absensi.", type: 'error' });
                        }
                    });
                },
                (error) => {
                    setLoading(false);
                    let errMsg = "Gagal mendapatkan lokasi.";
                    if(error.code === 1) errMsg = "Izin lokasi ditolak. Aktifkan GPS!";
                    if(error.code === 2) errMsg = "Sinyal GPS lemah/tidak tersedia.";
                    setLocationStatus({ msg: errMsg, type: 'error' });
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        };

        const isClockedIn = !!attendance;
        const isClockedOut = attendance && attendance.clock_out;

        return (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative mb-8">
                {/* Background Pattern Hiasan */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-100 rounded-full opacity-50 blur-2xl"></div>

                <div className="p-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        
                        {/* Kolom Kiri: Info Waktu */}
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-1">
                                <ClockIcon className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="text-5xl font-extrabold text-gray-800 tracking-tight font-mono">
                                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                <span className="text-lg text-gray-400 font-sans ml-1">WIB</span>
                            </div>
                            {/* Status Lokasi / Error Message */}
                            {locationStatus.msg && (
                                <div className={`mt-2 text-xs font-bold px-3 py-1 rounded-full inline-block ${
                                    locationStatus.type === 'error' ? 'bg-red-100 text-red-600' : 
                                    locationStatus.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {locationStatus.msg}
                                </div>
                            )}
                        </div>

                        {/* Kolom Kanan: Tombol Aksi Besar */}
                        <div className="w-full md:w-auto flex flex-col items-center">
                            {!isClockedIn ? (
                                <button 
                                    onClick={() => handleClockAction('clock_in')} 
                                    disabled={loading}
                                    className="group relative w-full md:w-72 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    {loading ? (
                                        <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        <>
                                            <MapPinIcon className="w-6 h-6 animate-bounce" />
                                            <span>ABSEN MASUK</span>
                                        </>
                                    )}
                                </button>
                            ) : !isClockedOut ? (
                                <div className="flex flex-col gap-3 w-full md:w-72">
                                    <div className="flex items-center justify-between px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-bold">
                                        <span>Masuk:</span>
                                        <span className="font-mono text-lg">{attendance.clock_in}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleClockAction('clock_out')} 
                                        disabled={loading}
                                        className="w-full h-14 rounded-2xl bg-white border-2 border-red-500 text-red-600 font-bold hover:bg-red-50 transition-colors active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Memproses...' : (
                                            <>
                                                <ArrowRightIcon className="w-5 h-5" />
                                                ABSEN PULANG
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full md:w-72 p-4 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl text-center">
                                    <div className="flex justify-center mb-2">
                                        <div className="bg-green-500 text-white rounded-full p-1">
                                            <CheckCircleIcon className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <h4 className="text-green-800 font-bold text-lg">Kehadiran Tuntas</h4>
                                    <p className="text-xs text-green-600 mt-1 font-mono">
                                        IN: {attendance.clock_in} • OUT: {attendance.clock_out}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- KOMPONEN STAT CARD ---
    const StatCard = ({ title, count, icon: Icon, colorClass, subtext, link }) => (
        <Link href={link} className="block group">
            <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden h-full`}>
                <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
                    <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
                </div>
                <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass} text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-3xl font-bold text-gray-800">{count}</span>
                        <span className="text-xs text-gray-400 mb-1 font-medium">{subtext}</span>
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Dashboard Teknisi" />

            <div className="min-h-screen bg-gray-50/50 pb-12">
                
                {/* HEADER SECTION DENGAN GRADASI */}
                <div className="bg-gray-900 pb-24 pt-12 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
                    {/* Hiasan Background */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                        <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="text-blue-400 font-medium mb-1 flex items-center gap-2">
                                    <BoltIcon className="w-4 h-4" />
                                    {getGreeting()},
                                </p>
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    {user.name}
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">Teknisi Lapangan • ID: #{user.id.toString().padStart(4, '0')}</p>
                            </div>
                            <div className="hidden md:block">
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                                    <p className="text-xs text-gray-300 uppercase tracking-widest text-center">Performance</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-lg">★★★★★</span>
                                        <span className="text-white font-bold ml-2">Excellent</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT SECTION (NAIK KE ATAS) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                    
                    {/* 1. WIDGET ABSENSI */}
                    <AttendanceWidget attendance={todayAttendance} />

                    {/* 2. STATISTIK GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard 
                            title="Tugas Baru" 
                            count={taskStats.assigned} 
                            icon={BriefcaseIcon} 
                            colorClass="bg-blue-500" 
                            subtext="Menunggu dikerjakan"
                            link={route('teknisi.tasks.index')}
                        />
                        <StatCard 
                            title="Sedang Proses" 
                            count={taskStats.in_progress} 
                            icon={WrenchScrewdriverIcon} 
                            colorClass="bg-orange-500" 
                            subtext="Dalam pengerjaan"
                            link={route('teknisi.tasks.index')}
                        />
                        <StatCard 
                            title="Selesai Hari Ini" 
                            count={taskStats.completed_today} 
                            icon={CheckCircleIcon} 
                            colorClass="bg-emerald-500" 
                            subtext="Tugas tuntas"
                            link={route('teknisi.tasks.index')}
                        />
                    </div>

                    {/* 3. QUICK ACTIONS (NAVIGASI CEPAT) */}
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Akses Cepat</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href={route('teknisi.tasks.index')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition text-center group">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                                <BriefcaseIcon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Daftar Tugas</span>
                        </Link>

                        <Link href={route('teknisi.equipment.index')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-300 transition text-center group">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-600 group-hover:text-white transition">
                                <WrenchScrewdriverIcon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Stok Alat</span>
                        </Link>
                        
                         {/* Link Placeholder untuk fitur masa depan */}
                         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-60 cursor-not-allowed text-center grayscale">
                            <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ClockIcon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500">Riwayat (Coming Soon)</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}