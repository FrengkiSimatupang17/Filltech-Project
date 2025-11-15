import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Subscribe({ auth, packages, hasSubscription, subscription }) {
    
    const { post, processing } = useForm();

    const handleSubmit = (packageId) => {
        if (confirm('Anda yakin ingin berlangganan paket ini?')) {
            post(route('client.subscribe.store', { package_id: packageId }));
        }
    };

    const renderSubscriptionStatus = () => (
        <div className={`p-6 bg-opacity-20 border-l-4 ${subscription.status === 'active' ? 'bg-green-100 border-green-400' : 'bg-yellow-100 border-yellow-400'}`}>
            <h3 className={`text-lg font-medium ${subscription.status === 'active' ? 'text-green-800' : 'text-yellow-800'}`}>
                {subscription.status === 'active' ? 'Langganan Anda Aktif' : 'Langganan Anda Sedang Diproses'}
            </h3>
            <p className={`mt-2 ${subscription.status === 'active' ? 'text-green-700' : 'text-yellow-700'}`}>
                Anda telah memilih paket: <strong>{subscription.package.name}</strong>.
            </p>
            {subscription.status === 'pending' && (
                <p className="mt-1 text-yellow-700">
                    Admin kami akan segera memverifikasi data Anda dan mengirimkan tagihan biaya pemasangan.
                </p>
            )}
        </div>
    );

    const renderPackageSelection = () => (
        <>
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium">Pilih Paket WiFi</h3>
                <p className="mt-1 text-sm text-gray-600">Pilih paket yang paling sesuai dengan kebutuhan Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="border rounded-lg shadow-sm p-6 flex flex-col justify-between">
                        <div>
                            <h4 className="text-xl font-semibold text-gray-900">{pkg.name}</h4>
                            <p className="text-2xl font-bold text-indigo-600 mt-2">
                                Rp {parseFloat(pkg.price).toLocaleString('id-ID')}
                                <span className="text-sm font-normal text-gray-500"> /bulan</span>
                            </p>
                            <p className="text-gray-600 mt-4">{pkg.description || 'Deskripsi paket tidak tersedia.'}</p>
                        </div>
                        <PrimaryButton 
                            className="mt-6 w-full justify-center" 
                            onClick={() => handleSubmit(pkg.id)} 
                            disabled={processing}
                        >
                            Pilih Paket Ini
                        </PrimaryButton>
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pendaftaran & Langganan</h2>}
        >
            <Head title="Berlangganan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {hasSubscription ? renderSubscriptionStatus() : renderPackageSelection()}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}