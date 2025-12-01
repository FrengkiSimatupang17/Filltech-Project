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
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return 'badge badge-success text-white font-bold border-none';
            case 'pending': return 'badge badge-warning font-bold border-none';
            case 'overdue': return 'badge badge-error text-white font-bold border-none';
            case 'verified': return 'badge badge-info text-white font-bold border-none';
            default: return 'badge badge-neutral';
        }
    };
    
    const formatRupiah = (amount) => {
        return `Rp ${parseFloat(amount).toLocaleString('id-ID')}`;
    };

    const hasUnpaidInvoice = !!unpaidInvoice;
    
    return (
        <div className="space-y-6">
            {/* --- Hero Card: Paket Utama --- */}
            <div className="card w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                
                <div className="card-body p-6 sm:p-8 relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <WifiIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Paket Internet Anda</h3>
                                <p className="text-3xl font-extrabold">{subscription.package.name}</p>
                                <div className="flex items-center gap-2 mt-2 text-blue-100 text-sm">
                                    <SignalIcon className="w-4 h-4" />
                                    <span>Speed up to <span className="font-bold text-white">{subscription.package.speed || 'High Speed'}</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={getStatusBadge(subscription.status)}>
                                {subscription.status.toUpperCase().replace('_', ' ')}
                            </span>
                            <span className="text-xs text-blue-200 font-mono">ID: {auth.user.id_unik}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- Bagian Kiri: Status Keuangan / Info --- */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Kartu Status Tagihan */}
                    <div className={`card shadow-sm border transition-all duration-300 ${hasUnpaidInvoice ? 'bg-white border-red-200 ring-1 ring-red-100' : 'bg-white border-gray-200'}`}>
                        <div className="card-body p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <CreditCardIcon className={`w-6 h-6 ${hasUnpaidInvoice ? 'text-red-500' : 'text-green-600'}`} />
                                    Status Tagihan
                                </h4>
                                {hasUnpaidInvoice && <span className="badge badge-error text-white">Perlu Dibayar</span>}
                            </div>

                            {hasUnpaidInvoice ? (
                                <div className="bg-red-50 rounded-xl p-5 border border-red-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs text-red-600 uppercase font-bold tracking-wide mb-1">Total Tagihan</p>
                                        <p className="text-3xl font-black text-gray-900">{formatRupiah(unpaidInvoice.amount)}</p>
                                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1 justify-center sm:justify-start">
                                            <ClockIcon className="w-4 h-4" />
                                            Jatuh Tempo: {new Date(unpaidInvoice.due_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})}
                                        </p>
                                    </div>
                                    <Link href={route('client.invoices.index')} className="btn btn-error text-white px-8 shadow-lg shadow-red-200 w-full sm:w-auto">
                                        Bayar Sekarang
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                                        <CheckBadgeIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900 text-lg">Terima Kasih!</h5>
                                        <p className="text-green-700 text-sm">Semua tagihan Anda sudah lunas. Nikmati layanan internet tanpa gangguan.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Banner Info / Promo (Agar dashboard tidak sepi saat lunas) */}
                    {!hasUnpaidInvoice && (
                        <div className="card bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md overflow-hidden">
                            <div className="card-body p-6 flex flex-row items-center justify-between relative">
                                <div className="z-10">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <RocketLaunchIcon className="w-5 h-5" /> Upgrade Speed?
                                    </h3>
                                    <p className="text-indigo-100 text-sm mt-1 max-w-md">
                                        Butuh koneksi lebih cepat untuk streaming 4K? Cek paket terbaru kami.
                                    </p>
                                </div>
                                <Link href={route('client.subscribe.index')} className="btn btn-sm bg-white text-indigo-600 border-none hover:bg-gray-100 z-10">
                                    Lihat Paket
                                </Link>
                                {/* Decorative Icon */}
                                <WifiIcon className="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-10 rotate-12" />
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Bagian Kanan: Menu Aksi Cepat --- */}
                <div className="card bg-white shadow-sm border border-gray-200 h-fit">
                    <div className="card-body p-5">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Menu Pintas</h4>
                        
                        <div className="grid grid-cols-1 gap-3">
                            <Link href={route('client.complaints.index')} 
                                className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all duration-200">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-white group-hover:scale-110 transition-transform">
                                    <ExclamationTriangleIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-700 group-hover:text-red-700">Lapor Gangguan</div>
                                    <div className="text-xs text-gray-500">Internet mati/lambat</div>
                                </div>
                            </Link>

                            <Link href={route('client.invoices.index')} 
                                className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-white group-hover:scale-110 transition-transform">
                                    <CreditCardIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-700 group-hover:text-blue-700">Riwayat Tagihan</div>
                                    <div className="text-xs text-gray-500">Cek pembayaran lalu</div>
                                </div>
                            </Link>

                            <Link href={route('profile.edit')} 
                                className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg group-hover:bg-white group-hover:scale-110 transition-transform">
                                    <UserCircleIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-700">Profil Saya</div>
                                    <div className="text-xs text-gray-500">Update data & password</div>
                                </div>
                            </Link>

                            <button className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all duration-200 text-left w-full">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-white group-hover:scale-110 transition-transform">
                                    <QuestionMarkCircleIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-700 group-hover:text-green-700">Bantuan CS</div>
                                    <div className="text-xs text-gray-500">Hubungi via WhatsApp</div>
                                </div>
                            </button>
                        </div>
                    </div>
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

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                
                {/* Header Sambutan */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Halo, {auth.user.name.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Selamat datang di Member Area Filltech.</p>
                    </div>
                    {/* Tanggal hari ini (Opsional, pemanis) */}
                    <div className="hidden sm:block text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Hari ini</p>
                        <p className="text-sm font-medium text-gray-700">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {!isServiceActive ? (
                    <div className="alert alert-warning shadow-lg mb-6 border-l-4 border-yellow-600 bg-yellow-50 flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex items-center gap-4 w-full">
                            <div className="p-3 bg-yellow-200 rounded-full text-yellow-800">
                                <ExclamationTriangleIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Layanan Belum Aktif</h3>
                                <div className="text-sm text-gray-700">Anda belum berlangganan paket internet apapun. Pilih paket sekarang untuk mulai internetan.</div>
                            </div>
                        </div>
                        <Link href={route('client.subscribe.index')} className="btn btn-primary w-full sm:w-auto whitespace-nowrap px-6">
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