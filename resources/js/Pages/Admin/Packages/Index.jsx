import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import DangerButton from '@/Components/DangerButton';

export default function Index({ auth, packages }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null); // Will hold the package id
    const [showDeleteModal, setShowDeleteModal] = useState(null); // Will hold the package id

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        price: '',
        description: '',
    });

    const openCreateModal = () => {
        reset();
        setShowCreateModal(true);
    };

    const openEditModal = (pkg) => {
        setData({
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Paket WiFi</h2>
                    <PrimaryButton onClick={openCreateModal}>Tambah Paket Baru</PrimaryButton>
                </div>
            }
        >
            <Head title="Manajemen Paket" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Paket</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga (Rp)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {packages.map((pkg) => (
                                    <tr key={pkg.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{pkg.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{parseFloat(pkg.price).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4">{pkg.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openEditModal(pkg)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                            <button onClick={() => openDeleteModal(pkg)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {packages.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            Belum ada paket yang dibuat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal untuk Create / Edit */}
            <Modal show={showCreateModal || !!showEditModal} onClose={closeModal}>
                <form onSubmit={showCreateModal ? submitCreate : submitEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {showCreateModal ? 'Tambah Paket Baru' : 'Edit Paket'}
                    </h2>
                    <div className="mt-6">
                        <InputLabel htmlFor="name" value="Nama Paket" />
                        <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full" required />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="price" value="Harga" />
                        <TextInput id="price" type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} className="mt-1 block w-full" required />
                        <InputError message={errors.price} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Deskripsi (Opsional)" />
                        <TextInput id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full" />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            {showCreateModal ? 'Simpan' : 'Simpan Perubahan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal untuk Delete */}
            <Modal show={!!showDeleteModal} onClose={closeModal}>
                <form onSubmit={submitDelete} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Hapus Paket
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus paket "{data.name}"? Data ini tidak dapat dikembalikan.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton className="ml-3" disabled={processing}>
                            Hapus Paket
                        </DangerButton>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}