import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    WrenchScrewdriverIcon, 
    ArchiveBoxIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    ArrowPathIcon // Icon untuk Restock
} from '@heroicons/react/24/outline';

export default function Index({ auth, equipment, filters = {} }) {
    // State Modal Utama
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    
    // State Modal Restock
    const [showRestockModal, setShowRestockModal] = useState(null);
    const [selectedRestockItem, setSelectedRestockItem] = useState(null);

    const [search, setSearch] = useState(filters.search || '');

    // Class Input Standar
    const inputClass = "w-full border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm";

    // Form Utama (Create/Edit/Delete)
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '', name: '', category: 'tool', total_quantity: 1, unit: 'pcs',
    });

    // Form Khusus Restock (Agar state tidak bentrok)
    const { 
        data: restockData, 
        setData: setRestockData, 
        post: postRestock, 
        processing: restockProcessing, 
        errors: restockErrors, 
        reset: resetRestock 
    } = useForm({
        quantity: 1,
        notes: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.equipment.index'), { search }, { preserveState: true });
    };

    // --- HANDLERS UTAMA ---
    const openCreateModal = () => { reset(); setData('category', 'tool'); setShowCreateModal(true); };
    
    const openEditModal = (item) => { 
        setData({
            id: item.id, name: item.name, category: item.category,
            total_quantity: item.total_quantity, unit: item.unit
        }); 
        setShowEditModal(item.id); 
    };
    
    const openDeleteModal = (item) => { setData({ id: item.id, name: item.name }); setShowDeleteModal(item.id); };
    
    const closeModal = () => { 
        setShowCreateModal(false); 
        setShowEditModal(null); 
        setShowDeleteModal(null); 
        reset(); 
    };

    const submitCreate = (e) => { e.preventDefault(); post(route('admin.equipment.store'), { onSuccess: () => closeModal() }); };
    const submitEdit = (e) => { e.preventDefault(); patch(route('admin.equipment.update', data.id), { onSuccess: () => closeModal() }); };
    const submitDelete = (e) => { e.preventDefault(); destroy(route('admin.equipment.destroy', data.id), { onSuccess: () => closeModal() }); };

    // --- HANDLERS RESTOCK ---
    const openRestockModal = (item) => {
        setSelectedRestockItem(item);
        setRestockData({ quantity: 1, notes: '' });
        setShowRestockModal(item.id);
    };

    const closeRestockModal = () => {
        setShowRestockModal(null);
        setSelectedRestockItem(null);
        resetRestock();
    };

    const submitRestock = (e) => {
        e.preventDefault();
        postRestock(route('admin.equipment.restock', selectedRestockItem.id), {
            onSuccess: () => closeRestockModal(),
        });
    };

    const equipmentData = equipment.data || [];

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<div className="flex justify-between items-center"><h2 className="font-semibold text-xl text-gray-800">Manajemen Alat & Bahan</h2><button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-md transition"><PlusIcon className="w-5 h-5" /> Tambah Barang</button></div>}
        >
            <Head title="Manajemen Alat & Bahan" />
            
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* SEARCH BAR */}
                    <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <form onSubmit={handleSearch} className="relative w-full md:w-96">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                            <input 
                                type="text"
                                className={`${inputClass} pl-10`}
                                placeholder="Cari Nama Barang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                    </div>

                    {equipmentData.length > 0 ? (
                        <>
                            {/* TABLE VIEW (Desktop) */}
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama Barang</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Kategori</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Sisa</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {equipmentData.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4">
                                                    {item.category === 'tool' ? (
                                                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold w-fit uppercase"><WrenchScrewdriverIcon className="w-3 h-3"/> Alat</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold w-fit uppercase"><ArchiveBoxIcon className="w-3 h-3"/> Bahan</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{item.total_quantity} {item.unit}</td>
                                                <td className="px-6 py-4 text-sm font-bold font-mono text-green-600">{item.available_quantity} {item.unit}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        {/* TOMBOL RESTOCK DI BAGIAN AKSI */}
                                                        <button 
                                                            onClick={() => openRestockModal(item)} 
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Tambah Stok"
                                                        >
                                                            <ArrowPathIcon className="w-5 h-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => openEditModal(item)} 
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Edit"
                                                        >
                                                            <PencilSquareIcon className="w-5 h-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => openDeleteModal(item)} 
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Hapus"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE VIEW (Cards) */}
                            <div className="md:hidden grid grid-cols-1 gap-4">
                                {equipmentData.map((item) => (
                                    <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            {item.category === 'tool' ? <WrenchScrewdriverIcon className="w-5 h-5 text-blue-500"/> : <ArchiveBoxIcon className="w-5 h-5 text-orange-500"/>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg mb-3">
                                            <div><span className="block text-xs text-gray-500">Total</span><span className="font-bold">{item.total_quantity} {item.unit}</span></div>
                                            <div><span className="block text-xs text-gray-500">Sisa</span><span className="font-bold text-green-600">{item.available_quantity} {item.unit}</span></div>
                                        </div>
                                        <div className="flex justify-end gap-4 pt-2 border-t">
                                            {/* TOMBOL RESTOCK MOBILE */}
                                            <button onClick={() => openRestockModal(item)} className="text-green-600 text-sm font-bold flex items-center gap-1">
                                                <ArrowPathIcon className="w-4 h-4"/> Stok
                                            </button>
                                            <button onClick={() => openEditModal(item)} className="text-blue-600 text-sm font-bold flex items-center gap-1">
                                                <PencilSquareIcon className="w-4 h-4"/> Edit
                                            </button>
                                            <button onClick={() => openDeleteModal(item)} className="text-red-600 text-sm font-bold flex items-center gap-1">
                                                <TrashIcon className="w-4 h-4"/> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6"><Pagination links={equipment.links} /></div>
                        </>
                    ) : (
                        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <ArchiveBoxIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-bold text-gray-900">Belum Ada Data</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL CREATE / EDIT */}
            <Modal show={showCreateModal || !!showEditModal} onClose={closeModal}>
                <form onSubmit={showCreateModal ? submitCreate : submitEdit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">
                        {showCreateModal ? 'Tambah Barang Baru' : 'Edit Barang'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Barang</label>
                            <input type="text" className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="Contoh: Kabel UTP" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                            <select className={inputClass} value={data.category} onChange={(e) => setData('category', e.target.value)} required>
                                <option value="tool">Alat Kerja (Aset)</option>
                                <option value="material">Bahan Habis Pakai</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Total Stok</label>
                                <input type="number" min="0" className={inputClass} value={data.total_quantity} onChange={(e) => setData('total_quantity', e.target.value)} required />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Satuan</label>
                                <select className={inputClass} value={data.unit} onChange={(e) => setData('unit', e.target.value)} required>
                                    <option value="pcs">Pcs</option><option value="unit">Unit</option><option value="roll">Roll</option><option value="box">Box</option><option value="meter">Meter</option><option value="pack">Pack</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold">Batal</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md">Simpan</button>
                    </div>
                </form>
            </Modal>

            {/* MODAL RESTOCK */}
            <Modal show={!!showRestockModal} onClose={closeRestockModal}>
                <form onSubmit={submitRestock} className="p-6">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <ArrowPathIcon className="w-6 h-6 text-green-600"/>
                            Restock Barang
                        </h2>
                        <button type="button" onClick={closeRestockModal} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 uppercase font-bold">Barang</p>
                            <p className="text-lg font-bold text-gray-900">{selectedRestockItem?.name}</p>
                            <p className="text-sm text-gray-600">Stok saat ini: <span className="font-bold">{selectedRestockItem?.available_quantity} {selectedRestockItem?.unit}</span></p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Penambahan</label>
                            <input 
                                type="number" 
                                min="1"
                                className={inputClass}
                                value={restockData.quantity}
                                onChange={e => setRestockData('quantity', e.target.value)}
                                placeholder="Masukkan jumlah stok baru..."
                            />
                            {restockErrors.quantity && <p className="text-red-500 text-xs mt-1">{restockErrors.quantity}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Catatan (Opsional)</label>
                            <textarea 
                                className="w-full border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:ring-green-500 focus:border-green-500 shadow-sm"
                                rows="2"
                                value={restockData.notes}
                                onChange={e => setRestockData('notes', e.target.value)}
                                placeholder="Contoh: Pembelian Batch #4..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={closeRestockModal} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold hover:bg-gray-200">Batal</button>
                        <button type="submit" disabled={restockProcessing} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md">
                            {restockProcessing ? 'Menyimpan...' : 'Tambah Stok'}
                        </button>
                    </div>
                </form>
            </Modal>

             {/* DELETE MODAL */}
             <Modal show={!!showDeleteModal} onClose={closeModal}>
                <form onSubmit={submitDelete} className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><TrashIcon className="w-6 h-6 text-red-600" /></div>
                    <h2 className="text-lg font-bold text-gray-900">Hapus Barang?</h2>
                    <p className="mt-2 text-sm text-gray-600 mb-6">Anda yakin ingin menghapus "{data.name}"?</p>
                    <div className="flex justify-center gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold">Batal</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold">Ya, Hapus</button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}