import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';

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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'badge badge-warning font-bold';
            case 'verified': return 'badge badge-success text-white font-bold';
            case 'rejected': return 'badge badge-error text-white font-bold';
            default: return 'badge badge-ghost';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Verifikasi Pembayaran</h2>}
        >
            <Head title="Verifikasi Pembayaran" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {pending_payments.data.length > 0 ? (
                        <>
                            <div className="hidden md:block card bg-base-100 shadow-xl">
                                <div className="card-body p-0">
                                    <table className="table table-zebra w-full">
                                        <thead className="bg-base-200 text-base-content">
                                            <tr>
                                                <th className="p-4 rounded-tl-xl">Klien</th>
                                                <th className="p-4">Info Tagihan</th>
                                                <th className="p-4">Bukti</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 text-right rounded-tr-xl">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pending_payments.data.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td>
                                                        <div className="font-bold">{payment.user_name}</div>
                                                        <div className="text-xs opacity-50">{payment.user_email}</div>
                                                    </td>
                                                    <td>
                                                        <div className="font-bold">{payment.invoice_number}</div>
                                                        <div className="text-xs">Rp {parseFloat(payment.amount).toLocaleString('id-ID')}</div>
                                                        <div className="text-xs capitalize badge badge-ghost badge-sm mt-1">{payment.invoice_type}</div>
                                                    </td>
                                                    <td>
                                                        <a href={payment.payment_proof_url} target="_blank" rel="noreferrer" className="link link-primary text-xs font-bold">
                                                            Lihat Foto
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <span className={getStatusBadge(payment.status)}>
                                                            {payment.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="text-right space-x-2">
                                                        {payment.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => handleVerification(payment.id, 'approve')} className="btn btn-xs btn-success text-white">Setujui</button>
                                                                <button onClick={() => handleVerification(payment.id, 'reject')} className="btn btn-xs btn-error text-white">Tolak</button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="md:hidden space-y-4 px-4 sm:px-0">
                                {pending_payments.data.map((payment) => (
                                    <div key={payment.id} className="card bg-base-100 shadow-md border border-base-200">
                                        <div className="card-body p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-gray-800">{payment.user_name}</h3>
                                                    <p className="text-xs text-gray-500">{payment.invoice_number}</p>
                                                </div>
                                                <span className={getStatusBadge(payment.status)}>{payment.status.toUpperCase()}</span>
                                            </div>

                                            <div className="py-3 border-t border-base-200 space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Jumlah:</span>
                                                    <span className="font-bold">Rp {parseFloat(payment.amount).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Tipe:</span>
                                                    <span className="capitalize">{payment.invoice_type}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500">Bukti:</span>
                                                    <a href={payment.payment_proof_url} target="_blank" rel="noreferrer" className="btn btn-xs btn-outline">Lihat Bukti</a>
                                                </div>
                                            </div>

                                            {payment.status === 'pending' && (
                                                <div className="grid grid-cols-2 gap-3 mt-2 pt-3 border-t border-base-200">
                                                    <button onClick={() => handleVerification(payment.id, 'approve')} className="btn btn-sm btn-success text-white">Setujui</button>
                                                    <button onClick={() => handleVerification(payment.id, 'reject')} className="btn btn-sm btn-error text-white">Tolak</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination links={pending_payments.links} />
                        </>
                    ) : (
                        <EmptyState
                            title="Tidak Ada Pembayaran"
                            message="Belum ada pembayaran baru yang perlu diverifikasi."
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}