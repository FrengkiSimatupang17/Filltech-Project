import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import { FaFileInvoiceDollar, FaCalendarAlt, FaUpload, FaHistory } from 'react-icons/fa';

export default function Index({ auth, invoices }) {
    const [showUploadModal, setShowUploadModal] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        invoice_id: '',
        invoice_number: '',
        amount: '',
        payment_proof: null,
    });

    const openUploadModal = (invoice) => {
        setData({
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number,
            amount: invoice.amount,
            payment_proof: null,
        });
        setShowUploadModal(invoice.id);
    };

    const closeModal = () => {
        setShowUploadModal(null);
        reset();
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('client.payments.store'), {
            forceFormData: true,
            onSuccess: () => closeModal(),
        });
    };

    const getStatusBadge = (invoice) => {
        let label = 'Belum Dibayar';
        let className = 'bg-gray-100 text-gray-800';

        if (invoice.status === 'paid') {
            label = 'Lunas';
            className = 'bg-green-100 text-green-800';
        } else if (invoice.payment_status === 'pending') {
            label = 'Menunggu Verifikasi';
            className = 'bg-blue-100 text-blue-800';
        } else if (invoice.payment_status === 'rejected') {
            label = 'Ditolak';
            className = 'bg-red-100 text-red-800';
        } else if (invoice.status === 'overdue') {
            label = 'Terlambat';
            className = 'bg-red-100 text-red-800';
        }

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
                {label}
            </span>
        );
    };

    const formatRupiah = (amount) => `Rp ${parseFloat(amount).toLocaleString('id-ID')}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tagihan & Pembayaran</h2>}
        >
            <Head title="Tagihan Saya" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {invoices.data.length > 0 ? (
                        <>
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Tagihan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {invoices.data.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    {invoice.invoice_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                    {invoice.type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {invoice.due_date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                                                    {formatRupiah(invoice.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(invoice)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {invoice.status === 'pending' && !invoice.payment_status && (
                                                        <PrimaryButton onClick={() => openUploadModal(invoice)} className="text-xs bg-indigo-600 hover:bg-indigo-700">
                                                            Upload Bukti
                                                        </PrimaryButton>
                                                    )}
                                                    {invoice.payment_status === 'rejected' && (
                                                        <DangerButton onClick={() => openUploadModal(invoice)} className="text-xs">
                                                            Upload Ulang
                                                        </DangerButton>
                                                    )}
                                                    {invoice.status === 'paid' && (
                                                        <span className="text-green-600 flex items-center justify-end gap-1">
                                                            <FaHistory /> Selesai
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden space-y-4">
                                {invoices.data.map((invoice) => (
                                    <div key={invoice.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                        <div className="flex justify-between items-start mb-3 border-b pb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{invoice.invoice_number}</h3>
                                                <span className="text-xs text-gray-500 capitalize">{invoice.type}</span>
                                            </div>
                                            {getStatusBadge(invoice)}
                                        </div>
                                        
                                        <div className="text-sm text-gray-600 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 flex items-center gap-1"><FaCalendarAlt /> Jatuh Tempo</span>
                                                <span>{invoice.due_date}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 flex items-center gap-1"><FaFileInvoiceDollar /> Jumlah</span>
                                                <span className="text-lg font-bold text-indigo-600">{formatRupiah(invoice.amount)}</span>
                                            </div>
                                        </div>

                                        {(invoice.status === 'pending' && !invoice.payment_status) || invoice.payment_status === 'rejected' ? (
                                            <div className="mt-4 pt-3 border-t border-gray-100">
                                                <PrimaryButton onClick={() => openUploadModal(invoice)} className="w-full justify-center">
                                                    <FaUpload className="mr-2" /> Unggah Bukti Pembayaran
                                                </PrimaryButton>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <Pagination links={invoices.links} />
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            title="Tidak Ada Tagihan"
                            message="Anda belum memiliki riwayat tagihan atau pembayaran."
                        />
                    )}
                </div>
            </div>

            <Modal show={!!showUploadModal} onClose={closeModal}>
                <form onSubmit={submitPayment} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                        Konfirmasi Pembayaran
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 mb-6">
                        Silakan unggah bukti transfer untuk tagihan <strong>{data.invoice_number}</strong> senilai <span className="text-indigo-600 font-bold">Rp {parseFloat(data.amount).toLocaleString('id-ID')}</span>.
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="payment_proof" value="File Bukti Bayar (JPG/PNG, Max 2MB)" />
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors bg-gray-50">
                                <div className="space-y-1 text-center">
                                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="payment_proof" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                            <span>Upload file</span>
                                            <input
                                                id="payment_proof"
                                                type="file"
                                                className="sr-only"
                                                onChange={(e) => setData('payment_proof', e.target.files[0])}
                                                accept="image/*"
                                                required
                                            />
                                        </label>
                                        <p className="pl-1">atau drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 2MB</p>
                                    {data.payment_proof && (
                                        <p className="text-sm text-green-600 font-bold mt-2">
                                            File terpilih: {data.payment_proof.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <InputError message={errors.payment_proof} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            Kirim Bukti
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}