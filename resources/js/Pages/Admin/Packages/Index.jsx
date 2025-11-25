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
import Pagination from '@/Components/Pagination'; // Import Komponen Baru

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
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Paket WiFi</h2>
                    <PrimaryButton onClick={openCreateModal}>Tambah Paket Baru</PrimaryButton>
                </div>
            }
        >
            <Head title="Manajemen Paket" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {packages.data.length > 0 ? (
                        <>
                            {/* --- TAMPILAN DESKTOP (TABLE) --- */}
                            <div className="hidden md:block card bg-base-100 shadow-xl">
                                <div className="card-body p-0">
                                    <table className="table table-zebra w-full">
                                        <thead className="bg-base-200 text-base-content">
                                            <tr>
                                                <th className="p-4 rounded-tl-xl">Nama Paket</th>
                                                <th className="p-4">Harga (Rp)</th>
                                                <th className="p-4">Kecepatan</th>
                                                <th className="p-4">Deskripsi</th>
                                                <th className="p-4 text-right rounded-tr-xl">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {packages.data.map((pkg) => (
                                                <tr key={pkg.id} className="hover">
                                                    <td className="font-bold">{pkg.name}</td>
                                                    <td className="font-mono">{parseFloat(pkg.price).toLocaleString('id-ID')}</td>
                                                    <td>
                                                        <span className="badge badge-ghost badge-sm">{pkg.speed}</span>
                                                    </td>
                                                    <td className="max-w-xs truncate text-gray-500">{pkg.description}</td>
                                                    <td className="text-right">
                                                        <button onClick={() => openEditModal(pkg)} className="btn btn-sm btn-ghost text-primary">Edit</button>
                                                        <button onClick={() => openDeleteModal(pkg)} className="btn btn-sm btn-ghost text-error">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* --- TAMPILAN MOBILE (STACKED CARDS) --- */}
                            <div className="md:hidden space-y-4 px-4 sm:px-0">
                                {packages.data.map((pkg) => (
                                    <div key={pkg.id} className="card bg-base-100 shadow-md border border-base-200">
                                        <div className="card-body p-5">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800">{pkg.name}</h3>
                                                    <span className="badge badge-ghost badge-sm mt-1">{pkg.speed}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-primary text-lg">
                                                        Rp {parseFloat(pkg.price).toLocaleString('id-ID')}
                                                    </div>
                                                    <div className="text-xs text-gray-400">/ bulan</div>
                                                </div>
                                            </div>
                                            
                                            <p className="text-sm text-gray-600 mt-3 border-t border-base-200 pt-3">
                                                {pkg.description || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
                                            </p>

                                            <div className="card-actions justify-end mt-4 pt-2 border-t border-base-200">
                                                <button onClick={() => openEditModal(pkg)} className="btn btn-sm btn-outline btn-primary flex-1">Edit</button>
                                                <button onClick={() => openDeleteModal(pkg)} className="btn btn-sm btn-outline btn-error flex-1">Hapus</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Link */}
                            <Pagination links={packages.links} />
                        </>
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

            {/* Modal Create/Edit */}
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
                                <InputLabel htmlFor="price" value="Harga (Rp)" />
                                <TextInput id="price" type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} className="mt-1 block w-full" required />
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

            {/* Modal Delete */}
            <Modal show={!!showDeleteModal} onClose={closeModal}>
                <form onSubmit={submitDelete} className="p-6 text-center">
                    <h2 className="text-lg font-bold text-gray-900">Hapus Paket?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus paket <span className="font-bold">"{data.name}"</span>? <br/>Tindakan ini tidak dapat dibatalkan.
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