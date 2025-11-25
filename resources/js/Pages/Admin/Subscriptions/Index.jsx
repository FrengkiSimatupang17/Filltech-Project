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
import Pagination from '@/Components/Pagination';

export default function Index({ auth, subscriptions }) {
    const [showInvoiceModal, setShowInvoiceModal] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        subscription_id: '',
        user_name: '',
        package_name: '',
        amount: '',
    });

    const openInvoiceModal = (sub) => {
        setData({
            subscription_id: sub.id,
            user_name: sub.user_name,
            package_name: sub.package_name,
            amount: sub.package_price,
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
            case 'pending': return 'badge badge-warning font-bold';
            case 'active': return 'badge badge-success text-white font-bold';
            case 'cancelled': return 'badge badge-error text-white font-bold';
            default: return 'badge badge-ghost';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Langganan</h2>}
        >
            <Head title="Manajemen Langganan" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {subscriptions.data.length > 0 ? (
                        <>
                            <div className="hidden md:block card bg-base-100 shadow-xl">
                                <div className="card-body p-0">
                                    <table className="table table-zebra w-full">
                                        <thead className="bg-base-200 text-base-content">
                                            <tr>
                                                <th className="p-4 rounded-tl-xl">Klien</th>
                                                <th className="p-4">Paket</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Tanggal Daftar</th>
                                                <th className="p-4 text-right rounded-tr-xl">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subscriptions.data.map((sub) => (
                                                <tr key={sub.id} className="hover">
                                                    <td>
                                                        <div className="font-bold">{sub.user_name}</div>
                                                        <div className="text-xs opacity-50">{sub.user_email}</div>
                                                    </td>
                                                    <td>
                                                        <div className="font-bold">{sub.package_name}</div>
                                                        <div className="text-xs">Rp {parseFloat(sub.package_price).toLocaleString('id-ID')}</div>
                                                    </td>
                                                    <td>
                                                        <span className={getStatusBadge(sub.status)}>
                                                            {sub.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="text-sm">{sub.created_at}</td>
                                                    <td className="text-right">
                                                        {sub.status === 'pending' && !sub.has_installation_invoice && (
                                                            <button onClick={() => openInvoiceModal(sub)} className="btn btn-xs btn-primary">
                                                                Buat Tagihan
                                                            </button>
                                                        )}
                                                        {sub.has_installation_invoice && (
                                                            <span className="badge badge-ghost badge-sm">Tagihan Terkirim</span>
                                                        )}
                                                        {sub.status === 'active' && (
                                                            <span className="text-success text-xs font-bold">AKTIF</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="md:hidden space-y-4 px-4 sm:px-0">
                                {subscriptions.data.map((sub) => (
                                    <div key={sub.id} className="card bg-base-100 shadow-md border border-base-200">
                                        <div className="card-body p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800">{sub.user_name}</h3>
                                                    <p className="text-xs text-gray-500">{sub.user_email}</p>
                                                </div>
                                                <span className={getStatusBadge(sub.status)}>
                                                    {sub.status.toUpperCase()}
                                                </span>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 space-y-2 border-t border-base-200 pt-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Paket:</span>
                                                    <span className="font-bold">{sub.package_name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Harga:</span>
                                                    <span>Rp {parseFloat(sub.package_price).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Tanggal:</span>
                                                    <span>{sub.created_at}</span>
                                                </div>
                                            </div>

                                            {sub.status === 'pending' && !sub.has_installation_invoice && (
                                                <div className="card-actions justify-end mt-4 pt-2 border-t border-base-200">
                                                    <button onClick={() => openInvoiceModal(sub)} className="btn btn-sm btn-primary w-full">
                                                        Buat Tagihan Instalasi
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination links={subscriptions.links} />
                        </>
                    ) : (
                        <EmptyState
                            title="Tidak Ada Langganan"
                            message="Belum ada klien yang mendaftar paket WiFi."
                        />
                    )}
                </div>
            </div>

            <Modal show={!!showInvoiceModal} onClose={closeModal}>
                <form onSubmit={submitCreateInvoice} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                        Konfirmasi Tagihan Instalasi
                    </h2>
                    <p className="mb-6 text-sm text-gray-600">
                        Sistem akan membuat tagihan otomatis untuk <strong>{data.user_name}</strong>.
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Paket yang Dipilih" />
                            <TextInput
                                value={data.package_name}
                                className="mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                                disabled
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="amount" value="Total Tagihan (Rp)" />
                            <TextInput
                                id="amount"
                                type="number"
                                value={data.amount}
                                className="mt-1 block w-full bg-gray-100 font-bold text-gray-800 cursor-not-allowed"
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">*Harga terkunci sesuai database paket.</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            Kirim Tagihan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}