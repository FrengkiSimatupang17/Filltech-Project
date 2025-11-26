import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import { FaSearch, FaTools, FaCheck, FaTimes, FaExchangeAlt, FaHourglassHalf } from 'react-icons/fa';

const BorrowedEquipmentCard = ({ log, onReturn }) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex justify-between items-center">
        <div>
            <h3 className="font-bold text-gray-900">{log.equipment_name}</h3>
            <p className="text-xs text-gray-500 font-mono">{log.serial_number || 'N/A'}</p>
            <p className="text-xs text-gray-500 mt-1">Dipinjam: {log.borrowed_at}</p>
        </div>
        <SecondaryButton onClick={() => onReturn(log.id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
            Kembalikan
        </SecondaryButton>
    </div>
);

const AvailableEquipmentCard = ({ item, onBorrow }) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex justify-between items-center">
        <div>
            <h3 className="font-bold text-gray-900">{item.name}</h3>
            <p className="text-xs text-gray-500 font-mono">{item.serial_number || 'N/A'}</p>
        </div>
        <PrimaryButton onClick={() => onBorrow(item.id)} className="text-xs h-8">
            Pinjam
        </PrimaryButton>
    </div>
);

const HistoryCard = ({ log }) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h3 className="font-bold text-gray-900">{log.equipment_name}</h3>
            <span className="text-xs text-gray-500 font-mono">{log.serial_number || '-'}</span>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1"><FaExchangeAlt /> Dipinjam:</span>
                <span>{log.borrowed_at}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1"><FaCheck /> Dikembalikan:</span>
                <span className="text-green-600 font-semibold">{log.returned_at}</span>
            </div>
        </div>
    </div>
);


export default function Index({ auth, availableEquipment, myBorrowedEquipment, myHistory, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('teknisi.equipment.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleBorrow = (equipmentId) => {
        if (confirm('Anda yakin ingin meminjam alat ini?')) {
            router.post(route('teknisi.equipment.store'), {
                equipment_id: equipmentId,
            }, {
                preserveScroll: true,
            });
        }
    };

    const handleReturn = (logId) => {
        if (confirm('Anda yakin ingin mengembalikan alat ini?')) {
            router.patch(route('teknisi.equipment.update', logId), {}, {
                preserveScroll: true,
            });
        }
    };

    const borrowedData = myBorrowedEquipment || [];
    const availableData = availableEquipment || [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Perlengkapan</h2>}
        >
            <Head title="Manajemen Alat" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* SECTION 1: Borrowed Equipment */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-4 sm:p-6 text-gray-900 border-b bg-gray-50/50">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <FaHourglassHalf className="text-orange-500" /> Alat yang Sedang Dipinjam ({borrowedData.length})
                            </h3>
                        </div>
                        
                        <div className="p-4 sm:p-6">
                            {borrowedData.length > 0 ? (
                                <div className="space-y-3 hidden md:block">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Alat</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dipinjam Tgl</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {borrowedData.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.equipment_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.serial_number || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.borrowed_at}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <SecondaryButton onClick={() => handleReturn(log.id)}>Kembalikan</SecondaryButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState title="Tidak Ada Alat" message="Anda tidak sedang meminjam alat inventaris apapun." icon={FaTools} />
                            )}
                            
                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-3">
                                {borrowedData.map(log => <BorrowedEquipmentCard key={log.id} log={log} onReturn={handleReturn} />)}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Available Equipment (to Borrow) */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-4 sm:p-6 text-gray-900 border-b bg-gray-50/50">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Alat Tersedia ({availableData.length})
                            </h3>
                        </div>
                        
                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleSearch} className="mb-4 flex gap-2 w-full md:w-1/2">
                                <TextInput
                                    type="text"
                                    className="w-full rounded-r-none"
                                    placeholder="Cari nama alat..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <PrimaryButton className="rounded-l-none justify-center px-4">
                                    <FaSearch />
                                </PrimaryButton>
                            </form>

                            {availableData.length > 0 ? (
                                <div className="space-y-3">
                                    {/* Desktop Table (Simplified) */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {availableData.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.serial_number || '-'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <PrimaryButton onClick={() => handleBorrow(item.id)} className="text-xs">Pinjam</PrimaryButton>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Mobile Card List */}
                                    <div className="md:hidden space-y-3">
                                        {availableData.map(item => <AvailableEquipmentCard key={item.id} item={item} onBorrow={handleBorrow} />)}
                                    </div>
                                </div>
                            ) : (
                                <EmptyState title="Kosong" message="Tidak ada alat yang tersedia saat ini." />
                            )}
                        </div>
                    </div>

                    {/* SECTION 3: History */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-4 sm:p-6 text-gray-900 border-b bg-gray-50/50">
                            <h3 className="text-lg font-bold">Riwayat Peminjaman ({myHistory.total})</h3>
                        </div>
                        
                        <div className="p-4 sm:p-6">
                            {myHistory.data.length > 0 ? (
                                <>
                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Alat</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dipinjam</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dikembalikan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {myHistory.data.map((log) => (
                                                    <tr key={log.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.equipment_name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.borrowed_at}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{log.returned_at}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="md:hidden space-y-3">
                                        {myHistory.data.map(log => <HistoryCard key={log.id} log={log} />)}
                                    </div>

                                    <div className="mt-6">
                                        <Pagination links={myHistory.links} />
                                    </div>
                                </>
                            ) : (
                                <EmptyState title="Belum Ada Riwayat" message="Anda belum pernah meminjam alat inventaris." />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}