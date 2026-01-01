import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import StatusBadge from '@/Components/StatusBadge';
import { FaFileInvoiceDollar, FaCheckCircle, FaSearch, FaFilter, FaTimes, FaCalendarAlt } from 'react-icons/fa';

export default function Index({ auth, subscriptions, filters }) {
    const [showInvoiceModal, setShowInvoiceModal] = useState(null);
    
    // State Filter
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [dateStart, setDateStart] = useState(filters.date_start || '');
    const [dateEnd, setDateEnd] = useState(filters.date_end || '');

    const { data, setData, post, processing, reset } = useForm({
        subscription_id: '', user_name: '', package_name: '', amount: '',
    });

    // --- LOGIC FILTER ---
    const handleSearch = (e) => {
        if(e) e.preventDefault();
        router.get(route('admin.subscriptions.index'), { 
            search, status, date_start: dateStart, date_end: dateEnd 
        }, { preserveState: true, preserveScroll: true });
    };

    const handleResetFilter = () => {
        setSearch(''); setStatus(''); setDateStart(''); setDateEnd('');
        router.get(route('admin.subscriptions.index'));
    };

    // --- LOGIC MODAL ---
    const openInvoiceModal = (sub) => {
        setData({ subscription_id: sub.id, user_name: sub.user_name, package_name: sub.package_name, amount: sub.package_price });
        setShowInvoiceModal(sub.id);
    };

    const closeModal = () => { setShowInvoiceModal(null); reset(); };
    
    const submitCreateInvoice = (e) => {
        e.preventDefault();
        post(route('admin.subscriptions.storeInvoice', data.subscription_id), { onSuccess: () => closeModal() });
    };
    
    const formatRupiah = (value) => `Rp ${parseFloat(value).toLocaleString('id-ID')}`;

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Langganan</h2>}>
            <Head title="Manajemen Langganan" />
            
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* --- FILTER SECTION --- */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <form onSubmit={handleSearch} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaSearch />
                                    </div>
                                    <TextInput 
                                        placeholder="Cari Klien / Paket..." 
                                        className="pl-10 w-full text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" 
                                        value={search} 
                                        onChange={e => setSearch(e.target.value)} 
                                    />
                                </div>

                                {/* Status */}
                                <div className="relative">
                                    <select 
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm text-gray-900"
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        style={{ colorScheme: 'light' }}
                                    >
                                        <option value="" className="text-gray-500">Semua Status</option>
                                        <option value="active" className="text-gray-900">Active</option>
                                        <option value="pending" className="text-gray-900">Pending</option>
                                        <option value="inactive" className="text-gray-900">Inactive</option>
                                    </select>
                                </div>

                                {/* Date Start */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaCalendarAlt />
                                    </div>
                                    <TextInput 
                                        type="date" 
                                        className="pl-10 w-full text-sm text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" 
                                        value={dateStart} 
                                        onChange={e => setDateStart(e.target.value)} 
                                        style={{ colorScheme: 'light' }} // Agar icon kalender bawaan browser terlihat
                                    />
                                </div>

                                {/* Date End */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaCalendarAlt />
                                    </div>
                                    <TextInput 
                                        type="date" 
                                        className="pl-10 w-full text-sm text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" 
                                        value={dateEnd} 
                                        onChange={e => setDateEnd(e.target.value)} 
                                        style={{ colorScheme: 'light' }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t pt-3 border-gray-100">
                                {(search || status || dateStart || dateEnd) && (
                                    <SecondaryButton onClick={handleResetFilter} className="h-9 text-xs justify-center">
                                        <FaTimes className="mr-1"/> Reset
                                    </SecondaryButton>
                                )}
                                <PrimaryButton type="submit" className="h-9 text-xs justify-center bg-indigo-600 hover:bg-indigo-700">
                                    <FaFilter className="mr-1"/> Terapkan Filter
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* --- CONTENT --- */}
                    {subscriptions.data.length > 0 ? (
                        <>
                            {/* DESKTOP TABLE */}
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Klien</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Paket</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {subscriptions.data.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900">{sub.user_name}</div>
                                                    <div className="text-xs text-gray-500">{sub.user_email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-800">{sub.package_name}</div>
                                                    <div className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded w-fit mt-1">{formatRupiah(sub.package_price)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={sub.status} /></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.created_at}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {sub.status === 'pending' && !sub.has_installation_invoice && (
                                                        <PrimaryButton onClick={() => openInvoiceModal(sub)} className="text-xs h-8 bg-blue-600 hover:bg-blue-700 shadow-sm border-blue-600">
                                                            <FaFileInvoiceDollar className="mr-1.5"/> Buat Tagihan
                                                        </PrimaryButton>
                                                    )}
                                                    {sub.has_installation_invoice && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 cursor-default">
                                                            <FaFileInvoiceDollar className="mr-1.5" /> Tagihan Terkirim
                                                        </span>
                                                    )}
                                                    {sub.status === 'active' && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-green-700 bg-green-100 border border-green-200 cursor-default">
                                                            <FaCheckCircle className="mr-1.5" /> Aktif
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE CARD LIST */}
                            <div className="md:hidden space-y-4">
                                {subscriptions.data.map((sub) => (
                                    <div key={sub.id} className="bg-white p-5 rounded-xl shadow border border-gray-100 relative overflow-hidden">
                                        {/* Status Strip Indicator */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                            sub.status === 'active' ? 'bg-green-500' : 
                                            (sub.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500')
                                        }`}></div>
                                        
                                        {/* Header Card */}
                                        <div className="flex justify-between items-start mb-3 pl-3">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{sub.user_name}</h3>
                                                <p className="text-xs text-gray-500">{sub.user_email}</p>
                                            </div>
                                            <StatusBadge status={sub.status} />
                                        </div>

                                        {/* Content Grid */}
                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-3 mt-1 pl-3">
                                            <div>
                                                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wide mb-0.5">Paket</span>
                                                <span className="font-medium text-gray-800 block truncate">{sub.package_name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wide mb-0.5">Harga</span>
                                                <span className="text-green-600 font-bold block">{formatRupiah(sub.package_price)}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wide mb-0.5">Terdaftar Sejak</span>
                                                <span className="text-gray-700 block">{sub.created_at}</span>
                                            </div>
                                        </div>

                                        {/* Action Button Area */}
                                        {sub.status === 'pending' && !sub.has_installation_invoice && (
                                            <div className="mt-4 pt-3 border-t border-gray-100 pl-3">
                                                <PrimaryButton 
                                                    onClick={() => openInvoiceModal(sub)} 
                                                    className="w-full justify-center h-10 text-sm font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                                                >
                                                    <FaFileInvoiceDollar className="mr-2"/> Buat Tagihan Instalasi
                                                </PrimaryButton>
                                            </div>
                                        )}
                                        
                                        {/* Indikator Read-only jika status lain */}
                                        {sub.has_installation_invoice && sub.status === 'pending' && (
                                            <div className="mt-4 pt-2 border-t border-gray-100 pl-3 text-center">
                                                <span className="text-xs text-gray-400 italic flex items-center justify-center gap-1">
                                                    <FaFileInvoiceDollar/> Menunggu Pembayaran
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6"><Pagination links={subscriptions.links} /></div>
                        </>
                    ) : (
                        <EmptyState title="Tidak Ada Data" message="Tidak ditemukan data langganan yang cocok dengan filter Anda." />
                    )}
                </div>
            </div>

            {/* MODAL KONFIRMASI TAGIHAN */}
            <Modal show={!!showInvoiceModal} onClose={closeModal}>
                <form onSubmit={submitCreateInvoice} className="p-6">
                    <div className="flex items-center gap-3 mb-4 border-b pb-3 border-gray-100">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600"><FaFileInvoiceDollar size={20}/></div>
                        <h2 className="text-lg font-bold text-gray-900">Konfirmasi Tagihan</h2>
                    </div>
                    
                    <p className="mb-6 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        Sistem akan membuat tagihan instalasi otomatis untuk klien <strong className="text-gray-900">{data.user_name}</strong>. Invoice akan dikirim ke dashboard klien.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Paket yang Dipilih" className="text-gray-700" />
                            <TextInput value={data.package_name} className="mt-1 block w-full bg-gray-100 text-gray-800 font-medium cursor-not-allowed border-gray-300" disabled />
                        </div>
                        <div>
                            <InputLabel htmlFor="amount" value="Total Tagihan (Rp)" className="text-gray-700" />
                            <TextInput id="amount" type="text" value={formatRupiah(data.amount)} className="mt-1 block w-full bg-gray-100 font-bold text-gray-900 cursor-not-allowed border-gray-300" disabled />
                            <p className="text-xs text-gray-500 mt-1 italic">*Harga paket default database.</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900">
                            {processing ? 'Memproses...' : 'Kirim Tagihan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}