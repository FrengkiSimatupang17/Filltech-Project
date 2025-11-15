import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ auth, pending_payments }) {

    const handleVerification = (paymentId, action) => {
        if (confirm(`Anda yakin ingin ${action === 'approve' ? 'MENYETUJUI' : 'MENOLAK'} pembayaran ini?`)) {
            router.patch(route('admin.payments.update', paymentId), {
                action: action,
            }, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Verifikasi Pembayaran</h2>}
        >
            <Head title="Verifikasi Pembayaran" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {pending_payments.length === 0 ? (
                                <p>Tidak ada pembayaran yang menunggu verifikasi.</p>
                            ) : (
                                <div className="space-y-6">
                                    {pending_payments.map((payment) => (
                                        <div key={payment.id} className="p-4 border rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                            <div className="md:col-span-1 space-y-2">
                                                <div>
                                                    <div className="text-xs text-gray-500">Klien</div>
                                                    <div className="font-medium">{payment.user_name}</div>
                                                    <div className="text-sm text-gray-600">{payment.user_email}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">No. Tagihan</div>
                                                    <div className="font-medium">{payment.invoice_number}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Jumlah</div>
                                                    <div className="font-bold text-lg text-indigo-700">
                                                        Rp {parseFloat(payment.amount).toLocaleString('id-ID')}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Jenis</div>
                                                    <div className="text-sm font-medium capitalize">{payment.invoice_type}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="md:col-span-1">
                                                <div className="text-xs text-gray-500 mb-1">Bukti Pembayaran</div>
                                                <a href={payment.payment_proof_url} target="_blank" rel="noopener noreferrer">
                                                    <img 
                                                        src={payment.payment_proof_url} 
                                                        alt="Bukti Pembayaran"
                                                        className="rounded-lg border max-w-full h-auto cursor-pointer hover:opacity-80 transition-opacity"
                                                    />
                                                </a>
                                            </div>

                                            <div className="md:col-span-1 flex flex-col md:items-end justify-center space-y-3">
                                                <PrimaryButton onClick={() => handleVerification(payment.id, 'approve')} className="w-full md:w-auto justify-center">
                                                    Setujui
                                                </PrimaryButton>
                                                <DangerButton onClick={() => handleVerification(payment.id, 'reject')} className="w-full md:w-auto justify-center">
                                                    Tolak
                                                </DangerButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}