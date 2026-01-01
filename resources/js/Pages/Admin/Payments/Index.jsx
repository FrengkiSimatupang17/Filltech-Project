import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { 
    MagnifyingGlassIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    DocumentTextIcon,
    PhotoIcon,
    CalendarIcon,
    UserIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, payments, filters }) {
    // State
    const [search, setSearch] = useState(filters.search || '');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [actionType, setActionType] = useState(null); // 'verified' atau 'rejected'
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.payments.index'), { search }, { preserveState: true });
    };

    // Modal Control
    const openModal = (payment, type) => {
        setSelectedPayment(payment);
        setActionType(type);
        setRejectionReason('');
    };

    const closeModal = () => {
        setSelectedPayment(null);
        setActionType(null);
        setProcessing(false);
    };

    // Handle Submit
    const handleSubmit = () => {
        if (!selectedPayment) return;
        setProcessing(true);

        router.patch(route('admin.payments.update', selectedPayment.id), {
            status: actionType,
            rejection_reason: actionType === 'rejected' ? rejectionReason : null,
        }, {
            onSuccess: () => closeModal(),
            onError: () => setProcessing(false),
            preserveScroll: true
        });
    };

    // Helper Styles
    const getStatusBadge = (status) => {
        switch(status) {
            case 'verified': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Verifikasi Pembayaran</h2>}
        >
            <Head title="Verifikasi Pembayaran" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* SEARCH BAR */}
                    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                            <BanknotesIcon className="w-6 h-6 text-blue-600" />
                            <h3 className="font-bold text-lg">Daftar Transaksi</h3>
                        </div>
                        <form onSubmit={handleSearch} className="relative w-full md:w-96">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                                placeholder="Cari ID Invoice / Nama Client..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* --- MOBILE VIEW (CARDS) --- */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {payments.data.map((payment) => (
                            <div key={payment.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                                {/* Status Stripe */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                    payment.status === 'verified' ? 'bg-green-500' : 
                                    payment.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}></div>

                                <div className="flex justify-between items-start mb-3 pl-2">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Invoice</p>
                                        <p className="text-blue-600 font-mono font-bold text-sm">#{payment.invoice?.invoice_number}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusBadge(payment.status)}`}>
                                        {payment.status}
                                    </span>
                                </div>

                                <div className="space-y-2 pl-2 mb-4">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-800">{payment.invoice?.user?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{new Date(payment.payment_date).toLocaleDateString('id-ID')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                        <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-bold text-gray-900">
                                            Rp {new Intl.NumberFormat('id-ID').format(payment.amount)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pl-2">
                                    <a href={`/storage/${payment.payment_proof_path}`} target="_blank" className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold text-center border border-gray-200 hover:bg-gray-200 transition">
                                        Bukti
                                    </a>
                                    {payment.status === 'pending' && (
                                        <>
                                            <button onClick={() => openModal(payment, 'verified')} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold text-center shadow-md shadow-green-200 hover:bg-green-700 transition">
                                                Terima
                                            </button>
                                            <button onClick={() => openModal(payment, 'rejected')} className="flex-1 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-xs font-bold text-center hover:bg-red-50 transition">
                                                Tolak
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- DESKTOP VIEW (TABLE) --- */}
                    <div className="hidden md:block bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client / Invoice</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nominal</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Bukti</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.data.length > 0 ? (
                                    payments.data.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(payment.payment_date).toLocaleDateString('id-ID')}
                                                <div className="text-xs text-gray-400">{new Date(payment.payment_date).toLocaleTimeString('id-ID')}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{payment.invoice?.user?.name}</span>
                                                    <span className="text-xs text-blue-600 font-mono">#{payment.invoice?.invoice_number}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-gray-800">
                                                    Rp {new Intl.NumberFormat('id-ID').format(payment.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a href={`/storage/${payment.payment_proof_path}`} target="_blank" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition">
                                                    <PhotoIcon className="w-4 h-4" /> Lihat
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {payment.status === 'pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => openModal(payment, 'verified')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-green-700 transition">
                                                            Terima
                                                        </button>
                                                        <button onClick={() => openModal(payment, 'rejected')} className="bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition">
                                                            Tolak
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Selesai</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500 bg-gray-50/50">
                                            Tidak ada data pembayaran ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <Pagination links={payments.links} />
                    </div>
                </div>
            </div>

            {/* --- MANUAL MODAL (NO FOCUS TRAP ERROR) --- */}
            {selectedPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 transition-all">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className={`px-6 py-4 border-b flex items-center gap-2 ${actionType === 'verified' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                            {actionType === 'verified' ? (
                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                            ) : (
                                <XCircleIcon className="w-6 h-6 text-red-600" />
                            )}
                            <h3 className={`text-lg font-bold ${actionType === 'verified' ? 'text-green-800' : 'text-red-800'}`}>
                                {actionType === 'verified' ? 'Konfirmasi Terima' : 'Konfirmasi Tolak'}
                            </h3>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                {actionType === 'verified' 
                                    ? `Apakah Anda yakin data pembayaran sebesar Rp ${new Intl.NumberFormat('id-ID').format(selectedPayment.amount)} valid dan ingin memverifikasinya?`
                                    : 'Mohon berikan alasan mengapa pembayaran ini ditolak agar Client dapat memperbaikinya.'
                                }
                            </p>

                            {actionType === 'rejected' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Alasan Penolakan</label>
                                    <textarea
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                                        rows="3"
                                        placeholder="Contoh: Bukti transfer tidak terbaca..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        autoFocus
                                    ></textarea>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                            <button 
                                onClick={closeModal}
                                disabled={processing}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={processing}
                                className={`px-4 py-2 rounded-lg text-white text-sm font-bold shadow-md transition flex items-center gap-2 ${
                                    actionType === 'verified' 
                                        ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                                        : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                }`}
                            >
                                {processing ? 'Memproses...' : (actionType === 'verified' ? 'Ya, Verifikasi' : 'Tolak Pembayaran')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}