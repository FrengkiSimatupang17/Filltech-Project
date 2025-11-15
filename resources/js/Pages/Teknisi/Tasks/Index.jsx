import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, tasks }) {

    const handleStatusUpdate = (task, newStatus) => {
        if (confirm(`Anda yakin ingin mengubah status tugas ini menjadi "${newStatus}"?`)) {
            router.patch(route('teknisi.tasks.update', task.id), {
                status: newStatus,
            }, {
                preserveScroll: true,
            });
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'assigned': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-indigo-100 text-indigo-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Tugas Saya</h2>}
        >
            <Head title="Tugas Saya" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-6">
                            {tasks.length === 0 ? (
                                <p>Tidak ada tugas yang ditugaskan kepada Anda saat ini.</p>
                            ) : (
                                tasks.map((task) => (
                                    <div key={task.id} className="p-4 border rounded-lg">
                                        <div className="flex flex-col md:flex-row justify-between md:items-start">
                                            <div className="flex-1">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
                                                    {task.status}
                                                </span>
                                                <h3 className="text-lg font-medium text-gray-900 mt-2">{task.title}</h3>
                                                <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                                                
                                                <div className="mt-4 border-t pt-4">
                                                    <h4 className="text-sm font-medium text-gray-700">Detail Klien</h4>
                                                    <p className="text-sm text-gray-600">Nama: {task.client_name}</p>
                                                    <p className="text-sm text-gray-600">Alamat: {task.client_address}</p>
                                                    <p className="text-sm text-gray-600">Telepon: {task.client_phone}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6">
                                                {task.status === 'assigned' && (
                                                    <PrimaryButton onClick={() => handleStatusUpdate(task, 'in_progress')} className="w-full justify-center">
                                                        Mulai Kerjakan
                                                    </PrimaryButton>
                                                )}
                                                {task.status === 'in_progress' && (
                                                    <SecondaryButton onClick={() => handleStatusUpdate(task, 'completed')} className="w-full justify-center bg-green-600 text-white hover:bg-green-700">
                                                        Selesaikan Tugas
                                                    </SecondaryButton>
                                                )}
                                                {task.status === 'completed' && (
                                                    <p className="text-sm font-medium text-green-700">Tugas Selesai</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}