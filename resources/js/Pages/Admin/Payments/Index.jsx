import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import LoadingOverlay from '@/Components/LoadingOverlay';

export default function Index({ auth, payments }) {
    const [showProofModal, setShowProofModal] = useState(false);
    const [selectedProofUrl, setSelectedProofUrl] = useState(null);
    const [processingId, setProcessingId] = useState(null); // State untuk loading per item

    const handleVerification = (paymentId, action) => {
        const actionText = action === 'approve' ? 'MENYETUJUI' : 'MENOLAK';
        
        if (confirm(`Apakah Anda yakin ingin ${actionText} pembayaran ini? Tindakan ini tidak dapat dibatalkan.`)) {
            setProcessingId(paymentId); // Aktifkan loading

            // Menggunakan POST ke method update di controller (dengan _method: patch)
            router.post(route('admin.payments.update', paymentId), {
                _method: 'patch', 
                action: action,
            }, {
                preserveScroll: true,
                onFinish: () => setProcessingId(null), // Matikan loading setelah selesai
            });
        }
    };

    const openProofModal = (url) => {
        setSelectedProofUrl(url);
        setShowProofModal(true);
    };

    const closeProofModal = () => {
        setShowProofModal(false);
        setSelectedProofUrl(null);
    };

    // Helper: Badge Status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': 
                return <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">PENDING</span>;
            case 'verified': 
                return <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">LUNAS</span>;
            case 'rejected': 
                return <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-200">DITOLAK</span>;
            default: 
                return <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">-</span>;
        }
    };

    const formatRupiah = (amount) => new Intl.NumberFormat('id-ID').format(amount);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Verifikasi Pembayaran</h2>}
        >
            <Head title="Verifikasi Pembayaran" />

            {/* Loading Overlay Global jika ada proses berat */}
            <LoadingOverlay show={!!processingId} message="Memproses Verifikasi..." />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {payments.data.length > 0 ? (
                        <>
                            {/* --- DESKTOP TABLE --- */}
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tagihan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.data.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900">{payment.user_name}</div>
                                                    <div className="text-xs text-gray-500">{payment.user_email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{payment.invoice_number}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Rp {formatRupiah(payment.amount)} 
                                                        <span className="ml-2 uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] border border-gray-200">
                                                            {payment.invoice_type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {payment.payment_proof_url ? (
                                                        <button 
                                                            onClick={() => openProofModal(payment.payment_proof_url)}
                                                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold underline flex items-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            Lihat Foto
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">Tidak ada bukti</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {payment.status === 'pending' && (
                                                        <div className="flex justify-end gap-2">
                                                            <button 
                                                                onClick={() => handleVerification(payment.id, 'approve')} 
                                                                disabled={processingId === payment.id}
                                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-bold shadow-sm transition disabled:opacity-50"
                                                            >
                                                                Terima
                                                            </button>
                                                            <button 
                                                                onClick={() => handleVerification(payment.id, 'reject')} 
                                                                disabled={processingId === payment.id}
                                                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-bold shadow-sm transition disabled:opacity-50"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </div>
                                                    )}
                                                    {payment.status !== 'pending' && (
                                                        <span className="text-gray-400 text-xs italic">Selesai</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- MOBILE CARD VIEW --- */}
                            <div className="md:hidden space-y-4">
                                {payments.data.map((payment) => (
                                    <div key={payment.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-sm">{payment.user_name}</h3>
                                                <p className="text-xs text-gray-500">{payment.invoice_number}</p>
                                            </div>
                                            {getStatusBadge(payment.status)}
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Jumlah Tagihan</span>
                                                <span className="font-bold text-gray-800">Rp {formatRupiah(payment.amount)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Tipe Pembayaran</span>
                                                <span className="capitalize text-gray-700">{payment.invoice_type}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Bukti Transfer</span>
                                                {payment.payment_proof_url ? (
                                                    <button 
                                                        onClick={() => openProofModal(payment.payment_proof_url)}
                                                        className="text-blue-600 font-medium text-xs border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                                                    >
                                                        Lihat
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">n/a</span>
                                                )}
                                            </div>
                                        </div>

                                        {payment.status === 'pending' && (
                                            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                                                <button 
                                                    onClick={() => handleVerification(payment.id, 'approve')} 
                                                    disabled={processingId === payment.id}
                                                    className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition shadow-sm disabled:opacity-50"
                                                >
                                                    Terima
                                                </button>
                                                <button 
                                                    onClick={() => handleVerification(payment.id, 'reject')} 
                                                    disabled={processingId === payment.id}
                                                    className="w-full py-2.5 bg-white border border-red-500 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50 transition disabled:opacity-50"
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* --- PAGINATION --- */}
                            <div className="mt-6">
                                <Pagination links={payments.links} />
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            title="Tidak Ada Pembayaran"
                            message="Belum ada data pembayaran masuk yang perlu diverifikasi saat ini."
                        />
                    )}
                </div>
            </div>

            {/* MODAL BUKTI PEMBAYARAN */}
            <Modal show={showProofModal} onClose={closeProofModal}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Bukti Pembayaran</h2>
                        <button onClick={closeProofModal} className="text-gray-400 hover:text-gray-600 transition">
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>
                    <div className="flex justify-center bg-gray-100 rounded-lg p-2 border border-gray-200 min-h-[200px] items-center">
                        {selectedProofUrl ? (
                            <img 
                                src={selectedProofUrl} 
                                alt="Bukti Transfer" 
                                className="max-h-[70vh] max-w-full object-contain rounded shadow-sm" 
                            />
                        ) : (
                            <p className="text-gray-500 italic">Gambar tidak dapat dimuat.</p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeProofModal}>
                            Tutup
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}