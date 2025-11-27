import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import UserFormFields from '@/Components/UserFormFields';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function ClientIndex({ auth, users, filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

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

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.clients.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Klien</h2>}
        >
            <Head title="Manajemen Klien" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <form onSubmit={handleSearch} className="w-full md:w-1/3 flex">
                            <TextInput
                                type="text"
                                className="w-full rounded-r-none"
                                placeholder="Cari nama, email, atau ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <PrimaryButton className="rounded-l-none justify-center">
                                <FaSearch />
                            </PrimaryButton>
                        </form>
                        <PrimaryButton onClick={openCreateModal} className="w-full md:w-auto justify-center">
                            <FaPlus className="mr-2" /> Tambah Klien
                        </PrimaryButton>
                    </div>

                    {users.data.length > 0 ? (
                        <>
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Unik</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.id_unik ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {user.id_unik || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {user.phone_number || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-900 mr-4">
                                                        <FaEdit size={18} />
                                                    </button>
                                                    <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-900">
                                                        <FaTrash size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden space-y-4">
                                {users.data.map((user) => (
                                    <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.id_unik ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {user.id_unik || 'Pending'}
                                            </span>
                                        </div>
                                        
                                        <div className="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2 grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-xs text-gray-400 block">Telepon</span>
                                                {user.phone_number || '-'}
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 block">Alamat</span>
                                                {user.blok ? `Blok ${user.blok} No.${user.nomor_rumah}` : '-'}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-100">
                                            <SecondaryButton onClick={() => openEditModal(user)} className="text-xs h-8">
                                                Edit
                                            </SecondaryButton>
                                            <DangerButton onClick={() => openDeleteModal(user)} className="text-xs h-8">
                                                Hapus
                                            </DangerButton>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <Pagination links={users.links} />
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            title="Data Tidak Ditemukan"
                            message={search ? `Tidak ada klien dengan kata kunci "${search}"` : "Belum ada data klien."}
                        />
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
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
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