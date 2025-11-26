import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import { FaSearch, FaFileInvoiceDollar, FaCheckCircle } from 'react-icons/fa';

export default function Index({ auth, subscriptions, filters }) {
    const [showInvoiceModal, setShowInvoiceModal] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, processing, reset } = useForm({
        subscription_id: '',
        user_name: '',
        package_name: '',
        amount: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.subscriptions.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

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
            case 'pending': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">PENDING</span>;
            case 'active': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">AKTIF</span>;
            case 'cancelled': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">BATAL</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const formatRupiah = (value) => `Rp ${parseFloat(value).toLocaleString('id-ID')}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Langganan</h2>}
        >
            <Head title="Manajemen Langganan" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <form onSubmit={handleSearch} className="w-full md:w-1/3 flex">
                            <TextInput
                                type="text"
                                className="w-full rounded-r-none"
                                placeholder="Cari nama klien atau paket..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <PrimaryButton className="rounded-l-none justify-center px-4">
                                <FaSearch />
                            </PrimaryButton>
                        </form>
                    </div>

                    {subscriptions.data.length > 0 ? (
                        <>
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
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
                                        {subscriptions.data.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900">{sub.user_name}</div>
                                                    <div className="text-xs text-gray-500">{sub.user_email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-800">{sub.package_name}</div>
                                                    <div className="text-xs text-green-600 font-bold">{formatRupiah(sub.package_price)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(sub.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {sub.created_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {sub.status === 'pending' && !sub.has_installation_invoice && (
                                                        <PrimaryButton onClick={() => openInvoiceModal(sub)} className="text-xs h-8 bg-blue-600 hover:bg-blue-700">
                                                            Buat Tagihan
                                                        </PrimaryButton>
                                                    )}
                                                    {sub.has_installation_invoice && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            <FaFileInvoiceDollar className="mr-1" /> Tagihan Terkirim
                                                        </span>
                                                    )}
                                                    {sub.status === 'active' && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-50">
                                                            <FaCheckCircle className="mr-1" /> Aktif
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden space-y-4">
                                {subscriptions.data.map((sub) => (
                                    <div key={sub.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800">{sub.user_name}</h3>
                                                <p className="text-xs text-gray-500">{sub.user_email}</p>
                                            </div>
                                            {getStatusBadge(sub.status)}
                                        </div>
                                        
                                        <div className="text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-3 mt-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Paket:</span>
                                                <span className="font-bold">{sub.package_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Harga:</span>
                                                <span className="text-green-600 font-bold">{formatRupiah(sub.package_price)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Tanggal:</span>
                                                <span>{sub.created_at}</span>
                                            </div>
                                        </div>

                                        {sub.status === 'pending' && !sub.has_installation_invoice && (
                                            <div className="mt-4 pt-3 border-t border-gray-100">
                                                <PrimaryButton onClick={() => openInvoiceModal(sub)} className="w-full justify-center text-sm">
                                                    Buat Tagihan Instalasi
                                                </PrimaryButton>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <Pagination links={subscriptions.links} />
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            title="Tidak Ada Langganan"
                            message={search ? `Tidak ada langganan dengan kata kunci "${search}"` : "Belum ada klien yang mendaftar paket WiFi."}
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
                                type="text"
                                value={formatRupiah(data.amount)}
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