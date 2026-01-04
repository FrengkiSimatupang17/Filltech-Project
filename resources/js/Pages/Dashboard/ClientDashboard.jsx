import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ExclamationTriangleIcon, 
    CreditCardIcon, 
    ClockIcon, 
    ChatBubbleLeftIcon,
    UserCircleIcon,
    CheckBadgeIcon,
    SignalIcon,
    InformationCircleIcon,
    WrenchScrewdriverIcon,
    BoltIcon,
    LightBulbIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    WifiIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

// --- KOMPONEN KEUNGGULAN PAKET (PENGGANTI STATISTIK DATA) ---
const PackageBenefits = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between h-full">
            <div>
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                    Status Layanan
                </h4>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <WifiIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Fiber Optic Stabil</p>
                            <p className="text-xs text-gray-500">Jalur khusus streaming & gaming.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <BoltIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">True Unlimited</p>
                            <p className="text-xs text-gray-500">Bebas kuota, tanpa FUP (Fair Usage Policy).</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-green-700">Koneksi Aman</span>
                    <span className="flex items-center gap-1 text-[10px] bg-white px-2 py-1 rounded-md text-green-600 border border-green-200 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Terhubung
                    </span>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN PUSAT INFORMASI & TIPS (PENGGANTI LIVE TRAFFIC) ---
const InformationCenter = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <InformationCircleIcon className="w-5 h-5 text-indigo-600" />
                    Pusat Informasi FBB
                </h4>
                <span className="text-xs font-medium text-gray-400">Update Terkini</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Bagian Tips */}
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                    <h5 className="font-bold text-orange-800 flex items-center gap-2 mb-3">
                        <LightBulbIcon className="w-5 h-5" /> Tips Koneksi Lancar
                    </h5>
                    <ul className="space-y-3">
                        <li className="flex gap-2 text-sm text-gray-700">
                            <span className="font-bold text-orange-500">1.</span>
                            <span>Posisi router sebaiknya di tempat terbuka dan tinggi.</span>
                        </li>
                        <li className="flex gap-2 text-sm text-gray-700">
                            <span className="font-bold text-orange-500">2.</span>
                            <span>Restart modem seminggu sekali untuk refresh jaringan.</span>
                        </li>
                        <li className="flex gap-2 text-sm text-gray-700">
                            <span className="font-bold text-orange-500">3.</span>
                            <span>Hindari menumpuk barang elektronik di dekat modem.</span>
                        </li>
                    </ul>
                </div>

                {/* Bagian Cara Bayar */}
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h5 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                        <BanknotesIcon className="w-5 h-5" /> Cara Pembayaran Mudah
                    </h5>
                    <div className="space-y-4 relative">
                        {/* Garis Vertikal */}
                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-blue-200"></div>
                        
                        <div className="relative flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold z-10 shrink-0">1</div>
                            <p className="text-sm text-gray-700">Cek Tagihan di menu <span className="font-bold">Riwayat Tagihan</span>.</p>
                        </div>
                        <div className="relative flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold z-10 shrink-0">2</div>
                            <p className="text-sm text-gray-700">Transfer sesuai nominal ke Rekening Resmi PT. Filltech.</p>
                        </div>
                        <div className="relative flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold z-10 shrink-0">3</div>
                            <p className="text-sm text-gray-700">Upload bukti transfer & tunggu verifikasi Admin.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                <span>Butuh bantuan teknis segera?</span>
                <a href="https://wa.me/6281234567890" target="_blank" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
                    Hubungi Teknisi <ArrowRightIcon className="w-3 h-3" />
                </a>
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
    const userIdDisplay = auth.user.id_unik || `ID-${auth.user.id}`;
    const waLink = `https://wa.me/6281234567890?text=Halo%20CS%20Filltech,%20saya%20pelanggan%20ID:%20${userIdDisplay}%20butuh%20bantuan.`;

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
                            <span className="text-xs text-blue-200 font-mono bg-black/20 px-2 py-1 rounded">
                                ID: {userIdDisplay}
                            </span>
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
                                <p className="text-xs text-gray-500 mt-1">Terima kasih telah membayar tepat waktu.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* KOLOM 2: KEUNGGULAN PAKET (MENGGANTIKAN STATISTIK DUMMY) */}
                <PackageBenefits />

                {/* KOLOM 3: MENU PINTAS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between h-full">
                    <div>
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
            </div>

            {/* ================= BARIS 3: GRID 2 KOLOM (INFO & PUSAT BANTUAN) ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* KOLOM 1: JAM OPERASIONAL & SPEEDTEST (DITUMPUK) */}
                <div className="space-y-6 h-full flex flex-col">
                    {/* Widget Info Layanan */}
                    <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden border border-slate-700 flex-1">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                        <div className="relative z-10">
                            <h3 className="font-bold flex items-center gap-2 mb-3 text-sm">
                                <InformationCircleIcon className="w-5 h-5 text-blue-400" />
                                Jam Operasional
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

                {/* KOLOM 2: PUSAT INFORMASI (MENGGANTIKAN LIVE TRAFFIC DUMMY) */}
                <div className="lg:col-span-2">
                    <InformationCenter />
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