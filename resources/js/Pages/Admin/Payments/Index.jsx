import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function PaymentIndex({ auth, payments }) {
    const [viewProofModal, setViewProofModal] = useState(false);
    const [selectedProof, setSelectedProof] = useState(null);
    
    const { data, setData, post, processing, reset } = useForm({
        action: '',
    });

    const handleAction = (paymentId, actionType) => {
        if (confirm(`Apakah Anda yakin ingin ${actionType === 'approve' ? 'menyetujui' : 'menolak'} pembayaran ini?`)) {
            post(route('admin.payments.update', paymentId), {
                data: { action: actionType },
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };

    const openProofModal = (url) => {
        setSelectedProof(url);
        setViewProofModal(true);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'verified': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>;
            case 'rejected': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
        }
    };

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Verifikasi Pembayaran</h2>}
        >
            <Head title="Verifikasi Pembayaran" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User / Invoice</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.data.length > 0 ? (
                                        payments.data.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{payment.user_name}</div>
                                                    <div className="text-sm text-gray-500">{payment.invoice_number}</div>
                                                    <div className="text-xs text-gray-400 capitalize">{payment.invoice_type}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                    {formatRupiah(payment.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {payment.payment_proof_url ? (
                                                        <button 
                                                            onClick={() => openProofModal(payment.payment_proof_url)}
                                                            className="text-blue-600 hover:text-blue-900 text-sm underline"
                                                        >
                                                            Lihat Bukti
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Tidak ada</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    {payment.status === 'pending' && (
                                                        <>
                                                            <PrimaryButton 
                                                                className="bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-900"
                                                                onClick={() => handleAction(payment.id, 'approve')}
                                                                disabled={processing}
                                                            >
                                                                ✓
                                                            </PrimaryButton>
                                                            <DangerButton 
                                                                onClick={() => handleAction(payment.id, 'reject')}
                                                                disabled={processing}
                                                            >
                                                                ✕
                                                            </DangerButton>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Belum ada data pembayaran.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="md:hidden space-y-4 px-4 sm:px-0">
                        {payments.data.length > 0 ? (
                            payments.data.map((payment) => (
                                <div key={payment.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800">{payment.user_name}</h3>
                                            <p className="text-xs text-gray-500">{payment.invoice_number} ({payment.invoice_type})</p>
                                        </div>
                                        {getStatusBadge(payment.status)}
                                    </div>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-lg font-bold text-gray-800">
                                            {formatRupiah(payment.amount)}
                                        </div>
                                        <div className="text-xs text-gray-400">{payment.created_at}</div>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        {payment.payment_proof_url ? (
                                            <button 
                                                onClick={() => openProofModal(payment.payment_proof_url)}
                                                className="text-blue-600 text-xs font-semibold"
                                            >
                                                📷 Lihat Bukti
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Tanpa Bukti</span>
                                        )}

                                        {payment.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleAction(payment.id, 'reject')}
                                                    className="px-3 py-1 bg-red-100 text-red-600 rounded text-xs font-bold"
                                                >
                                                    Tolak
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(payment.id, 'approve')}
                                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold shadow"
                                                >
                                                    Setuju
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-4 text-gray-500 bg-white rounded-lg">Belum ada data.</div>
                        )}
                    </div>

                    <div className="mt-6">
                        <Pagination links={payments.links} />
                    </div>
                </div>
            </div>

            <Modal show={viewProofModal} onClose={() => setViewProofModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Bukti Pembayaran</h2>
                    {selectedProof && (
                        <div className="flex justify-center bg-gray-100 rounded p-2">
                            <img src={selectedProof} alt="Bukti Transfer" className="max-h-[80vh] max-w-full rounded" />
                        </div>
                    )}
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setViewProofModal(false)}>
                            Tutup
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}