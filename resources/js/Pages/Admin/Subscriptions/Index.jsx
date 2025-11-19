import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import EmptyState from '@/Components/EmptyState';

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
        setShowInvoiceModal(sub.id);
    };

    const closeModal = () => {
        setShowInvoiceModal(null);
        reset();
    };

    const submitCreateInvoice = (e) => {
        e.preventDefault();
        post(route('admin.subscriptions.storeInvoice', data.subscription_id), {
            onSuccess: () => closeModal(),
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'badge badge-warning';
            case 'active': return 'badge badge-success text-white';
            case 'cancelled': return 'badge badge-error text-white';
            default: return 'badge badge-ghost';
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
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            {subscriptions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Klien</th>
                                                <th>Paket</th>
                                                <th>Status</th>
                                                <th>Tanggal Daftar</th>
                                                <th className="text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subscriptions.map((sub) => (
                                                <tr key={sub.id}>
                                                    <td>
                                                        <div className="font-bold">{sub.user_name}</div>
                                                        <div className="text-xs opacity-50">{sub.user_email}</div>
                                                    </td>
                                                    <td>{sub.package_name}</td>
                                                    <td>
                                                        <span className={getStatusBadge(sub.status)}>
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-sm">{sub.created_at}</td>
                                                    <td className="text-right">
                                                        {sub.status === 'pending' && !sub.has_installation_invoice && (
                                                            <button onClick={() => openInvoiceModal(sub)} className="btn btn-xs btn-outline btn-primary">
                                                                Buat Tagihan
                                                            </button>
                                                        )}
                                                        {sub.has_installation_invoice && (
                                                            <span className="text-xs text-gray-500 italic">Tagihan Terkirim</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState
                                    title="Tidak Ada Langganan"
                                    message="Belum ada klien yang mendaftar paket WiFi."
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={!!showInvoiceModal} onClose={closeModal}>
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
                            Buat Tagihan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}