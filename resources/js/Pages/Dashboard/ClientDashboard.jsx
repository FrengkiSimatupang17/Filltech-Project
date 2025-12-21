import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    ExclamationTriangleIcon, 
    CreditCardIcon, 
    ClockIcon, 
    WifiIcon,
    ChatBubbleLeftIcon,
    UserCircleIcon,
    CheckBadgeIcon,
    SignalIcon,
    InformationCircleIcon,
    WrenchScrewdriverIcon,
    ArrowDownTrayIcon, 
    ArrowUpTrayIcon,
    BoltIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';

// --- KOMPONEN GRAFIK REALTIME (SIMULASI) ---
// Ini menampilkan efek grafik jalan tanpa perlu library tambahan
const RealtimeTrafficWidget = () => {
    const [dataPoints, setDataPoints] = useState(Array(20).fill(5)); // Data awal
    const [currentSpeed, setCurrentSpeed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // Simulasi data random antara 10 - 80 Mbps
            const newPoint = Math.floor(Math.random() * 70) + 10;
            setCurrentSpeed(newPoint);

            setDataPoints(prev => {
                const newData = [...prev.slice(1), newPoint];
                return newData;
            });
        }, 1000); // Update setiap 1 detik

        return () => clearInterval(interval);
    }, []);

    // Konversi array data menjadi path SVG
    const maxVal = 100;
    const points = dataPoints.map((val, i) => {
        const x = (i / (dataPoints.length - 1)) * 100;
        const y = 100 - ((val / maxVal) * 100);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <CpuChipIcon className="w-5 h-5 text-indigo-600" />
                        Live Traffic
                    </h4>
                    <p className="text-xs text-gray-400">Penggunaan Bandwidth Realtime</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600">{currentSpeed}</span>
                    <span className="text-xs font-bold text-gray-500 ml-1">Mbps</span>
                </div>
            </div>

            {/* Area Grafik SVG */}
            <div className="relative h-40 w-full bg-indigo-50/50 rounded-xl overflow-hidden border border-indigo-100">
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Area Fill */}
                    <path d={`M0,100 ${points} V100 H0 Z`} fill="rgba(79, 70, 229, 0.2)" />
                    {/* Garis Line */}
                    <polyline points={points} fill="none" stroke="#4F46E5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-rows-4 w-full h-full pointer-events-none">
                    <div className="border-b border-indigo-100/50 w-full"></div>
                    <div className="border-b border-indigo-100/50 w-full"></div>
                    <div className="border-b border-indigo-100/50 w-full"></div>
                </div>
            </div>
            
            <div className="flex justify-between mt-4 text-xs text-gray-400">
                <span>60s ago</span>
                <span className="flex items-center gap-1 text-green-600 font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Live
                </span>
                <span>Now</span>
            </div>
        </div>
    );
};

// --- KOMPONEN DETAIL LAYANAN ---
const ServiceDetails = ({ subscription, unpaidInvoice, auth }) => {
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
            case 'suspended': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };
    
    const formatRupiah = (amount) => `Rp ${parseFloat(amount).toLocaleString('id-ID')}`;
    const hasUnpaidInvoice = !!unpaidInvoice;
    const waLink = `https://wa.me/6281234567890?text=Halo%20CS%20Filltech,%20saya%20pelanggan%20ID:%20${auth.user.id_unik}%20butuh%20bantuan.`;

    return (
        <div className="space-y-6">
            
            {/* ================= BARIS 1: HERO CARD (PAKET UTAMA) ================= */}
            <div className="relative w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xl rounded-2xl overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                                <WifiIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Paket Internet Anda</h3>
                                <p className="text-3xl font-extrabold tracking-tight">{subscription.package.name}</p>
                                <div className="flex items-center gap-2 mt-2 text-blue-100 text-sm bg-blue-800/30 px-3 py-1 rounded-full w-fit">
                                    <SignalIcon className="w-4 h-4" />
                                    <span>Speed up to <span className="font-bold text-white">{subscription.package.speed || 'High Speed'}</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusBadge(subscription.status)} bg-white/90`}>
                                {subscription.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-blue-200 font-mono bg-black/20 px-2 py-1 rounded">ID: {auth.user.id_unik}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= BARIS 2: GRID 3 KOLOM ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* KOLOM 1: STATUS TAGIHAN */}
                <div className={`rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden flex flex-col justify-between ${hasUnpaidInvoice ? 'bg-white border-red-200 ring-1 ring-red-100' : 'bg-white border-gray-200'}`}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <CreditCardIcon className={`w-6 h-6 ${hasUnpaidInvoice ? 'text-red-500' : 'text-green-600'}`} />
                                Status Tagihan
                            </h4>
                        </div>

                        {hasUnpaidInvoice ? (
                            <div className="text-center">
                                <p className="text-xs text-red-600 uppercase font-bold tracking-wide mb-1">Total Tagihan</p>
                                <p className="text-3xl font-black text-gray-900 mb-4">{formatRupiah(unpaidInvoice.amount)}</p>
                                <Link 
                                    href={route('client.invoices.index')} 
                                    className="block w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all text-center"
                                >
                                    Bayar Sekarang
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="bg-green-100 p-4 rounded-full text-green-600 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                    <CheckBadgeIcon className="w-10 h-10" />
                                </div>
                                <h5 className="font-bold text-gray-900">Lunas!</h5>
                                <p className="text-xs text-gray-500 mt-1">Tidak ada tagihan aktif.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* KOLOM 2: WIDGET STATISTIK DATA (BARU) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <SignalIcon className="w-5 h-5 text-blue-600" />
                            Statistik Data
                        </h4>
                        
                        <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Pemakaian Bulan Ini</span>
                                <span className="font-bold text-gray-900">145.2 GB</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-1 text-blue-700 text-[10px] font-bold uppercase mb-1">
                                <ArrowDownTrayIcon className="w-3 h-3" /> Download
                            </div>
                            <p className="text-lg font-black text-gray-800">120.5 <span className="text-[10px] font-normal text-gray-500">GB</span></p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-1 text-purple-700 text-[10px] font-bold uppercase mb-1">
                                <ArrowUpTrayIcon className="w-3 h-3" /> Upload
                            </div>
                            <p className="text-lg font-black text-gray-800">24.7 <span className="text-[10px] font-normal text-gray-500">GB</span></p>
                        </div>
                    </div>
                </div>

                {/* KOLOM 3: MENU PINTAS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu Pintas</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <Link href={route('client.complaints.index')} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all border border-transparent hover:border-red-100 group">
                            <div className="p-2 bg-red-100 text-red-600 rounded-md group-hover:bg-white group-hover:shadow-sm">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold">Lapor Gangguan</span>
                        </Link>

                        <Link href={route('client.invoices.index')} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-all border border-transparent hover:border-blue-100 group">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-md group-hover:bg-white group-hover:shadow-sm">
                                <CreditCardIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold">Riwayat Tagihan</span>
                        </Link>

                        <Link href={route('profile.edit')} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all border border-transparent hover:border-gray-200 group">
                            <div className="p-2 bg-gray-100 text-gray-600 rounded-md group-hover:bg-white group-hover:shadow-sm">
                                <UserCircleIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold">Profil Saya</span>
                        </Link>

                        <a href={waLink} target="_blank" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition-all border border-transparent hover:border-green-100 group">
                            <div className="p-2 bg-green-100 text-green-600 rounded-md group-hover:bg-white group-hover:shadow-sm">
                                <ChatBubbleLeftIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold">WhatsApp CS</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* ================= BARIS 3: GRID 2 KOLOM ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* KOLOM 1: INFO LAYANAN & SPEEDTEST (DITUMPUK) */}
                <div className="space-y-6">
                    {/* Widget Info Layanan */}
                    <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden border border-slate-700">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                        <div className="relative z-10">
                            <h3 className="font-bold flex items-center gap-2 mb-3 text-sm">
                                <InformationCircleIcon className="w-5 h-5 text-blue-400" />
                                Informasi Layanan
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex justify-between items-center">
                                    <span className="text-xs text-slate-300 flex items-center gap-2"><ClockIcon className="w-3 h-3" /> Kantor</span>
                                    <span className="text-xs font-bold">08:00 - 17:00</span>
                                </div>
                                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex justify-between items-center">
                                    <span className="text-xs text-slate-300 flex items-center gap-2"><WrenchScrewdriverIcon className="w-3 h-3" /> Teknis</span>
                                    <span className="text-xs font-bold">08:00 - 22:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget Speedtest */}
                    <div 
                        onClick={() => window.open('https://fast.com/id/', '_blank')}
                        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg cursor-pointer group hover:shadow-xl transition-all relative overflow-hidden"
                    >
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                            <BoltIcon className="w-24 h-24" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold">Test Kecepatan</h4>
                                <p className="text-xs text-indigo-100 mt-1">Internet terasa lambat?</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                                <BoltIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* KOLOM 2: REALTIME TRAFFIC (MENGAMBIL 2 GRID DI LG) */}
                <div className="lg:col-span-2">
                    <RealtimeTrafficWidget />
                </div>

            </div>
        </div>
    );
};

export default function ClientDashboard({ auth, subscription, unpaid_invoice }) {
    const isServiceActive = !!subscription;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Pelanggan" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Halo, {auth.user.name.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Selamat datang di Member Area Filltech.</p>
                    </div>
                    <div className="hidden sm:block text-right bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Hari ini</p>
                        <p className="text-sm font-bold text-blue-600">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {!isServiceActive ? (
                    <div className="bg-white rounded-2xl shadow-sm border-l-4 border-yellow-500 p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-yellow-100 rounded-full text-yellow-700">
                                <ExclamationTriangleIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-xl">Layanan Belum Aktif</h3>
                                <p className="text-gray-600 mt-1">
                                    Anda belum berlangganan paket internet apapun. Pilih paket sekarang untuk mulai internetan.
                                </p>
                            </div>
                        </div>
                        <Link href={route('client.subscribe.index')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors whitespace-nowrap">
                            Pilih Paket WiFi
                        </Link>
                    </div>
                ) : (
                    <ServiceDetails subscription={subscription} unpaidInvoice={unpaid_invoice} auth={auth} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}