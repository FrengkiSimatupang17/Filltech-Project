import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
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

export default function Index({ auth, packages }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        price: '',
        speed: '',
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
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            {packages.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra table-sm min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="p-4">Nama Paket</th>
                                                <th className="p-4">Harga (Rp)</th>
                                                <th className="p-4">Kecepatan</th>
                                                <th className="p-4">Deskripsi</th>
                                                <th className="p-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {packages.map((pkg) => (
                                                <tr key={pkg.id}>
                                                    <td className="font-medium">{pkg.name}</td>
                                                    <td>{parseFloat(pkg.price).toLocaleString('id-ID')}</td>
                                                    <td>{pkg.speed}</td>
                                                    <td className="max-w-xs truncate">{pkg.description}</td>
                                                    <td className="text-right">
                                                        <button onClick={() => openEditModal(pkg)} className="link link-primary text-sm mr-4">Edit</button>
                                                        <button onClick={() => openDeleteModal(pkg)} className="link link-error text-sm">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState
                                    title="Belum Ada Paket"
                                    message="Buat paket WiFi pertama Anda untuk memulai."
                                >
                                    <PrimaryButton onClick={openCreateModal}>
                                        Tambah Paket Baru
                                    </PrimaryButton>
                                </EmptyState>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
                        <InputLabel htmlFor="speed" value="Kecepatan (Cth: 50 Mbps)" />
                        <TextInput id="speed" value={data.speed} onChange={(e) => setData('speed', e.target.value)} className="mt-1 block w-full" />
                        <InputError message={errors.speed} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Deskripsi (Opsional)" />
                        <TextArea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full" />
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