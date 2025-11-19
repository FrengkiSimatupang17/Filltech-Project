import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ExclamationTriangleIcon, 
    CreditCardIcon, 
    ClockIcon, 
    WifiIcon,
    ArrowPathIcon,
    ChatBubbleLeftIcon,
    InformationCircleIcon,
    UserCircleIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';

const ServiceDetails = ({ details, auth }) => {
    
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

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="card w-full bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-xl overflow-hidden relative border border-white/10">
                <div className="card-body p-5 sm:p-8 relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/20 pb-4 mb-4 gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                <WifiIcon className="w-6 h-6 text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="text-blue-200 text-xs font-bold uppercase tracking-wider">Paket Aktif</h3>
                                <p className="text-2xl font-bold">{details.package_name}</p>
                            </div>
                        </div>
                        <span className={getStatusBadge(details.status)}>
                            {details.status.toUpperCase().replace('_', ' ')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                        <div>
                            <div className="text-blue-200 text-xs mb-1">Speed</div>
                            <div className="text-lg font-bold text-yellow-300">{details.package_speed}</div>
                        </div>
                        <div>
                            <div className="text-blue-200 text-xs mb-1">Tagihan</div>
                            <div className="text-lg font-bold">{formatRupiah(details.monthly_price)}</div>
                        </div>
                        <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t border-white/10 sm:border-none">
                            <div className="text-blue-200 text-xs mb-1">ID Pelanggan</div>
                            <div className="text-lg font-mono font-bold tracking-wider">{auth.user.id_unik || '-'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 card bg-white shadow-sm border border-gray-200">
                    <div className="card-body p-5">
                        <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <CreditCardIcon className="w-5 h-5 text-blue-600" />
                            Tagihan Bulan Ini
                        </h4>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                                <ClockIcon className="w-8 h-8 text-orange-500"/>
                                <div>
                                    <div className="text-xs text-gray-500">Jatuh Tempo</div>
                                    <div className="font-bold text-gray-800 text-sm">
                                        {details.next_invoice_due === 'N/A' ? '-' : details.next_invoice_due}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                                <ArrowPathIcon className="w-8 h-8 text-blue-600"/>
                                <div>
                                    <div className="text-xs text-gray-500">Status</div>
                                    <div className={`font-bold text-sm ${details.next_invoice_amount > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                                        {details.next_invoice_amount > 0 ? 'BELUM BAYAR' : 'LUNAS'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {details.next_invoice_amount > 0 ? (
                            <Link href={route('client.invoices.index')} className="btn btn-primary btn-block sm:btn-wide text-white">
                                <BanknotesIcon className="w-4 h-4"/> Bayar Sekarang
                            </Link>
                        ) : (
                            <button className="btn btn-disabled btn-block sm:btn-wide btn-ghost border border-gray-200">Tidak Ada Tagihan</button>
                        )}
                    </div>
                </div>

                <div className="card bg-white shadow-sm border border-gray-200">
                    <div className="card-body p-5">
                        <h4 className="text-base font-bold text-gray-800 mb-3">Pusat Bantuan</h4>
                        <div className="space-y-3">
                            <Link href={route('client.complaints.index')} className="btn btn-outline btn-warning btn-sm w-full justify-start gap-3 normal-case text-gray-700">
                                <ChatBubbleLeftIcon className="w-4 h-4"/> Laporkan Gangguan
                            </Link>
                            <Link href={route('profile.edit')} className="btn btn-outline btn-ghost btn-sm w-full justify-start gap-3 normal-case text-gray-600 border-gray-300">
                                <UserCircleIcon className="w-4 h-4" /> Pengaturan Profil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ClientDashboard({ auth, hasSubscription, subscriptionDetails }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {!hasSubscription ? (
                    <div className="alert alert-warning shadow-lg mb-6 border-l-4 border-yellow-600 bg-yellow-50 flex flex-col sm:flex-row gap-4">
                        <div className="flex items-start gap-3">
                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-gray-900">Layanan Belum Aktif</h3>
                                <div className="text-sm text-gray-700">Silakan pilih paket WiFi untuk mulai.</div>
                            </div>
                        </div>
                        <Link href={route('client.subscribe.index')} className="btn btn-sm btn-primary w-full sm:w-auto">
                            Pilih Paket
                        </Link>
                    </div>
                ) : (
                    <ServiceDetails details={subscriptionDetails} auth={auth} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}