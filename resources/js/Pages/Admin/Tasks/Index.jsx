import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { 
    MagnifyingGlassIcon, UserIcon, BriefcaseIcon, 
    MapPinIcon, FunnelIcon, PencilSquareIcon,
    PhotoIcon // Tambahan Icon Foto
} from '@heroicons/react/24/outline';

export default function Index({ auth, tasks, technicians, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [editingTask, setEditingTask] = useState(null);
    const [form, setForm] = useState({ technician_user_id: '', status: '' });

    // --- STYLE INPUT ---
    const inputClass = "w-full border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 shadow-sm";

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.tasks.index'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleStatusChange = (val) => {
        setStatusFilter(val);
        router.get(route('admin.tasks.index'), { search, status: val }, { preserveState: true });
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setForm({ technician_user_id: task.technician_user_id || '', status: task.status });
    };

    const saveTask = () => {
        router.patch(route('admin.tasks.update', editingTask.id), form, {
            onSuccess: () => setEditingTask(null)
        });
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'pending': return 'bg-red-100 text-red-700 border-red-200';
            case 'assigned': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Manajemen Tugas</h2>}
        >
            <Head title="Manajemen Tugas" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* FILTER SECTION */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-1/3">
                            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                            <select 
                                value={statusFilter}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className={`${inputClass} pl-10`}
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <form onSubmit={handleSearch} className="relative w-full md:w-1/3">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                            <input 
                                type="text"
                                className={`${inputClass} pl-10`}
                                placeholder="Cari Tugas / Nama Client..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* MOBILE VIEW (CARDS) */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {tasks.data.map((task) => (
                            <div key={task.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${getStatusStyle(task.status)}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    <button onClick={() => openEditModal(task)} className="text-indigo-600 bg-indigo-50 p-2 rounded-full">
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <h4 className="font-bold text-gray-900 line-clamp-1 text-lg">{task.title}</h4>
                                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">{task.type}</p>
                                
                                <div className="space-y-2 text-sm text-gray-700 border-t pt-3 mt-2 border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-gray-400"/> 
                                        <span className="font-medium">{task.client?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BriefcaseIcon className="w-4 h-4 text-gray-400"/> 
                                        {task.technician ? <span className="text-blue-600 font-bold">{task.technician.name}</span> : <span className="text-red-500 italic">Belum ada teknisi</span>}
                                    </div>
                                    
                                    {/* --- [TOMBOL LIHAT BUKTI MOBILE] --- */}
                                    {task.evidence_photo_path && (
                                        <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                                            <a 
                                                href={`/storage/${task.evidence_photo_path}`} 
                                                target="_blank" 
                                                className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 p-2 rounded-lg hover:bg-green-100 transition"
                                            >
                                                <PhotoIcon className="w-4 h-4" /> Lihat Bukti Pengerjaan
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP VIEW (TABLE) */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tugas</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Teknisi</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status & Bukti</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tasks.data.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{task.title}</div>
                                            <div className="text-xs text-gray-500 uppercase mt-1">{task.type}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{task.client?.name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {task.technician ? (
                                                <span className="text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded border border-blue-100">{task.technician.name}</span>
                                            ) : (
                                                <span className="text-red-500 italic text-xs">Belum assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start gap-2">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase rounded border ${getStatusStyle(task.status)}`}>
                                                    {task.status.replace('_', ' ')}
                                                </span>
                                                
                                                {/* --- [TOMBOL LIHAT BUKTI DESKTOP] --- */}
                                                {task.evidence_photo_path && (
                                                    <a 
                                                        href={`/storage/${task.evidence_photo_path}`} 
                                                        target="_blank"
                                                        className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-800 hover:underline"
                                                    >
                                                        <PhotoIcon className="w-3 h-3"/> Lihat Bukti
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => openEditModal(task)} className="text-indigo-600 hover:text-indigo-900 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition hover:bg-indigo-100">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-6"><Pagination links={tasks.links} /></div>
                </div>
            </div>

            {/* MODAL EDIT */}
            {editingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Update Tugas</h3>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Teknisi</label>
                                <select
                                    className={inputClass}
                                    value={form.technician_user_id}
                                    onChange={e => setForm({...form, technician_user_id: e.target.value})}
                                >
                                    <option value="">-- Pilih Teknisi --</option>
                                    {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Status Pengerjaan</label>
                                <select
                                    className={inputClass}
                                    value={form.status}
                                    onChange={e => setForm({...form, status: e.target.value})}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setEditingTask(null)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition">Batal</button>
                            <button onClick={saveTask} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md transition">Simpan Perubahan</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}