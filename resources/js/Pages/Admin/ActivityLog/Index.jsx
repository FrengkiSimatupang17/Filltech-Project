import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';

export default function Index({ auth, logs }) {

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        return date.toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Log Aktivitas Sistem</h2>}
        >
            <Head title="Log Aktivitas" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {logs.data.length > 0 ? (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body p-0">
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead className="bg-base-200 text-base-content">
                                            <tr>
                                                <th className="p-4 rounded-tl-xl pl-6">Deskripsi Aktivitas</th>
                                                <th className="p-4">Dilakukan Oleh</th>
                                                <th className="p-4 rounded-tr-xl pr-6 text-right">Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.data.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="pl-6 font-medium">{log.description}</td>
                                                    <td>
                                                        {log.causer ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="avatar placeholder">
                                                                    <div className="bg-neutral text-neutral-content rounded-full w-6">
                                                                        <span className="text-xs">{log.causer.name.charAt(0)}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-sm">{log.causer.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="badge badge-ghost badge-sm">Sistem</span>
                                                        )}
                                                    </td>
                                                    <td className="text-right pr-6 text-sm text-gray-500 font-mono">
                                                        {formatDateTime(log.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 border-t border-base-200">
                                    <Pagination links={logs.links} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <EmptyState
                            title="Log Kosong"
                            message="Belum ada aktivitas yang tercatat di sistem."
                        />
                    )}
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}