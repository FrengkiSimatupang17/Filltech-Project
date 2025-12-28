import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import ToastNotification from '@/Components/ToastNotification';
import { FaCheck, FaTimes, FaSearch, FaEye, FaCopy, FaCheckCircle } from 'react-icons/fa';

// Helper Component untuk Badge Status
const StatusBadge = ({ status }) => {
    let classes = "";
    let label = "";

    switch (status) {
        case 'verified':
            classes = "bg-green-100 text-green-800";
            label = "DITERIMA";
            break;
        case 'rejected':
            classes = "bg-red-100 text-red-800";
            label = "DITOLAK";
            break;
        default:
            classes = "bg-yellow-100 text-yellow-800";
            label = "MENUNGGU";
            break;
    }

    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}>
            {label}
        </span>
    );
};

export default function PaymentIndex({ auth, payments, filters = {} }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [processing, setProcessing] = useState(false); // Manual loading state

    // State Modal
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    
    const [toastMessage, setToastMessage] = useState(null);

    // useForm hanya digunakan untuk menampung inputan rejection_reason
    const { data, setData, reset } = useForm({
        rejection_reason: '',
    });

    const handleSearch = (e) => {
        if(e) e.preventDefault();
        router.get(route('admin.payments.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const copyToClipboard = (text, label) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setToastMessage(`${label} berhasil disalin!`);
    };

    const openVerifyModal = (payment) => {
        setSelectedPayment(payment);
    };

    const closeModal = () => {
        setSelectedPayment(null);
        setShowRejectModal(false);
        setShowApproveModal(false);
        reset();
    };

    const openApproveModal = () => {
        setShowApproveModal(true);
    };

    // Submit Approve (Terima)
    const submitApprove = () => {
        router.patch(route('admin.payments.update', selectedPayment.id), {
            status: 'verified' 
        }, {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                setShowApproveModal(false);
                closeModal();
                setToastMessage("Pembayaran berhasil diverifikasi ✅");
            },
        });
    };

    const openRejectModal = () => {
        setShowRejectModal(true);
    };

    // Submit Reject (Tolak)
    const submitReject = (e) => {
        e.preventDefault();
        router.patch(route('admin.payments.update', selectedPayment.id), {
            status: 'rejected',
            rejection_reason: data.rejection_reason
        }, {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                closeModal();
                setToastMessage("Pembayaran ditolak ❌");
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Verifikasi Pembayaran</h2>}
        >
            <Head title="Verifikasi Pembayaran" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <form onSubmit={handleSearch} className="flex w-full md:w-1/2 gap-2">
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                placeholder="Cari ID, Nama Klien, atau Invoice..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <PrimaryButton className="justify-center px-4">
                                <FaSearch />
                            </PrimaryButton>
                        </form>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        {payments.data.length > 0 ? (
                            <>
                                {/* --- DESKTOP VIEW (TABLE) --- */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Klien</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tagihan</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nominal</th>
                                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {payments.data.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(payment.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900">{payment.invoice?.user?.name || 'User Terhapus'}</div>
                                                        <div className="text-xs text-gray-500">{payment.invoice?.user?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <span>#{payment.invoice?.invoice_number}</span>
                                                            <button 
                                                                onClick={() => copyToClipboard(payment.invoice?.invoice_number, 'No. Invoice')}
                                                                className="text-gray-400 hover:text-indigo-600"
                                                                title="Salin No Invoice"
                                                            >
                                                                <FaCopy size={12} />
                                                            </button>
                                                        </div>
                                                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full mt-1 inline-block border border-gray-200">
                                                            {payment.invoice?.type === 'installation' ? 'Instalasi' : 'Bulanan'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                        {formatRupiah(payment.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <StatusBadge status={payment.status} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <PrimaryButton onClick={() => openVerifyModal(payment)} className="text-xs">
                                                            {payment.status === 'pending' ? 'Proses' : 'Lihat'}
                                                        </PrimaryButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* --- MOBILE VIEW (CARDS) --- */}
                                <div className="md:hidden space-y-4 p-4 bg-gray-50">
                                    {payments.data.map((payment) => (
                                        <div key={payment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                            <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                                                <div className="text-xs text-gray-500">
                                                    {new Date(payment.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <StatusBadge status={payment.status} />
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Klien</p>
                                                    <p className="font-bold text-gray-900">{payment.invoice?.user?.name}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Invoice</p>
                                                        <p className="text-sm font-medium text-gray-700">#{payment.invoice?.invoice_number}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Nominal</p>
                                                        <p className="text-sm font-bold text-blue-800">{formatRupiah(payment.amount)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => openVerifyModal(payment)}
                                                className="w-full flex justify-center items-center py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-md hover:bg-indigo-100 text-sm border border-indigo-200 transition"
                                            >
                                                <FaEye className="mr-2" />
                                                {payment.status === 'pending' ? 'Verifikasi Pembayaran' : 'Lihat Detail'}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="p-4 border-t border-gray-200 bg-white">
                                    <Pagination links={payments.links} />
                                </div>
                            </>
                        ) : (
                            <EmptyState title="Tidak ada pembayaran" message="Belum ada data pembayaran yang sesuai pencarian." />
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODAL DETAIL PEMBAYARAN --- */}
            <Modal show={!!selectedPayment && !showRejectModal && !showApproveModal} onClose={closeModal} maxWidth="4xl">
                <div className="flex flex-col h-full md:h-auto" tabIndex={0}>
                    <div className="p-4 md:p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Detail Pembayaran</h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>

                    <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Kiri: Gambar */}
                            <div className="w-full md:w-1/2 bg-gray-100 rounded-lg flex items-center justify-center p-2 border border-gray-200 min-h-[250px] md:min-h-[400px]">
                                {selectedPayment?.payment_proof_path ? (
                                    <img 
                                        src={`/storage/${selectedPayment.payment_proof_path}`} 
                                        alt="Bukti Transfer" 
                                        className="max-w-full max-h-[400px] object-contain rounded-md shadow-sm cursor-pointer hover:opacity-95 transition"
                                        onClick={() => window.open(`/storage/${selectedPayment.payment_proof_path}`, '_blank')}
                                        title="Klik untuk memperbesar"
                                    />
                                ) : (
                                    <p className="text-gray-500 italic">File tidak ditemukan</p>
                                )}
                            </div>

                            {/* Kanan: Info */}
                            <div className="w-full md:w-1/2 space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <p className="text-xs text-blue-600 font-bold uppercase">Nominal Ditransfer</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl md:text-3xl font-black text-blue-900">
                                            {selectedPayment && formatRupiah(selectedPayment.amount)}
                                        </p>
                                        <button onClick={() => copyToClipboard(selectedPayment.amount.toString(), 'Nominal')} className="text-blue-400 hover:text-blue-700">
                                            <FaCopy />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs">Nama Pengirim</p>
                                        <p className="font-bold text-gray-900 text-base">{selectedPayment?.invoice?.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Tanggal</p>
                                        <p className="font-bold text-gray-900 text-base">{selectedPayment && new Date(selectedPayment.created_at).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <p className="text-gray-500 text-xs">No. Invoice</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                                {selectedPayment?.invoice?.invoice_number}
                                            </p>
                                            <button onClick={() => copyToClipboard(selectedPayment?.invoice?.invoice_number, 'No. Invoice')} className="text-gray-400 hover:text-indigo-600">
                                                <FaCopy />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col md:flex-row gap-3">
                                    <SecondaryButton className="justify-center py-3 w-full" onClick={closeModal}>Tutup</SecondaryButton>
                                    
                                    {selectedPayment?.status === 'pending' && (
                                        <>
                                            <DangerButton className="justify-center py-3 w-full" onClick={openRejectModal} disabled={processing}>
                                                <FaTimes className="mr-2" /> Tolak
                                            </DangerButton>
                                            <PrimaryButton 
                                                className="justify-center py-3 w-full bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800" 
                                                onClick={openApproveModal} 
                                                disabled={processing}
                                            >
                                                <FaCheck className="mr-2" /> Terima
                                            </PrimaryButton>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* --- MODAL KONFIRMASI TERIMA (VALID) --- */}
            <Modal show={showApproveModal} onClose={() => setShowApproveModal(false)} maxWidth="sm">
                <div className="p-6 text-center" tabIndex={0}>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 animate-bounce-short">
                        <FaCheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Verifikasi Pembayaran?</h2>
                    <p className="text-sm text-gray-600 mb-6 px-4">
                        Pastikan dana sebesar <span className="font-bold text-gray-800 bg-gray-100 px-1 rounded">{selectedPayment && formatRupiah(selectedPayment.amount)}</span> sudah masuk ke rekening Anda.
                        <br/><br/>
                        Tindakan ini akan mengubah status tagihan menjadi <b>LUNAS</b>.
                    </p>
                    <div className="flex justify-center gap-3">
                        <SecondaryButton className="w-full justify-center" onClick={() => setShowApproveModal(false)}>Batal</SecondaryButton>
                        <PrimaryButton 
                            className="w-full justify-center bg-green-600 hover:bg-green-700 focus:bg-green-700" 
                            onClick={submitApprove} 
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : 'Ya, Valid'}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* --- MODAL TOLAK --- */}
            <Modal show={showRejectModal} onClose={() => setShowRejectModal(false)} maxWidth="md">
                <form onSubmit={submitReject} className="p-6" tabIndex={0}>
                    <div className="text-center mb-4">
                         <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                            <FaTimes className="h-6 w-6 text-red-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Tolak Pembayaran</h2>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                        Berikan alasan penolakan untuk dikirim ke klien:
                    </p>
                    
                    <div className="mb-6">
                        <textarea
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-3 text-sm text-gray-900"
                            rows="4"
                            placeholder="Contoh: Bukti transfer buram, nominal tidak sesuai, dll."
                            value={data.rejection_reason}
                            onChange={(e) => setData('rejection_reason', e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row justify-end gap-3">
                        <SecondaryButton className="justify-center w-full" onClick={() => setShowRejectModal(false)}>Batal</SecondaryButton>
                        <DangerButton className="justify-center w-full" disabled={processing}>
                            {processing ? 'Memproses...' : 'Konfirmasi Tolak'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>

            {/* Toast Notification */}
            <ToastNotification message={toastMessage} setMessage={setToastMessage} />

        </AuthenticatedLayout>
    );
}