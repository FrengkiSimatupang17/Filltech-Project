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
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import TableSearch from '@/Components/TableSearch';
import StatusBadge from '@/Components/StatusBadge';
import { FaPlus, FaEdit, FaTrash, FaTools } from 'react-icons/fa';

export default function Index({ auth, equipment, filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '', name: '', serial_number: '', status: 'available',
    });

    const openCreateModal = () => { reset(); setData('status', 'available'); setShowCreateModal(true); };
    const openEditModal = (item) => { setData(item); setShowEditModal(item.id); };
    const openDeleteModal = (item) => { setData({ id: item.id, name: item.name }); setShowDeleteModal(item.id); };
    const closeModal = () => { setShowCreateModal(false); setShowEditModal(null); setShowDeleteModal(null); reset(); };

    const submitCreate = (e) => { e.preventDefault(); post(route('admin.equipment.store'), { onSuccess: () => closeModal() }); };
    const submitEdit = (e) => { e.preventDefault(); patch(route('admin.equipment.update', data.id), { onSuccess: () => closeModal() }); };
    const submitDelete = (e) => { e.preventDefault(); destroy(route('admin.equipment.destroy', data.id), { onSuccess: () => closeModal() }); };

    const equipmentData = equipment.data || [];
    const statusOptions = [{ value: 'available', label: 'Tersedia' }, { value: 'in_use', label: 'Dipakai' }, { value: 'maintenance', label: 'Perawatan' }];

    return (
        <AuthenticatedLayout user={auth.user} header={<div className="flex justify-between items-center"><h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Perlengkapan</h2><PrimaryButton onClick={openCreateModal}><FaPlus className="mr-2" /> Tambah Alat Baru</PrimaryButton></div>}>
            <Head title="Manajemen Alat" />
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex mb-6"><TableSearch url={route('admin.equipment.index')} initialValue={filters.search} placeholder="Cari nama atau serial number..." /></div>

                    {equipmentData.length > 0 ? (
                        <>
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
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
                                            {equipmentData.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.serial_number || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><FaEdit size={18} /></button>
                                                        <button onClick={() => openDeleteModal(item)} className="text-red-600 hover:text-red-900"><FaTrash size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="md:hidden space-y-4 px-4 sm:px-0">
                                {equipmentData.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                        <div className="flex justify-between items-start mb-3 border-b pb-2">
                                            <div><h3 className="font-bold text-lg text-gray-800">{item.name}</h3><p className="text-xs text-gray-500 font-mono">{item.serial_number || 'N/A'}</p></div>
                                            <StatusBadge status={item.status} />
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-100">
                                            <SecondaryButton onClick={() => openEditModal(item)} className="text-xs h-8">Edit</SecondaryButton>
                                            <DangerButton onClick={() => openDeleteModal(item)} className="text-xs h-8">Hapus</DangerButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6"><Pagination links={equipment.links} /></div>
                        </>
                    ) : (
                        <EmptyState title="Belum Ada Perlengkapan" message="Tambahkan alat kantor baru untuk inventaris." />
                    )}
                </div>
            </div>

            <Modal show={showCreateModal || !!showEditModal} onClose={closeModal}>
                <form onSubmit={showCreateModal ? submitCreate : submitEdit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaTools className="text-blue-500" /> {showCreateModal ? 'Tambah Alat Baru' : 'Edit Alat'}</h2>
                    <div className="space-y-4">
                        <div><InputLabel htmlFor="name" value="Nama Alat" /><TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full" required /><InputError message={errors.name} className="mt-1" /></div>
                        <div><InputLabel htmlFor="serial_number" value="Serial Number (Opsional)" /><TextInput id="serial_number" value={data.serial_number} onChange={(e) => setData('serial_number', e.target.value)} className="mt-1 block w-full" /><InputError message={errors.serial_number} className="mt-1" /></div>
                        <div><InputLabel htmlFor="status" value="Status" /><SelectInput id="status" className="mt-1 block w-full" value={data.status} onChange={(e) => setData('status', e.target.value)} required>{statusOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}</SelectInput><InputError message={errors.status} className="mt-1" /></div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3"><SecondaryButton onClick={closeModal}>Batal</SecondaryButton><PrimaryButton disabled={processing}>{showCreateModal ? 'Simpan' : 'Simpan Perubahan'}</PrimaryButton></div>
                </form>
            </Modal>

            <Modal show={!!showDeleteModal} onClose={closeModal}>
                <form onSubmit={submitDelete} className="p-6 text-center">
                    <h2 className="text-lg font-bold text-gray-900">Hapus Perlengkapan?</h2>
                    <p className="mt-2 text-sm text-gray-600">Apakah Anda yakin ingin menghapus alat <span className="font-bold">"{data.name}"</span>?</p>
                    <div className="mt-6 flex justify-center gap-3"><SecondaryButton onClick={closeModal}>Batal</SecondaryButton><DangerButton disabled={processing}>Ya, Hapus</DangerButton></div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}