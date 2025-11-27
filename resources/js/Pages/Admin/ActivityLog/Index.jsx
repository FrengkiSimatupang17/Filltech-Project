import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import { FaUserCog } from 'react-icons/fa';

export default function ActivityLogIndex({ auth, logs }) {
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">MENUNGGU</span>;
            case 'assigned': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">DIPROSES</span>;
            case 'in_progress': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">PENGERJAAN</span>;
            case 'completed': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">SELESAI</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Log Aktivitas Sistem</h2>}
        >
            <Head title="Log Aktivitas" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktivitas</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {log.created_at}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                                                {log.causer_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {log.description}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Belum ada aktivitas tercatat.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden space-y-4">
                        {logs.data.map((log) => (
                            <div key={log.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                <div className="flex justify-between items-start mb-3 border-b pb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                            {log.causer_name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-gray-800 text-sm">{log.causer_name}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono">{log.created_at}</span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 leading-relaxed">{log.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Pagination links={logs.links} />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}