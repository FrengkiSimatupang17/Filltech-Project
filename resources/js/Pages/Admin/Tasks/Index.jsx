import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import TableSearch from '@/Components/TableSearch';
import StatusBadge from '@/Components/StatusBadge';

export default function TaskIndex({ auth, tasks, teknisi, filters }) {
    const [showAssignModal, setShowAssignModal] = useState(null);
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const { data, setData, patch, processing, errors, reset } = useForm({
        task_id: '',
        technician_user_id: '',
    });

    const handleFilterChange = (status) => {
        setStatusFilter(status);
        router.get(route('admin.tasks.index'), { search: filters.search, status }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openAssignModal = (task) => {
        setData({
            task_id: task.id,
            technician_user_id: teknisi.length > 0 ? teknisi[0].id : '',
        });
        setShowAssignModal(task.id);
    };

    const closeModal = () => {
        setShowAssignModal(null);
        reset();
    };

    const submitAssignment = (e) => {
        e.preventDefault();
        patch(route('admin.tasks.update', data.task_id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Tugas</h2>}>
            <Head title="Manajemen Tugas" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {['all', 'pending', 'assigned', 'completed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleFilterChange(status)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                                        statusFilter === status ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                        <TableSearch url={route('admin.tasks.index')} initialValue={filters.search} filters={{ status: statusFilter }} placeholder="Cari judul atau klien..." />
                    </div>

                    {tasks.data.length > 0 ? (
                        <>
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teknisi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tasks.data.map((task) => (
                                            <tr key={task.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4"><div className="text-sm font-bold text-gray-900">{task.title}</div><div className="text-xs text-gray-500 capitalize">{task.type}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.client_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.technician_name || <span className="italic text-gray-400">Belum ditugaskan</span>}</td>
                                                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={task.status} /></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">{task.status === 'pending' && (<PrimaryButton onClick={() => openAssignModal(task)} className="text-xs h-8">Tugaskan</PrimaryButton>)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="md:hidden space-y-4">
                                {tasks.data.map((task) => (
                                    <div key={task.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                        <div className="flex justify-between items-start mb-3 border-b pb-2">
                                            <div><h3 className="font-bold text-gray-800">{task.title}</h3><span className="text-xs text-gray-500 capitalize">{task.type}</span></div>
                                            <StatusBadge status={task.status} />
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div className="flex justify-between"><span className="text-gray-400">Klien:</span><span>{task.client_name}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-400">Teknisi:</span><span>{task.technician_name || '-'}</span></div>
                                        </div>
                                        {task.status === 'pending' && (<div className="mt-4 pt-2 border-t border-gray-100"><PrimaryButton onClick={() => openAssignModal(task)} className="w-full justify-center">Tugaskan Teknisi</PrimaryButton></div>)}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6"><Pagination links={tasks.links} /></div>
                        </>
                    ) : (
                        <EmptyState title="Belum Ada Tugas" message="Tidak ada tugas yang sesuai dengan filter pencarian Anda." />
                    )}
                </div>
            </div>

            <Modal show={!!showAssignModal} onClose={closeModal}>
                <form onSubmit={submitAssignment} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Pilih Teknisi</h2>
                    <div className="mb-6">
                        <InputLabel htmlFor="technician" value="Daftar Teknisi Tersedia" />
                        <SelectInput id="technician" className="mt-1 block w-full" value={data.technician_user_id} onChange={(e) => setData('technician_user_id', e.target.value)} required>
                            {teknisi.length === 0 ? (<option value="">Tidak ada teknisi tersedia</option>) : (teknisi.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>)))}
                        </SelectInput>
                        <InputError message={errors.technician_user_id} className="mt-2" />
                    </div>
                    <div className="flex justify-end gap-3"><SecondaryButton onClick={closeModal}>Batal</SecondaryButton><PrimaryButton disabled={processing || teknisi.length === 0}>Simpan Penugasan</PrimaryButton></div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}