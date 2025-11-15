import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Index({ auth, subscriptions }) {
    const [showInvoiceModal, setShowInvoiceModal] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        subscription_id: '',
        user_name: '',
        amount: '',
    });

    const openInvoiceModal = (sub) => {
        setData({
            subscription_id: sub.id,
            user_name: sub.user_name,
            amount: '',
        });
        setShowInvoiceModal(true);
    };

    const closeModal = () => {
        setShowInvoiceModal(false);
        reset();
    };

    const submitCreateInvoice = (e) => {
        e.preventDefault();
        post(route('admin.subscriptions.storeInvoice', data.subscription_id), {
            onSuccess: () => closeModal(),
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'active': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Langganan</h2>}
        >
            <Head title="Manajemen Langganan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {subscriptions.map((sub) => (
                                        <tr key={sub.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{sub.user_name}</div>
                                                <div className="text-sm text-gray-500">{sub.user_email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.package_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(sub.status)}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.created_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {sub.status === 'pending' && !sub.has_installation_invoice && (
                                                    <button onClick={() => openInvoiceModal(sub)} className="text-indigo-600 hover:text-indigo-900">
                                                        Buat Tagihan Instalasi
                                                    </button>
                                                )}
                                                {sub.has_installation_invoice && (
                                                    <span className="text-sm text-gray-500">Tagihan Dibuat</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showInvoiceModal} onClose={closeModal}>
                <form onSubmit={submitCreateInvoice} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Buat Tagihan Instalasi untuk {data.user_name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Masukkan jumlah biaya pemasangan untuk klien ini. Tagihan akan otomatis dibuat dan statusnya 'pending'.
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor="amount" value="Jumlah (Rp)" />
                        <TextInput
                            id="amount"
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.amount} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            Buat Tagahian
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}