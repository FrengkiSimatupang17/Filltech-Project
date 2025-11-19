import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import UserFormFields from '@/Components/UserFormFields';
import EmptyState from '@/Components/EmptyState';

export default function Index({ auth, users }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
    });

    const openCreateModal = () => {
        reset();
        setShowCreateModal(true);
    };

    const openEditModal = (user) => {
        setData({
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number || '',
            password: '',
            password_confirmation: '',
        });
        setShowEditModal(user.id);
    };
    
    const openDeleteModal = (user) => {
        setData({ id: user.id, name: user.name });
        setShowDeleteModal(user.id);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setShowEditModal(null);
        setShowDeleteModal(null);
        reset();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('admin.technicians.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        patch(route('admin.technicians.update', data.id), {
            onSuccess: () => closeModal(),
        });
    };

    const submitDelete = (e) => {
        e.preventDefault();
        destroy(route('admin.technicians.destroy', data.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Teknisi</h2>
                    <PrimaryButton onClick={openCreateModal}>Tambah Teknisi Baru</PrimaryButton>
                </div>
            }
        >
            <Head title="Manajemen Teknisi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            {users.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Nama</th>
                                                <th>Email</th>
                                                <th>No. Telepon</th>
                                                <th className="text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="font-bold">{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone_number || '-'}</td>
                                                    <td className="text-right">
                                                        <button onClick={() => openEditModal(user)} className="link link-primary text-sm mr-4">Edit</button>
                                                        <button onClick={() => openDeleteModal(user)} className="link link-error text-sm">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState
                                    title="Belum Ada Teknisi"
                                    message="Tambahkan teknisi baru untuk mengalokasikan tugas."
                                >
                                    <PrimaryButton onClick={openCreateModal}>Tambah Teknisi Baru</PrimaryButton>
                                </EmptyState>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showCreateModal} onClose={closeModal}>
                <form onSubmit={submitCreate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Tambah Teknisi Baru</h2>
                    <UserFormFields data={data} setData={setData} errors={errors} isCreate={true} roleContext="technician" />
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={!!showEditModal} onClose={closeModal}>
                <form onSubmit={submitEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Edit Teknisi: {data.name}</h2>
                    <UserFormFields data={data} setData={setData} errors={errors} isCreate={false} roleContext="technician" />
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Simpan Perubahan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={!!showDeleteModal} onClose={closeModal}>
                <form onSubmit={submitDelete} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Hapus Teknisi</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus teknisi "{data.name}"? Data ini tidak dapat dikembalikan.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton className="ml-3" disabled={processing}>Hapus Teknisi</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}