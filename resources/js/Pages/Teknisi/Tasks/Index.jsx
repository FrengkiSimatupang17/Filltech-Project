import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaPlay, FaCheck, FaClock } from 'react-icons/fa';

export default function Index({ auth, tasks, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.status || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('teknisi.tasks.index'), { search, status: activeTab }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTabChange = (status) => {
        setActiveTab(status);
        router.get(route('teknisi.tasks.index'), { search, status }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusUpdate = (task, newStatus) => {
        const message = newStatus === 'in_progress' 
            ? 'Mulai kerjakan tugas ini?' 
            : 'Selesaikan tugas ini? Pastikan pekerjaan sudah beres.';
            
        if (confirm(message)) {
            router.patch(route('teknisi.tasks.update', task.id), {
                status: newStatus,
            }, {
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            assigned: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
        };
        
        const labels = {
            assigned: 'Tugas Baru',
            in_progress: 'Sedang Dikerjakan',
            completed: 'Selesai',
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tugas Lapangan</h2>}
        >
            <Head title="Tugas Saya" />

            <div className="py-4 sm:py-6 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                        <TextInput
                            type="text"
                            className="w-full"
                            placeholder="Cari nama klien, alamat, atau judul..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <PrimaryButton className="justify-center px-4">
                            <FaSearch />
                        </PrimaryButton>
                    </form>

                    {/* Tabs Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
                        {[
                            { id: 'all', label: 'Semua' },
                            { id: 'assigned', label: 'Baru' },
                            { id: 'in_progress', label: 'Proses' },
                            { id: 'completed', label: 'Selesai' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Task List */}
                    <div className="space-y-4">
                        {tasks.data.length > 0 ? (
                            tasks.data.map((task) => (
                                <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Card Header */}
                                    <div className="p-4 border-b border-gray-50 flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {getStatusBadge(task.status)}
                                                <span className="text-xs text-gray-400 font-mono">{task.created_at}</span>
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-lg">{task.title}</h3>
                                            <p className="text-sm text-gray-500 capitalize">{task.type}</p>
                                        </div>
                                    </div>

                                    {/* Card Body: Client Info */}
                                    <div className="p-4 bg-gray-50/50 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-white p-2 rounded-full text-blue-600 shadow-sm">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase">Alamat Klien</p>
                                                <p className="text-sm text-gray-800 font-medium">{task.client_address}</p>
                                                <p className="text-xs text-gray-600">{task.client_name}</p>
                                            </div>
                                        </div>
                                        
                                        {task.client_phone && (
                                            <div className="flex items-center gap-3">
                                                <a href={`tel:${task.client_phone}`} className="bg-white p-2 rounded-full text-green-600 shadow-sm">
                                                    <FaPhone />
                                                </a>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase">Kontak</p>
                                                    <a href={`tel:${task.client_phone}`} className="text-sm text-blue-600 font-medium hover:underline">
                                                        {task.client_phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {task.description && (
                                            <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-gray-700">
                                                <span className="font-bold block text-xs text-yellow-700 mb-1">Catatan:</span>
                                                {task.description}
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Actions */}
                                    {task.status !== 'completed' && (
                                        <div className="p-4 border-t border-gray-100">
                                            {task.status === 'assigned' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(task, 'in_progress')}
                                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <FaPlay className="text-xs" /> Mulai Kerjakan
                                                </button>
                                            )}
                                            {task.status === 'in_progress' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(task, 'completed')}
                                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <FaCheck /> Selesaikan Tugas
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <EmptyState
                                title="Tidak Ada Tugas"
                                message="Saat ini belum ada tugas yang sesuai dengan filter Anda."
                            />
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination links={tasks.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}