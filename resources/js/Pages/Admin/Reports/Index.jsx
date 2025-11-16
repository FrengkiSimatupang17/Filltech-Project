import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, reports }) {
    const [dates, setDates] = useState({
        start_date: reports.start_date,
        end_date: reports.end_date,
    });

    const handleDateChange = (e) => {
        setDates(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.reports.index'), dates, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const StatCard = ({ title, value }) => (
        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Pendapatan</h2>}
        >
            <Head title="Laporan Pendapatan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row md:items-end gap-4">
                            <div>
                                <InputLabel htmlFor="start_date" value="Tanggal Mulai" />
                                <TextInput
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={dates.start_date}
                                    onChange={handleDateChange}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_date" value="Tanggal Selesai" />
                                <TextInput
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={dates.end_date}
                                    onChange={handleDateChange}
                                />
                            </div>
                            <PrimaryButton type="submit">Filter</PrimaryButton>
                        </form>
                    </div>

                    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <StatCard
                            title="Total Pendapatan (Filter)"
                            value={`Rp ${parseFloat(reports.total_revenue).toLocaleString('id-ID')}`}
                        />
                        <StatCard
                            title="Total Transaksi (Filter)"
                            value={reports.total_invoices}
                        />
                    </dl>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium">Transaksi Terbayar Terbaru</h3>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Tagihan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Bayar</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah (Rp)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reports.recent_transactions.length === 0 && (
                                            <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">Tidak ada data.</td></tr>
                                        )}
                                        {reports.recent_transactions.map((tx) => (
                                            <tr key={tx.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.invoice_number}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.paid_at}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parseFloat(tx.amount).toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}