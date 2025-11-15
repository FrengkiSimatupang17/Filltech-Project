import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';

export default function Index({ auth, complaints }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
    });

    const openCreateModal = () => {
        reset();
        setShowCreateModal(true);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        reset();
    };

    const submitComplaint = (e) => {
        e.preventDefault();
        post(route('client.complaints.store'), {
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
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Aduan & Kendala</h2>
                    <PrimaryButton onClick={openCreateModal}>Buat Aduan Baru</PrimaryButton>
                </div>
            }
        >
            <Head title="Aduan Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium">Riwayat Aduan Saya</h3>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul Aduan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teknisi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Dibuat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {complaints.data.length === 0 && (
                                            <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Belum ada aduan.</td></tr>
                                        )}
                                        {complaints.data.map((task) => (
                                            <tr key={task.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.technician_user?.name || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(task.created_at).toLocaleDateString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showCreateModal} onClose={closeModal}>
                <form onSubmit={submitComplaint} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Buat Aduan Baru
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Jelaskan kendala yang Anda alami. Aduan akan otomatis masuk ke antrian teknisi.
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor="title" value="Judul Aduan" />
                        <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1 block w-full" required />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Deskripsi (Opsional)" />
                        <TextArea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full" />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            Kirim Aduan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}