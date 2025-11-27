import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const TechnicianFormFields = ({ data, setData, errors, isCreate }) => {
    return (
        <div className="space-y-4">
            <div>
                <InputLabel htmlFor="name" value="Nama" />
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                <InputError message={errors.name} />
            </div>
            <div>
                <InputLabel htmlFor="id_unik" value="ID Teknisi" />
                <TextInput
                    id="id_unik"
                    value={data.id_unik}
                    onChange={(e) => setData('id_unik', e.target.value)}
                    required
                />
                <InputError message={errors.id_unik} />
            </div>
            <div>
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />
                <InputError message={errors.email} />
            </div>
            <div>
                <InputLabel htmlFor="phone_number" value="Nomor HP" />
                <TextInput
                    id="phone_number"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                />
                <InputError message={errors.phone_number} />
            </div>
            {!isCreate && <p className="text-sm text-gray-500 pt-2 border-t mt-4">Kosongkan kolom password jika tidak ingin mengubahnya.</p>}
            <div>
                <InputLabel htmlFor="password" value="Password" />
                <TextInput
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} />
            </div>
            <div>
                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                <TextInput
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />
                <InputError message={errors.password_confirmation} />
            </div>
        </div>
    );
};


export default function TechnicianIndex({ auth, users, filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        email: '',
        role: 'teknisi',
        id_unik: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.technicians.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openCreateModal = () => {
        reset();
        setData('role', 'teknisi');
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Teknisi</h2>}
        >
            <Head title="Manajemen Teknisi" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <form onSubmit={handleSearch} className="w-full md:w-1/3 flex">
                            <TextInput
                                type="text"
                                className="w-full rounded-r-none"
                                placeholder="Cari nama, email, atau ID teknisi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <PrimaryButton className="rounded-l-none justify-center">
                                <FaSearch />
                            </PrimaryButton>
                        </form>
                        <PrimaryButton onClick={openCreateModal} className="w-full md:w-auto justify-center">
                            <FaPlus className="mr-2" /> Tambah Teknisi
                        </PrimaryButton>
                    </div>

                    {users.data.length > 0 ? (
                        <>
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Teknisi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bergabung Sejak</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                                    {user.id_unik}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.created_at}
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
                                                <p className="text-xs text-blue-600 font-mono font-semibold">{user.id_unik}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">{user.created_at}</span>
                                        </div>
                                        
                                        <div className="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2 grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-xs text-gray-400 block">Email</span>
                                                {user.email}
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 block">HP</span>
                                                {user.phone_number || '-'}
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
                            message={search ? `Tidak ada teknisi dengan kata kunci "${search}"` : "Belum ada data teknisi."}
                        />
                    )}
                </div>
            </div>

            <Modal show={showCreateModal} onClose={closeModal}>
                <form onSubmit={submitCreate} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Teknisi Baru</h2>
                    <TechnicianFormFields data={data} setData={setData} errors={errors} isCreate={true} />
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={!!showEditModal} onClose={closeModal}>
                <form onSubmit={submitEdit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Teknisi: {data.name}</h2>
                    <TechnicianFormFields data={data} setData={setData} errors={errors} isCreate={false} />
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={!!showDeleteModal} onClose={closeModal}>
                <form onSubmit={submitDelete} className="p-6 text-center">
                    <h2 className="text-lg font-bold text-gray-900">Hapus Teknisi?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus teknisi <span className="font-bold">"{data.name}"</span>?
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