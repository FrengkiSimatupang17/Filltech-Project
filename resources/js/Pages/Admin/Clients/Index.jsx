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
import SelectInput from '@/Components/SelectInput';

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
        address_detail: '',
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
            role: user.role,
            id_unik: user.id_unik || '',
            address_detail: user.address_detail || '',
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

    const UserFormFields = ({ isCreate = false }) => (
        <>
            <div className="mt-4">
                <InputLabel htmlFor="name" value="Nama" />
                <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full" required />
                <InputError message={errors.name} className="mt-2" />
            </div>
            
            <div className="mt-4">
                <InputLabel htmlFor="email" value="Email" />
                <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full" required />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="role" value="Role" />
                <SelectInput id="role" value={data.role} className="mt-1 block w-full" onChange={(e) => setData('role', e.target.value)}>
                    <option value="client">Client</option>
                    <option value="teknisi">Teknisi</option>
                    <option value="administrator">Administrator</option>
                </SelectInput>
                <InputError message={errors.role} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password" value={isCreate ? "Password" : "Password Baru (Opsional)"} />
                <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="mt-1 block w-full" />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                <TextInput id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="mt-1 block w-full" />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <h3 className="text-md font-medium text-gray-800 mt-6">Data Opsional</h3>

            <div className="mt-4">
                <InputLabel htmlFor="id_unik" value="ID Unik" />
                <TextInput id="id_unik" value={data.id_unik} onChange={(e) => setData('id_unik', e.target.value)} className="mt-1 block w-full" />
                <InputError message={errors.id_unik} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="phone_number" value="No. Telepon" />
                <TextInput id="phone_number" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} className="mt-1 block w-full" />
                <InputError message={errors.phone_number} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="address_detail" value="Detail Alamat" />
                <TextInput id="address_detail" value={data.address_detail} onChange={(e) => setData('address_detail', e.target.value)} className="mt-1 block w-full" />
                <InputError message={errors.address_detail} className="mt-2" />
            </div>
        </>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Klien & User</h2>
                    <PrimaryButton onClick={openCreateModal}>Tambah User Baru</PrimaryButton>
                </div>
            }
        >
            <Head title="Manajemen Klien" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Unik</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.role === 'administrator' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'teknisi' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.id_unik || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                                <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create */}
            <Modal show={showCreateModal} onClose={closeModal}>
                <form onSubmit={submitCreate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Tambah User Baru</h2>
                    <UserFormFields isCreate={true} />
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit */}
            <Modal show={!!showEditModal} onClose={closeModal}>
                <form onSubmit={submitEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Edit User: {data.name}</h2>
                    <UserFormFields isCreate={false} />
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Simpan Perubahan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Delete */}
            <Modal show={!!showDeleteModal} onClose={closeModal}>
                <form onSubmit={submitDelete} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Hapus User</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus user "{data.name}"? Data ini tidak dapat dikembalikan.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton className="ml-3" disabled={processing}>Hapus User</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}