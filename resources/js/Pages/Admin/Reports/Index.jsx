import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

// [FIX] Tambahkan prop totalTransactions
export default function Index({ auth, payments, filters, totalRevenue, totalTransactions, availableRt, availableRw }) {
    
    const [queryParams, setQueryParams] = useState({
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
        rt: filters?.rt || '',
        rw: filters?.rw || '',
    });

    const handleChange = (e) => {
        setQueryParams({ ...queryParams, [e.target.name]: e.target.value });
    };

    const handleFilter = () => {
        router.get(route('admin.reports.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setQueryParams({ start_date: '', end_date: '', rt: '', rw: '' });
        router.get(route('admin.reports.index'));
    };

    const handleExport = () => {
        const searchParams = new URLSearchParams(queryParams).toString();
        window.location.href = `${route('admin.reports.export')}?${searchParams}`;
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Keuangan & Filter</h2>}
        >
            <Head title="Laporan Keuangan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* --- FILTER AREA --- */}
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            {/* TANGGAL START */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Dari Tanggal</label>
                                <input 
                                    type="date" 
                                    name="start_date" 
                                    value={queryParams.start_date} 
                                    onChange={handleChange} 
                                    style={{ colorScheme: 'light' }}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" 
                                />
                            </div>

                            {/* TANGGAL END */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Sampai Tanggal</label>
                                <input 
                                    type="date" 
                                    name="end_date" 
                                    value={queryParams.end_date} 
                                    onChange={handleChange} 
                                    style={{ colorScheme: 'light' }}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" 
                                />
                            </div>

                            {/* DROPDOWN RT */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Filter RT</label>
                                <select 
                                    name="rt" 
                                    value={queryParams.rt} 
                                    onChange={handleChange} 
                                    style={{ colorScheme: 'light' }}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                >
                                    <option value="">Semua RT</option>
                                    {availableRt.map((rt, index) => (
                                        <option key={index} value={rt}>{rt}</option>
                                    ))}
                                </select>
                            </div>

                            {/* DROPDOWN RW */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Filter RW</label>
                                <select 
                                    name="rw" 
                                    value={queryParams.rw} 
                                    onChange={handleChange} 
                                    style={{ colorScheme: 'light' }}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                >
                                    <option value="">Semua RW</option>
                                    {availableRw.map((rw, index) => (
                                        <option key={index} value={rw}>{rw}</option>
                                    ))}
                                </select>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-2">
                                {/* [FIX] Tombol CARI diubah jadi PREVIEW */}
                                <button 
                                    onClick={handleFilter} 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    Tampilkan
                                </button>
                                <button onClick={handleReset} className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-3 rounded-md font-bold text-sm transition">Reset</button>
                            </div>
                        </div>
                    </div>

                    {/* --- KARTU RINGKASAN PREVIEW --- */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 border-l-4 border-green-500">
                        <div className="p-6">
                            <h3 className="text-gray-900 font-bold text-lg mb-4 border-b pb-2">Hasil Preview Laporan</h3>
                            
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                {/* Info Kiri: Statistik */}
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Data</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{totalTransactions} Transaksi</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Pemasukan</p>
                                        <p className="text-2xl font-bold text-green-600 mt-1">{formatRupiah(totalRevenue)}</p>
                                    </div>
                                </div>

                                {/* Tombol Kanan: Download */}
                                <div>
                                    <button
                                        onClick={handleExport}
                                        disabled={totalTransactions === 0}
                                        className={`flex items-center px-6 py-3 rounded-lg font-bold shadow-lg transition-all ${
                                            totalTransactions === 0 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {totalTransactions === 0 ? 'Data Kosong' : 'Download Excel (.csv)'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- TABEL DATA PREVIEW --- */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h4 className="font-bold text-gray-700 text-sm uppercase">Detail Data (Tampilan 10 Teratas)</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Klien / Alamat</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Keterangan</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.data.length > 0 ? (
                                        payments.data.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(payment.created_at).toLocaleDateString('id-ID', {
                                                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {payment.invoice?.user?.name || 'User Terhapus'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        RT: {payment.invoice?.user?.rt || '-'} / RW: {payment.invoice?.user?.rw || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    Tagihan #{payment.invoice?.invoice_number} <br/>
                                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                                        {payment.invoice?.type ? payment.invoice.type.toUpperCase() : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                                                    {formatRupiah(payment.amount)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                                                Tidak ada data ditemukan untuk filter ini. Silakan ubah filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <Pagination links={payments.links} />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}