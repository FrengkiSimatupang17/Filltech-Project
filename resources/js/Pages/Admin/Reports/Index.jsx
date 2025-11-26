import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton'; // Pastikan ada
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';

export default function ReportIndex({ auth, reports }) {
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

    const handleExport = () => {
        // Membuka URL download di tab baru agar tidak mengganggu halaman aktif
        const url = route('admin.reports.export', dates);
        window.open(url, '_blank');
    };

    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

    const StatCard = ({ title, value }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Pendapatan</h2>}
        >
            <Head title="Laporan Pendapatan" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row md:items-end gap-4">
                            <div className="w-full md:w-auto">
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
                            <div className="w-full md:w-auto">
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
                            <div className="flex gap-2 w-full md:w-auto">
                                <PrimaryButton type="submit" className="justify-center h-[42px]">
                                    Filter
                                </PrimaryButton>
                                <SecondaryButton type="button" onClick={handleExport} className="justify-center h-[42px] bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
                                    📄 Export PDF
                                </SecondaryButton>
                            </div>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard
                            title="Total Pendapatan (Periode Ini)"
                            value={formatRupiah(reports.total_revenue)}
                        />
                        <StatCard
                            title="Total Transaksi Berhasil"
                            value={`${reports.total_invoices} Transaksi`}
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">Riwayat Transaksi</h3>
                        </div>
                        
                        {reports.transactions.data.length > 0 ? (
                            <>
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Tagihan</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Bayar</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {reports.transactions.data.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {tx.invoice_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {tx.paid_at}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">
                                                        {formatRupiah(tx.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="md:hidden divide-y divide-gray-100">
                                    {reports.transactions.data.map((tx) => (
                                        <div key={tx.id} className="p-4 bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                                    {tx.invoice_number}
                                                </span>
                                                <span className="text-xs text-gray-500">{tx.paid_at}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-sm text-gray-500">Total Bayar</span>
                                                <span className="text-lg font-bold text-green-600">
                                                    {formatRupiah(tx.amount)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 border-t border-gray-100">
                                    <Pagination links={reports.transactions.links} />
                                </div>
                            </>
                        ) : (
                            <EmptyState
                                title="Tidak Ada Data"
                                message="Tidak ada transaksi yang ditemukan pada periode ini."
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}