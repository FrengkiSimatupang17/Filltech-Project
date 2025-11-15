import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

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
        setShowAssignModal(true);
    };

    const closeModal = () => {
        setShowAssignModal(false);
        reset();
    };

    const submitAssignment = (e) => {
        e.preventDefault();
        patch(route('admin.tasks.update', data.task_id), {
            onSuccess: () => closeModal(),
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'assigned': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-indigo-100 text-indigo-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Tugas</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teknisi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tasks.map((task) => (
                                        <tr key={task.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.client_name || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.technician_name || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{task.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {task.status === 'pending' && (
                                                    <button onClick={() => openAssignModal(task)} className="text-indigo-600 hover:text-indigo-900">
                                                        Tugaskan
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {tasks.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                Tidak ada tugas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showAssignModal} onClose={closeModal}>
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