import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import UserFormFields from '@/Components/UserFormFields';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, users }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        email: '',
        role: 'client',
        id_unik: '',
        phone_number: '',
        rt: '',
        rw: '',
        blok: '',
        nomor_rumah: '',
        password: '',
        password_confirmation: '',
    });

    const openCreateModal = () => {
        reset();
        setData('role', 'client');
        setShowCreateModal(true);
    };

    const openEditModal = (user) => {
        setData({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            id_unik: user.id_unik || '',
            phone_number: user.phone_number || '',
            rt: user.rt || '',
            rw: user.rw || '',
            blok: user.blok || '',
            nomor_rumah: user.nomor_rumah || '',
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
        post(route('admin.clients.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        patch(route('admin.clients.update', data.id), {
            onSuccess: () => closeModal(),
        });
    };

    const submitDelete = (e) => {
        e.preventDefault();
        destroy(route('admin.clients.destroy', data.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Klien</h2>
                    <PrimaryButton onClick={openCreateModal}>Tambah Klien Baru</PrimaryButton>
                </div>
            }
        >
            <Head title="Manajemen Klien" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {users.data.length > 0 ? (
                        <>
                            <div className="hidden md:block card bg-base-100 shadow-xl">
                                <div className="card-body p-0">
                                    <table className="table table-zebra w-full">
                                        <thead className="bg-base-200 text-base-content">
                                            <tr>
                                                <th className="p-4 rounded-tl-xl">Nama</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">ID Unik</th>
                                                <th className="p-4 text-right rounded-tr-xl">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.data.map((user) => (
                                                <tr key={user.id} className="hover">
                                                    <td className="font-bold">{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={user.id_unik ? 'badge badge-success text-white' : 'badge badge-warning'}>
                                                            {user.id_unik || 'BELUM LENGKAP'}
                                                        </span>
                                                    </td>
                                                    <td className="text-right">
                                                        <button onClick={() => openEditModal(user)} className="btn btn-sm btn-ghost text-primary">Edit</button>
                                                        <button onClick={() => openDeleteModal(user)} className="btn btn-sm btn-ghost text-error">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="md:hidden space-y-4 px-4 sm:px-0">
                                {users.data.map((user) => (
                                    <div key={user.id} className="card bg-base-100 shadow-md border border-base-200">
                                        <div className="card-body p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                                <span className={user.id_unik ? 'badge badge-sm badge-success text-white' : 'badge badge-sm badge-warning'}>
                                                    {user.id_unik ? 'LENGKAP' : 'PENDING'}
                                                </span>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 mt-2 border-t border-base-200 pt-2">
                                                <span className="text-gray-400 text-xs uppercase font-bold">ID Unik:</span>
                                                <div className="font-mono text-base">{user.id_unik || '-'}</div>
                                            </div>

                                            <div className="card-actions justify-end mt-4 pt-2 border-t border-base-200">
                                                <button onClick={() => openEditModal(user)} className="btn btn-sm btn-outline btn-primary flex-1">Edit</button>
                                                <button onClick={() => openDeleteModal(user)} className="btn btn-sm btn-outline btn-error flex-1">Hapus</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination links={users.links} />
                        </>
                    ) : (
                        <EmptyState
                            title="Belum Ada Klien"
                            message="Tambahkan klien baru untuk memulai."
                        >
                            <PrimaryButton onClick={openCreateModal}>Tambah Klien Baru</PrimaryButton>
                        </EmptyState>
                    )}
                </div>
            </div>

            <Modal show={showCreateModal} onClose={closeModal}>
                <form onSubmit={submitCreate} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Klien Baru</h2>
                    <UserFormFields data={data} setData={setData} errors={errors} isCreate={true} roleContext="client" />
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={!!showEditModal} onClose={closeModal}>
                <form onSubmit={submitEdit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Klien: {data.name}</h2>
                    <UserFormFields data={data} setData={setData} errors={errors} isCreate={false} roleContext="client" />
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={!!showDeleteModal} onClose={closeModal}>
                <form onSubmit={submitDelete} className="p-6 text-center">
                    <h2 className="text-lg font-bold text-gray-900">Hapus Klien?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus klien <span className="font-bold">"{data.name}"</span>? <br/>Data ini tidak dapat dikembalikan.
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