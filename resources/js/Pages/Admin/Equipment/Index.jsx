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

export default function Index({ auth, equipment }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        serial_number: '',
        status: 'available',
    });

    const openCreateModal = () => {
        reset();
        setData('status', 'available');
        setShowCreateModal(true);
    };

    const openEditModal = (item) => {
        setData({
            id: item.id,
            name: item.name,
            serial_number: item.serial_number || '',
            status: item.status,
        });
        setShowEditModal(item.id);
    };

    const openDeleteModal = (item) => {
        setData({ id: item.id, name: item.name });
        setShowDeleteModal(item.id);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setShowEditModal(null);
        setShowDeleteModal(null);
        reset();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('admin.equipment.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        patch(route('admin.equipment.update', data.id), {
            onSuccess: () => closeModal(),
        });
    };

    const submitDelete = (e) => {
        e.preventDefault();
        destroy(route('admin.equipment.destroy', data.id), {
            onSuccess: () => closeModal(),
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'in_use': return 'bg-yellow-100 text-yellow-800';
            case 'maintenance': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const statusOptions = [
        { value: 'available', label: 'Tersedia' },
        { value: 'in_use', label: 'Dipakai' },
        { value: 'maintenance', label: 'Perawatan' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Alat Kantor</h2>
                    <PrimaryButton onClick={openCreateModal}>Tambah Alat Baru</PrimaryButton>
                </div>
            }
        >
            <Head title="Manajemen Alat" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Alat</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {equipment.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.serial_number || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                                                    {statusOptions.find(s => s.value === item.status)?.label || item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                                <button onClick={() => openDeleteModal(item)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showCreateModal || !!showEditModal} onClose={closeModal}>
                <form onSubmit={showCreateModal ? submitCreate : submitEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {showCreateModal ? 'Tambah Alat Baru' : 'Edit Alat'}
                    </h2>
                    <div className="mt-6">
                        <InputLabel htmlFor="name" value="Nama Alat" />
                        <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full" required />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="serial_number" value="Serial Number (Opsional)" />
                        <TextInput id="serial_number" value={data.serial_number} onChange={(e) => setData('serial_number', e.target.value)} className="mt-1 block w-full" />
                        <InputError message={errors.serial_number} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="status" value="Status" />
                        <SelectInput id="status" className="mt-1 block w-full" value={data.status} onChange={(e) => setData('status', e.target.value)} required>
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.status} className="mt-2" />
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
                    <h2 className="text-lg font-medium text-gray-900">Hapus Alat</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus alat "{data.name}"? Aksi ini tidak dapat dibatalkan.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton className="ml-3" disabled={processing}>
                            Hapus Alat
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}