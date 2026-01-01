import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Pagination from '@/Components/Pagination'; 
import { MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, logs, filters }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        role: filters.role || '',
        search: filters.search || '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.activity-log.index'), { preserveState: true, preserveScroll: true });
    };

    const handleReset = () => {
        window.location.href = route('admin.activity-log.index');
    };

    // --- STYLE INPUT JELAS ---
    const inputClass = "w-full border-gray-300 bg-white text-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-gray-400 text-sm";
    const labelClass = "block text-xs font-bold text-gray-700 uppercase mb-1 tracking-wide";

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800">System Activity Log</h2>}
        >
            <Head title="Activity Log" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* FILTER SECTION */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                            <FunnelIcon className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-bold text-gray-800">Filter Data</h3>
                        </div>

                        <form onSubmit={handleSearch}>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Dari Tanggal</label>
                                    <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className={inputClass}/>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Sampai Tanggal</label>
                                    <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className={inputClass}/>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Role User</label>
                                    <select value={data.role} onChange={e => setData('role', e.target.value)} className={inputClass}>
                                        <option value="">-- Semua --</option>
                                        <option value="administrator">Administrator</option>
                                        <option value="teknisi">Teknisi</option>
                                        <option value="client">Client</option>
                                    </select>
                                </div>
                                <div className="md:col-span-4">
                                    <label className={labelClass}>Cari Kata Kunci</label>
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input type="text" className={`${inputClass} pl-10`} placeholder="Nama, Action, Deskripsi..." value={data.search} onChange={e => setData('search', e.target.value)} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex gap-2">
                                    <button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-md transition">Terapkan</button>
                                    <button type="button" onClick={handleReset} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2.5 rounded-lg transition"><ArrowPathIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* TABLE & PAGINATION (Sama seperti sebelumnya, pastikan bg-white ada di container) */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Waktu</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Event</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Deskripsi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(log.created_at).toLocaleDateString('id-ID')} <br/>
                                                <span className="text-xs">{new Date(log.created_at).toLocaleTimeString('id-ID')}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900 block">{log.user?.name || 'Deleted'}</span>
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase font-bold">{log.user?.role}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded font-bold uppercase ${
                                                    log.event === 'create' ? 'bg-green-100 text-green-700' : 
                                                    log.event === 'update' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                }`}>{log.event}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{log.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-gray-200"><Pagination links={logs.links} /></div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}