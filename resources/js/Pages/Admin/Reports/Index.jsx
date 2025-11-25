import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import EmptyState from '@/Components/EmptyState';

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
        <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body p-6">
                <div className="stat-title text-gray-500 font-medium uppercase text-xs tracking-wider">{title}</div>
                <div className="stat-value text-primary mt-1">{value}</div>
            </div>
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
                    
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body p-6">
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
                                <PrimaryButton type="submit" className="w-full md:w-auto justify-center">
                                    Terapkan Filter
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard
                            title="Total Pendapatan (Periode Ini)"
                            value={`Rp ${parseFloat(reports.total_revenue).toLocaleString('id-ID')}`}
                        />
                        <StatCard
                            title="Total Transaksi Berhasil"
                            value={`${reports.total_invoices} Transaksi`}
                        />
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-0">
                            <div className="p-4 border-b border-base-200 bg-base-200/50 rounded-t-xl">
                                <h3 className="font-bold text-gray-700">Transaksi Terbaru</h3>
                            </div>
                            
                            {reports.recent_transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th className="pl-6">No. Tagihan</th>
                                                <th>Tanggal Bayar</th>
                                                <th className="pr-6 text-right">Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.recent_transactions.map((tx) => (
                                                <tr key={tx.id}>
                                                    <td className="pl-6 font-mono font-bold text-xs sm:text-sm">{tx.invoice_number}</td>
                                                    <td className="text-sm">{tx.paid_at}</td>
                                                    <td className="pr-6 text-right font-bold text-success">
                                                        Rp {parseFloat(tx.amount).toLocaleString('id-ID')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState
                                    title="Tidak Ada Data"
                                    message="Tidak ada transaksi yang ditemukan pada periode ini."
                                />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}