import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import DangerButton from '@/Components/DangerButton';
import TextArea from '@/Components/TextArea';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import InputCurrency from '@/Components/InputCurrency';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function Index({ auth, packages, filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        price: '',
        speed: '',
        description: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.packages.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openCreateModal = () => {
        reset();
        setShowCreateModal(true);
    };

    const openEditModal = (pkg) => {
        setData({
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
            speed: pkg.speed || '',
            description: pkg.description || '',
        });
        setShowEditModal(pkg.id);
    };
    
    const openDeleteModal = (pkg) => {
        setData({ id: pkg.id, name: pkg.name });
        setShowDeleteModal(pkg.id);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setShowEditModal(null);
        setShowDeleteModal(null);
        reset();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('admin.packages.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        patch(route('admin.packages.update', data.id), {
            onSuccess: () => closeModal(),
        });
    };

    const submitDelete = (e) => {
        e.preventDefault();
        destroy(route('admin.packages.destroy', data.id), {
            onSuccess: () => closeModal(),
        });
    };

    const formatRupiah = (value) => `Rp ${parseFloat(value).toLocaleString('id-ID')}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Paket WiFi</h2>
                    <PrimaryButton onClick={openCreateModal} className="w-full sm:w-auto justify-center">
                        <FaPlus className="mr-2" /> Tambah Paket Baru
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Manajemen Paket" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <form onSubmit={handleSearch} className="w-full md:w-1/3 flex">
                            <TextInput
                                type="text"
                                className="w-full rounded-r-none"
                                placeholder="Cari nama, kecepatan, atau deskripsi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <PrimaryButton className="rounded-l-none justify-center">
                                <FaSearch />
                            </PrimaryButton>
                        </form>
                    </div>


                    {packages.data.length > 0 ? (
                        <>
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                                <div className="p-0">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Paket</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecepatan</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {packages.data.map((pkg) => (
                                                <tr key={pkg.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold text-gray-800">{pkg.name}</td>
                                                    <td className="px-6 py-4 font-bold text-green-600">
                                                        {formatRupiah(pkg.price)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {pkg.speed}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-600">{pkg.description || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => openEditModal(pkg)} className="text-blue-600 hover:text-blue-900 mr-4">
                                                            <FaEdit size={18} />
                                                        </button>
                                                        <button onClick={() => openDeleteModal(pkg)} className="text-red-600 hover:text-red-900">
                                                            <FaTrash size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="md:hidden space-y-4 px-4 sm:px-0">
                                {packages.data.map((pkg) => (
                                    <div key={pkg.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                        <div className="flex justify-between items-start mb-3 border-b pb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800">{pkg.name}</h3>
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1">
                                                    {pkg.speed}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-green-600 text-xl">
                                                    {formatRupiah(pkg.price)}
                                                </div>
                                                <div className="text-xs text-gray-400">/ bulan</div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 mt-3">
                                            {pkg.description || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
                                        </p>

                                        <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-100">
                                            <SecondaryButton onClick={() => openEditModal(pkg)} className="text-xs h-8">
                                                Edit
                                            </SecondaryButton>
                                            <DangerButton onClick={() => openDeleteModal(pkg)} className="text-xs h-8">
                                                Hapus
                                            </DangerButton>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 md:p-0">
                                <Pagination links={packages.links} />
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            title="Belum Ada Paket"
                            message={search ? `Tidak ada paket dengan kata kunci "${search}"` : "Buat paket WiFi pertama Anda untuk memulai."}
                        >
                            <PrimaryButton onClick={openCreateModal}>
                                <FaPlus className="mr-2" /> Tambah Paket Baru
                            </PrimaryButton>
                        </EmptyState>
                    )}
                </div>
            </div>

            <Modal show={showCreateModal || !!showEditModal} onClose={closeModal}>
                <form onSubmit={showCreateModal ? submitCreate : submitEdit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {showCreateModal ? 'Tambah Paket Baru' : 'Edit Paket'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Paket" />
                            <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="price" value="Harga" />
                                <InputCurrency 
                                    id="price" 
                                    value={data.price} 
                                    onValueChange={(val) => setData('price', val)} 
                                    className="mt-1 block w-full" 
                                    required 
                                />
                                <InputError message={errors.price} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="speed" value="Kecepatan" />
                                <TextInput id="speed" value={data.speed} onChange={(e) => setData('speed', e.target.value)} className="mt-1 block w-full" placeholder="50 Mbps" />
                                <InputError message={errors.speed} className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Deskripsi" />
                            <TextArea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full" rows="3" />
                            <InputError message={errors.description} className="mt-1" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {showCreateModal ? 'Simpan' : 'Simpan Perubahan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={!!showDeleteModal} onClose={closeModal}>
                <form onSubmit={submitDelete} className="p-6 text-center">
                    <h2 className="text-lg font-bold text-gray-900">Hapus Paket?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus paket <span className="font-bold">"{data.name}"</span>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton disabled={processing}>Ya, Hapus</DangerButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}