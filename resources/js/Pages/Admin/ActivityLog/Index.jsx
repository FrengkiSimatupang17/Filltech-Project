import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function ActivityLogIndex({ auth, logs }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Log Aktivitas Sistem</h2>}
        >
            <Head title="Log Aktivitas" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
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
                    </div>

                    <div className="md:hidden space-y-4 px-4 sm:px-0">
                        {logs.data.length > 0 ? (
                            logs.data.map((log) => (
                                <div key={log.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                    <div className="flex justify-between items-start mb-2 border-b border-gray-50 pb-2">
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
                            ))
                        ) : (
                            <div className="text-center p-8 text-gray-500 bg-white rounded-lg shadow-sm">
                                Belum ada aktivitas tercatat.
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <Pagination links={logs.links} />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}