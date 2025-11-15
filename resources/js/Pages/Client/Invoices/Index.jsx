import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

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
        setShowUploadModal(true);
    };

    const closeModal = () => {
        setShowUploadModal(false);
        reset();
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('client.payments.store'), {
            forceFormData: true,
            onSuccess: () => closeModal(),
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'paid': return 'bg-green-100 text-green-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusText = (invoice) => {
        if (invoice.status === 'paid') {
            return 'Lunas';
        }
        if (invoice.payment_status === 'pending') {
            return 'Menunggu Verifikasi';
        }
        if (invoice.payment_status === 'rejected') {
            return 'Ditolak';
        }
        return 'Belum Dibayar';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tagihan & Pembayaran</h2>}
        >
            <Head title="Tagihan Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Tagihan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah (Rp)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{invoice.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parseFloat(invoice.amount).toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.due_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                                                    {getPaymentStatusText(invoice)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {invoice.status === 'pending' && !invoice.payment_status && (
                                                    <button onClick={() => openUploadModal(invoice)} className="text-indigo-600 hover:text-indigo-900">
                                                        Unggah Bukti Bayar
                                                    </button>
                                                )}
                                                {invoice.payment_status === 'rejected' && (
                                                    <button onClick={() => openUploadModal(invoice)} className="text-red-600 hover:text-red-900">
                                                        Unggah Ulang
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                Belum ada tagihan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showUploadModal} onClose={closeModal}>
                <form onSubmit={submitPayment} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Konfirmasi Pembayaran
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Silakan unggah bukti transfer Anda untuk tagihan <span className="font-medium">{data.invoice_number}</span> senilai <span className="font-medium">Rp {parseFloat(data.amount).toLocaleString('id-ID')}</span>.
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor="payment_proof" value="File Bukti Bayar (JPG, PNG, maks 2MB)" />
                        <input
                            id="payment_proof"
                            type="file"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={(e) => setData('payment_proof', e.target.files[0])}
                            required
                        />
                        <InputError message={errors.payment_proof} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            Unggah
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}