import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ExclamationTriangleIcon, 
    CreditCardIcon, 
    ClockIcon, 
    WifiIcon,
    ChatBubbleLeftIcon,
    UserCircleIcon,
    CheckBadgeIcon,
    RocketLaunchIcon,
    SignalIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const ServiceDetails = ({ subscription, unpaidInvoice, auth }) => {
    
    // Helper untuk warna badge status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
            case 'suspended': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };
    
    const formatRupiah = (amount) => {
        return `Rp ${parseFloat(amount).toLocaleString('id-ID')}`;
    };

    const hasUnpaidInvoice = !!unpaidInvoice;
    
    // Ganti nomor ini dengan nomor WA CS Filltech asli
    const waLink = `https://wa.me/6281234567890?text=Halo%20CS%20Filltech,%20saya%20pelanggan%20ID:%20${auth.user.id_unik}%20butuh%20bantuan.`;

    return (
        <div className="space-y-6">
            {/* --- Hero Card: Paket Utama --- */}
            <div className="relative w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xl rounded-2xl overflow-hidden">
                {/* Decorative Background Elements */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- Bagian Kiri: Status Keuangan / Info (2/3 Layar) --- */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Kartu Status Tagihan */}
                    <div className={`rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${hasUnpaidInvoice ? 'bg-white border-red-200 ring-1 ring-red-100' : 'bg-white border-gray-200'}`}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <CreditCardIcon className={`w-6 h-6 ${hasUnpaidInvoice ? 'text-red-500' : 'text-green-600'}`} />
                                    Status Tagihan
                                </h4>
                                {hasUnpaidInvoice && (
                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
                                        Perlu Dibayar
                                    </span>
                                )}
                            </div>

                            {hasUnpaidInvoice ? (
                                <div className="bg-red-50 rounded-xl p-6 border border-red-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                                    <div className="text-center sm:text-left w-full">
                                        <p className="text-xs text-red-600 uppercase font-bold tracking-wide mb-1">Total Tagihan</p>
                                        <p className="text-3xl font-black text-gray-900">{formatRupiah(unpaidInvoice.amount)}</p>
                                        <p className="text-sm text-red-500 mt-2 flex items-center gap-1 justify-center sm:justify-start font-medium">
                                            <ClockIcon className="w-4 h-4" />
                                            Jatuh Tempo: {new Date(unpaidInvoice.due_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                                        </p>
                                    </div>
                                    <Link 
                                        href={route('client.invoices.index')} 
                                        className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all text-center"
                                    >
                                        Bayar Sekarang
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex items-center gap-5">
                                    <div className="bg-green-100 p-4 rounded-full text-green-600 shrink-0">
                                        <CheckBadgeIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900 text-lg">Terima Kasih!</h5>
                                        <p className="text-green-700 text-sm mt-1">Semua tagihan Anda sudah lunas. Nikmati layanan internet tanpa gangguan.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Banner Info / Promo (Agar dashboard tidak sepi saat lunas) */}
                    {!hasUnpaidInvoice && (
                        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md overflow-hidden relative">
                            <div className="p-6 flex flex-col sm:flex-row items-center justify-between relative z-10 gap-4">
                                <div>
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <RocketLaunchIcon className="w-5 h-5" /> Upgrade Speed?
                                    </h3>
                                    <p className="text-indigo-100 text-sm mt-1 max-w-md leading-relaxed">
                                        Butuh koneksi lebih cepat untuk streaming 4K & Gaming? Cek paket terbaru kami sekarang.
                                    </p>
                                </div>
                                <Link href={route('client.subscribe.index')} className="px-5 py-2.5 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
                                    Lihat Paket
                                </Link>
                            </div>
                            {/* Decorative Icon */}
                            <WifiIcon className="absolute -right-6 -bottom-8 w-32 h-32 text-white opacity-10 rotate-12" />
                        </div>
                    )}
                </div>

                {/* --- Bagian Kanan: Menu Aksi Cepat (1/3 Layar) --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-fit">
                    <div className="p-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Menu Pintas</h4>
                        
                        <div className="grid grid-cols-1 gap-3">
                            <Link href={route('client.complaints.index')} 
                                className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all duration-200">
                                <div className="p-2.5 bg-red-100 text-red-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <ExclamationTriangleIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-700 group-hover:text-red-700 transition-colors">Lapor Gangguan</div>
                                    <div className="text-xs text-gray-500">Internet mati/lambat</div>
                                </div>
                            </Link>

                            <Link href={route('client.invoices.index')} 
                                className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200">
                                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <CreditCardIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors">Riwayat Tagihan</div>
                                    <div className="text-xs text-gray-500">Cek pembayaran lalu</div>
                                </div>
                            </Link>

                            <Link href={route('profile.edit')} 
                                className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                                <div className="p-2.5 bg-gray-100 text-gray-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <UserCircleIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-700">Profil Saya</div>
                                    <div className="text-xs text-gray-500">Update data & password</div>
                                </div>
                            </Link>

                            <a href={waLink} target="_blank" rel="noopener noreferrer"
                                className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all duration-200 text-left w-full cursor-pointer">
                                <div className="p-2.5 bg-green-100 text-green-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <ChatBubbleLeftIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-700 group-hover:text-green-700 transition-colors">Bantuan CS</div>
                                    <div className="text-xs text-gray-500">Hubungi via WhatsApp</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ClientDashboard({ auth, subscription, unpaid_invoice }) {
    
    // Cek apakah ada paket langganan (status apapun, asalkan datanya ada)
    const isServiceActive = !!subscription;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Pelanggan" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                
                {/* Header Sambutan */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Halo, {auth.user.name.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Selamat datang di Member Area Filltech.</p>
                    </div>
                    {/* Tanggal hari ini */}
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