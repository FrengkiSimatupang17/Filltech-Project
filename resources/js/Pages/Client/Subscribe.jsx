import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import LoadingOverlay from '@/Components/LoadingOverlay';
import { FaWifi, FaCheckCircle, FaClock, FaInfoCircle } from 'react-icons/fa';

export default function Subscribe({ auth, packages, currentSubscription }) {
    const { post, processing } = useForm({
        package_id: null
    });

    const handleSubscribe = (packageId) => {
        if (confirm('Apakah Anda yakin ingin memilih paket ini?')) {
            post(route('client.subscribe.store'), {
                data: { package_id: packageId },
            });
        }
    };

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const SubscriptionStatusCard = ({ sub }) => (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className={`p-6 text-center text-white ${sub.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}>
                <div className="flex justify-center mb-4">
                    {sub.status === 'active' ? (
                        <FaCheckCircle className="w-16 h-16 text-white opacity-90" />
                    ) : (
                        <FaClock className="w-16 h-16 text-white opacity-90" />
                    )}
                </div>
                <h2 className="text-2xl font-bold mb-1">
                    {sub.status === 'active' ? 'Layanan Aktif' : 'Menunggu Verifikasi'}
                </h2>
                <p className="opacity-90">
                    {sub.status === 'active' ? 'Nikmati internet cepat tanpa batas.' : 'Permintaan Anda sedang diproses oleh admin.'}
                </p>
            </div>
            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-6 mb-6">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Paket Pilihan</p>
                        <h3 className="text-3xl font-bold text-gray-800">{sub.package.name}</h3>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Kecepatan</p>
                        <div className="flex items-center justify-center md:justify-end gap-2 text-blue-600 font-bold text-xl">
                            <FaWifi /> {sub.package.speed}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {sub.status === 'pending' 
                            ? 'Tim kami akan segera menghubungi Anda untuk jadwal instalasi. Pastikan nomor telepon di profil Anda aktif.' 
                            : 'Tagihan bulanan akan dikirimkan setiap tanggal jatuh tempo. Cek menu Tagihan untuk info pembayaran.'}
                    </p>
                </div>
            </div>
        </div>
    );

    const PricingCard = ({ pkg }) => (
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-50 bg-gradient-to-b from-white to-gray-50/50">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">{formatRupiah(pkg.price)}</span>
                    <span className="text-sm text-gray-500">/bulan</span>
                </div>
            </div>
            
            <div className="p-6 flex-grow">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FaWifi size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Kecepatan</p>
                        <p className="font-bold text-gray-800 text-lg">{pkg.speed}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {pkg.description || 'Koneksi stabil fiber optic, unlimited tanpa FUP, cocok untuk kebutuhan harian.'}
                </p>
            </div>

            <div className="p-6 pt-0 mt-auto">
                <PrimaryButton 
                    className="w-full justify-center h-12 text-base"
                    onClick={() => handleSubscribe(pkg.id)}
                    disabled={processing}
                >
                    Pilih Paket Ini
                </PrimaryButton>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Berlangganan</h2>}
        >
            <Head title="Pilih Paket" />
            
            <LoadingOverlay show={processing} message="Memproses langganan..." />

            <div className="py-8 sm:py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                            {currentSubscription ? 'Status Langganan Anda' : 'Pilih Paket Internet Terbaik'}
                        </h1>
                        {!currentSubscription && (
                            <p className="text-lg text-gray-600">
                                Nikmati internet cepat dan stabil dengan harga terjangkau. Tanpa biaya tersembunyi.
                            </p>
                        )}
                    </div>

                    {currentSubscription ? (
                        <SubscriptionStatusCard sub={currentSubscription} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0">
                            {packages.map((pkg) => (
                                <PricingCard key={pkg.id} pkg={pkg} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}