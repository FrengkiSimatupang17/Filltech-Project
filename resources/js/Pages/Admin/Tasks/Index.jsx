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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Tugas (Tasks)</h2>}
        >
            <Head title="Manajemen Tugas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            {tasks.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Judul Tugas</th>
                                                <th>Klien</th>
                                                <th>Teknisi</th>
                                                <th>Status</th>
                                                <th>Jenis</th>
                                                <th className="text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.map((task) => (
                                                <tr key={task.id}>
                                                    <td className="font-bold">{task.title}</td>
                                                    <td>{task.client_name || '-'}</td>
                                                    <td>{task.technician_name || <span className="text-gray-400 italic">Belum ada</span>}</td>
                                                    <td>
                                                        <span className={getStatusBadge(task.status)}>
                                                            {task.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="capitalize">{task.type}</td>
                                                    <td className="text-right">
                                                        {task.status === 'pending' && (
                                                            <button onClick={() => openAssignModal(task)} className="btn btn-xs btn-outline btn-primary">
                                                                Tugaskan
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState
                                    title="Tidak Ada Tugas"
                                    message="Belum ada tugas pemasangan atau perbaikan yang masuk."
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={!!showAssignModal} onClose={closeModal}>
                <form onSubmit={submitAssignment} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tugaskan Teknisi
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Pilih teknisi untuk menangani tugas: <span className="font-medium">{data.title}</span>
                    </p>
                    <div className="mt-6">
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
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing || teknisi.length === 0}>
                            Tugaskan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}