import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { 
    WrenchScrewdriverIcon, 
    ArchiveBoxIcon, 
    MagnifyingGlassIcon,
    ExclamationTriangleIcon, 
    ClockIcon, 
    CubeIcon, 
    CheckCircleIcon,
    Squares2X2Icon,
    CalendarDaysIcon,
    XMarkIcon,
    PlusIcon,
    MinusIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, equipment, logs }) {
    // 1. Gunakan data LANGSUNG dari Controller (Hapus dummy fallback)
    const equipmentData = equipment || [];
    const logsData = logs || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('stocks');
    const [filterCategory, setFilterCategory] = useState('all');

    const { data, setData, post, processing, errors, reset } = useForm({
        equipment_id: '',
        quantity: 1,
        type: 'take',
        notes: ''
    });

    const filteredEquipment = equipmentData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' ? true : item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const openModal = (item) => {
        setSelectedItem(item);
        
        // [PERBAIKAN LOGIKA]
        // Mode 'return' HANYA JIKA barang adalah ALAT (tool) DAN user sedang memegangnya.
        // Jika Bahan (material), selalu mode 'take' (ambil lagi/tambah stok pribadi).
        const isTool = item.category === 'tool';
        const isReturnAction = isTool && item.my_holding_qty > 0;
        
        setData({
            equipment_id: item.id,
            quantity: 1, // Reset ke 1 saat buka modal
            type: isReturnAction ? 'return' : 'take',
            notes: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setSelectedItem(null); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        // GUNAKAN OPSI preserveScroll AGAR LAYAR TIDAK LOMPAT KE ATAS
        post(route('teknisi.equipment.store'), { 
            onSuccess: () => closeModal(),
            preserveScroll: true 
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Gudang & Logistik</h2>}>
            <Head title="Stok Alat" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    
                    {/* ERROR FEEDBACK */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm animate-pulse">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Gagal Menyimpan</h3>
                                    <ul className="mt-1 list-disc list-inside text-sm text-red-700">
                                        {Object.values(errors).map((error, idx) => (
                                            <li key={idx}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NAVIGASI TAB */}
                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200 mb-6">
                        <button onClick={() => setActiveTab('stocks')} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'stocks' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <CubeIcon className="w-5 h-5"/> Stok Barang
                        </button>
                        <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <ClockIcon className="w-5 h-5"/> Riwayat Saya
                        </button>
                    </div>

                    {/* TAB STOK */}
                    {activeTab === 'stocks' && (
                        <div className="space-y-5">
                            <div className="relative group">
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500"/>
                                <input 
                                    type="text" 
                                    placeholder="Cari alat atau bahan..." 
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-bold text-gray-900" 
                                    value={searchQuery} 
                                    onChange={e => setSearchQuery(e.target.value)} 
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {[
                                    { id: 'all', label: 'Semua', icon: Squares2X2Icon, color: 'bg-gray-900' },
                                    { id: 'tool', label: 'Alat Kerja', icon: WrenchScrewdriverIcon, color: 'bg-blue-600' },
                                    { id: 'material', label: 'Bahan', icon: ArchiveBoxIcon, color: 'bg-orange-600' }
                                ].map((cat) => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => setFilterCategory(cat.id)}
                                        className={`px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap border transition-all flex items-center gap-2
                                            ${filterCategory === cat.id 
                                                ? `${cat.color} text-white border-transparent shadow-lg` 
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <cat.icon className="w-4 h-4"/> {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* JIKA DATA KOSONG */}
                            {filteredEquipment.length === 0 && (
                                <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                    <CubeIcon className="w-12 h-12 text-gray-300 mx-auto mb-2"/>
                                    <p className="text-gray-500 font-bold">Data Barang Kosong</p>
                                    <p className="text-xs text-gray-400">Silakan input data alat di Panel Admin</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {filteredEquipment.map((item) => {
                                    const isTool = item.category === 'tool';
                                    const isOutOfStock = item.available_quantity <= 0;
                                    const isHolding = item.my_holding_qty > 0;

                                    return (
                                        <div key={item.id} className={`bg-white p-6 rounded-3xl shadow-sm border transition-all relative overflow-hidden ${isHolding && isTool ? 'border-l-8 border-l-green-500 border-green-100 bg-green-50/20' : (isOutOfStock ? 'bg-gray-50 border-gray-200' : (isTool ? 'border-l-8 border-l-blue-600 border-gray-100' : 'border-l-8 border-l-orange-500 border-gray-100'))}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg tracking-wider ${isTool ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                                            {isTool ? 'Aset Alat' : 'Bahan Pakai'}
                                                        </span>
                                                        
                                                        {/* Badge 'Dipinjam' HANYA muncul jika itu ALAT */}
                                                        {isHolding && isTool && (
                                                            <span className="bg-green-100 text-green-800 px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg flex items-center gap-1">
                                                                <CheckCircleIcon className="w-3.5 h-3.5"/> Dipinjam
                                                            </span>
                                                        )}
                                                        
                                                        {isOutOfStock && (!isHolding || !isTool) && (
                                                            <span className="bg-red-100 text-red-700 px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg">Habis</span>
                                                        )}
                                                    </div>
                                                    <h3 className={`text-xl font-black ${isOutOfStock && (!isHolding || !isTool) ? 'text-gray-400' : 'text-gray-900'}`}>{item.name}</h3>
                                                    <p className="text-sm text-gray-500 mt-1 font-bold">Stok Gudang: <span className="text-gray-900 font-black">{item.available_quantity} {item.unit}</span></p>
                                                </div>
                                                <div className={`p-4 rounded-2xl ${isHolding && isTool ? 'bg-green-100 text-green-600' : (isTool ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600')}`}>
                                                    {isTool ? <WrenchScrewdriverIcon className="w-7 h-7"/> : <ArchiveBoxIcon className="w-7 h-7"/>}
                                                </div>
                                            </div>
                                            
                                            {/* Logika Tombol: Bahan SELALU "Ambil", Alat bisa "Kembalikan" */}
                                            <button 
                                                onClick={() => openModal(item)} 
                                                disabled={isOutOfStock && (!isHolding || !isTool)} 
                                                className={`mt-5 w-full py-4 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 
                                                    ${isHolding && isTool
                                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                        : (isOutOfStock 
                                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                                                            : (isTool ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'))
                                                    }`}
                                            >
                                                {isTool 
                                                    ? (isHolding ? 'Kembalikan Alat' : (isOutOfStock ? 'Stok Habis' : 'Pinjam Alat')) 
                                                    : (isOutOfStock ? 'Stok Habis' : 'Ambil Bahan')
                                                }
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB RIWAYAT */}
                    {activeTab === 'history' && (
                        <div className="space-y-5">
                            {logsData.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-3xl border border-gray-200">
                                    <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-2"/>
                                    <p className="text-gray-500 font-bold">Belum ada riwayat</p>
                                </div>
                            )}

                            {logsData.map((log) => (
                                <div key={log.id} className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
                                    <div className="space-y-3">
                                        <p className="font-black text-gray-900 text-lg leading-tight">{log.equipment?.name}</p>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                                                <CalendarDaysIcon className="w-4 h-4 text-indigo-700" />
                                                <span className="text-xs text-indigo-900 font-black">{new Date(log.created_at).toLocaleDateString('id-ID')}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                                                <ClockIcon className="w-4 h-4 text-indigo-700" />
                                                <span className="text-xs text-indigo-900 font-black">{new Date(log.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase mb-2 ${log.type === 'take' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {log.type === 'take' ? 'Diambil' : 'Kembali'}
                                        </span>
                                        <p className="text-2xl font-black text-gray-900 tracking-tight">
                                            {log.quantity} <span className="text-xs font-bold text-gray-400 uppercase">{log.equipment?.unit}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL TRANSAKSI */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-100">
                        <h2 className={`text-2xl font-black tracking-tight ${data.type === 'return' ? 'text-green-700' : 'text-gray-900'}`}>
                            {data.type === 'return' ? 'Kembalikan Alat' : 'Konfirmasi Ambil'}
                        </h2>
                        <button type="button" onClick={closeModal} className="text-gray-300 hover:text-gray-900 transition-colors"><XMarkIcon className="w-8 h-8"/></button>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-inner text-center">
                            <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">Barang Terpilih</p>
                            <p className="font-black text-gray-900 text-2xl">{selectedItem?.name}</p>
                            
                            <div className="flex justify-center gap-4 mt-4 text-xs font-bold">
                                <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-gray-100">Gudang: <strong className="text-indigo-600 font-black">{selectedItem?.available_quantity}</strong></span>
                                {selectedItem?.category === 'tool' && (
                                    <span className="px-3 py-1 bg-white rounded-lg shadow-sm border border-gray-100">Bawa: <strong className="text-green-600 font-black">{selectedItem?.my_holding_qty}</strong></span>
                                )}
                            </div>
                        </div>

                        {/* INPUT JUMLAH */}
                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-4 text-center uppercase tracking-widest">Jumlah Unit</label>
                            <div className="flex items-center justify-center gap-4">
                                <button type="button" onClick={() => setData('quantity', Math.max(1, data.quantity - 1))} className="w-20 h-20 rounded-[2rem] bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm group">
                                    <MinusIcon className="w-8 h-8 stroke-[3px] text-gray-900 group-hover:text-white" />
                                </button>
                                
                                <input 
                                    type="number" 
                                    className="w-32 text-center border-b-4 border-t-0 border-x-0 border-gray-200 h-20 text-5xl font-black text-gray-900 focus:ring-0 focus:border-indigo-600 bg-transparent" 
                                    value={data.quantity} 
                                    onChange={e => setData('quantity', parseInt(e.target.value) || 1)} 
                                />
                                
                                <button type="button" onClick={() => {
                                    // Logic Max Qty:
                                    // Jika Return -> Max adalah yang dibawa (my_holding_qty)
                                    // Jika Take -> Max adalah stok gudang (available_quantity)
                                    const maxLimit = data.type === 'return' ? selectedItem?.my_holding_qty : selectedItem?.available_quantity;
                                    setData('quantity', data.quantity >= maxLimit ? maxLimit : data.quantity + 1)
                                }} className="w-20 h-20 rounded-[2rem] bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm group">
                                    <PlusIcon className="w-8 h-8 stroke-[3px] text-gray-900 group-hover:text-white" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-widest">Catatan</label>
                            <textarea className="w-full border-2 border-gray-200 rounded-3xl p-5 font-bold text-gray-900 focus:ring-indigo-500 focus:border-indigo-600 min-h-[100px] bg-gray-50/50" rows="2" placeholder="Keterangan singkat..." value={data.notes} onChange={e => setData('notes', e.target.value)}></textarea>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <button type="button" onClick={closeModal} className="flex-1 py-5 bg-white border-2 border-gray-200 rounded-[1.5rem] font-black text-gray-500 hover:bg-gray-50 transition-all active:scale-95">Batal</button>
                        <button type="submit" disabled={processing} 
                            className={`flex-1 py-5 text-white rounded-[1.5rem] font-black shadow-2xl transition-all active:scale-95 disabled:opacity-50 
                            ${data.type === 'return' ? 'bg-green-600 hover:bg-green-700' : (selectedItem?.category === 'tool' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-orange-600 hover:bg-orange-700')}`}>
                            {processing ? '...' : (data.type === 'return' ? 'Konfirmasi' : (selectedItem?.category === 'tool' ? 'Pinjam Alat' : 'Ambil Bahan'))}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}