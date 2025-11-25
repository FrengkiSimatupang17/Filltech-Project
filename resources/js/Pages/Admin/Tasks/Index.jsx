import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, tasks, teknisi }) {
    const [showAssignModal, setShowAssignModal] = useState(null);
    const { data, setData, patch, processing, errors, reset } = useForm({
        task_id: '',
        title: '',
        technician_user_id: '',
    });

    const openAssignModal = (task) => {
        setData({
            task_id: task.id,
            title: task.title,
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'badge badge-warning';
            case 'assigned': return 'badge badge-info text-white';
            case 'in_progress': return 'badge badge-primary text-white';
            case 'completed': return 'badge badge-success text-white';
            case 'cancelled': return 'badge badge-error text-white';
            default: return 'badge badge-ghost';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Tugas</h2>}
        >
            <Head title="Manajemen Tugas" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {tasks.data.length > 0 ? (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block card bg-base-100 shadow-xl">
                                <div className="card-body p-0">
                                    <table className="table table-zebra w-full">
                                        <thead className="bg-base-200 text-base-content">
                                            <tr>
                                                <th className="p-4 rounded-tl-xl">Judul</th>
                                                <th className="p-4">Klien</th>
                                                <th className="p-4">Teknisi</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 text-right rounded-tr-xl">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.data.map((task) => (
                                                <tr key={task.id}>
                                                    <td className="font-bold">
                                                        {task.title}
                                                        <div className="text-xs font-normal opacity-60 capitalize">{task.type}</div>
                                                    </td>
                                                    <td>{task.client_name || '-'}</td>
                                                    <td>{task.technician_name || <span className="text-gray-400 italic">Belum ada</span>}</td>
                                                    <td>
                                                        <span className={getStatusBadge(task.status)}>
                                                            {task.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="text-right">
                                                        {task.status === 'pending' && (
                                                            <button onClick={() => openAssignModal(task)} className="btn btn-xs btn-primary">
                                                                Tugaskan
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-4 px-4 sm:px-0">
                                {tasks.data.map((task) => (
                                    <div key={task.id} className="card bg-base-100 shadow-md border border-base-200">
                                        <div className="card-body p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-gray-800">{task.title}</h3>
                                                <span className={getStatusBadge(task.status)}>{task.status.replace('_', ' ')}</span>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 space-y-1 border-t border-base-200 pt-2">
                                                <p className="flex justify-between">
                                                    <span className="text-gray-400">Klien:</span>
                                                    <span>{task.client_name || '-'}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-gray-400">Teknisi:</span>
                                                    <span>{task.technician_name || 'Belum ada'}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-gray-400">Tipe:</span>
                                                    <span className="capitalize">{task.type}</span>
                                                </p>
                                            </div>

                                            {task.status === 'pending' && (
                                                <div className="mt-4">
                                                    <button onClick={() => openAssignModal(task)} className="btn btn-sm btn-primary w-full">
                                                        Tugaskan Teknisi
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination links={tasks.links} />
                        </>
                    ) : (
                        <EmptyState
                            title="Tidak Ada Tugas"
                            message="Belum ada tugas pemasangan atau perbaikan yang masuk."
                        />
                    )}
                </div>
            </div>

            <Modal show={!!showAssignModal} onClose={closeModal}>
                <form onSubmit={submitAssignment} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        Tugaskan Teknisi
                    </h2>
                    <div className="mb-4">
                        <InputLabel htmlFor="technician_user_id" value="Pilih Teknisi" />
                        <SelectInput
                            id="technician_user_id"
                            className="mt-1 block w-full"
                            value={data.technician_user_id}
                            onChange={(e) => setData('technician_user_id', e.target.value)}
                            required
                        >
                            {teknisi.length === 0 ? (
                                <option value="">Tidak ada teknisi tersedia</option>
                            ) : (
                                teknisi.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))
                            )}
                        </SelectInput>
                        <InputError message={errors.technician_user_id} className="mt-2" />
                    </div>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing || teknisi.length === 0}>
                            Simpan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}