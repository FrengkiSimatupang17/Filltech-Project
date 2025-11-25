import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

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
            case 'assigned': return 'badge badge-info text-white font-bold border-none';
            case 'in_progress': return 'badge badge-primary text-white font-bold border-none';
            case 'completed': return 'badge badge-success text-white font-bold border-none';
            default: return 'badge badge-ghost';
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
                    <div className="space-y-6">
                        {tasks.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                                <p className="text-gray-500">Tidak ada tugas yang ditugaskan kepada Anda saat ini.</p>
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <div key={task.id} className="card bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="card-body p-6">
                                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={getStatusClass(task.status)}>
                                                        {task.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-mono">#{task.id}</span>
                                                </div>
                                                
                                                <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                                                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{task.description}</p>
                                                
                                                <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 p-3 rounded-lg">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Detail Klien</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-400 block text-xs">Nama</span>
                                                            <span className="font-medium text-gray-800">{task.client_name}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400 block text-xs">Telepon</span>
                                                            <span className="font-medium text-gray-800">{task.client_phone || '-'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400 block text-xs">Alamat</span>
                                                            <span className="font-medium text-gray-800">{task.client_address || '-'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-shrink-0 flex flex-col gap-3 min-w-[160px] md:border-l md:pl-4 md:border-gray-100">
                                                <div className="text-xs text-gray-400 uppercase font-bold text-center md:text-left mb-1">Aksi</div>
                                                
                                                {task.status === 'assigned' && (
                                                    <PrimaryButton onClick={() => handleStatusUpdate(task, 'in_progress')} className="w-full justify-center">
                                                        Mulai Kerjakan
                                                    </PrimaryButton>
                                                )}
                                                
                                                {task.status === 'in_progress' && (
                                                    // PERBAIKAN UTAMA:
                                                    // Menggunakan kelas Tailwind manual (bg-green-600) dan border-none
                                                    // untuk memastikan tombol solid dan terlihat jelas.
                                                    <button 
                                                        onClick={() => handleStatusUpdate(task, 'completed')} 
                                                        className="btn btn-sm bg-green-600 hover:bg-green-700 text-white w-full border-none shadow-sm font-bold tracking-wide"
                                                    >
                                                        Selesaikan Tugas
                                                    </button>
                                                )}
                                                
                                                {task.status === 'completed' && (
                                                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold p-2 bg-green-50 rounded-lg border border-green-200 w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Selesai</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}