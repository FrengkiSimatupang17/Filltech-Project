import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import ToastNotification from '@/Components/ToastNotification';
import { FaMoneyBillWave, FaFileUpload, FaCreditCard, FaChevronDown, FaChevronUp, FaCopy, FaImage, FaTrash } from 'react-icons/fa';

export default function Index({ auth, invoices }) {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [activeGuide, setActiveGuide] = useState(null);
    const [copyNotification, setCopyNotification] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        invoice_id: '',
        payment_proof: null,
    });

    const openPaymentModal = (invoice) => {
        reset();
        clearErrors();
        setPreviewUrl(null);
        setActiveGuide(null);
        setSelectedInvoice(invoice);
        setData('invoice_id', invoice.id);
    };

    const closeModal = () => {
        setSelectedInvoice(null);
        setPreviewUrl(null);
        reset();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('payment_proof', file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const removeImage = () => {
        setData('payment_proof', null);
        setPreviewUrl(null);
        const fileInput = document.getElementById('payment_proof_input');
        if (fileInput) fileInput.value = '';
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('client.payments.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopyNotification(`Nomor rekening ${text} berhasil disalin!`);
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Helper Component untuk Status Badge
    const StatusBadge = ({ status, payment_status }) => {
        if (payment_status === 'verified' || status === 'paid') {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Lunas</span>;
        } else if (payment_status === 'pending') {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Menunggu Verifikasi</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Belum Bayar</span>;
        }
    };

    const GuideItem = ({ title, steps, id }) => (
        <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
            <button
                type="button"
                onClick={() => setActiveGuide(activeGuide === id ? null : id)}
                className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition text-left"
            >
                <span className="text-sm font-semibold text-gray-700">{title}</span>
                {activeGuide === id ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
            </button>
            {activeGuide === id && (
                <div className="p-4 bg-white text-sm text-gray-600 space-y-2 border-t border-gray-200">
                    <ol className="list-decimal list-outside ml-4 space-y-1">
                        {steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tagihan Saya</h2>}
        >
            <Head title="Tagihan & Pembayaran" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-4 sm:p-6">
                            {invoices.data && invoices.data.length > 0 ? (
                                <>
                                    {/* --- DESKTOP VIEW (TABLE) --- */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Invoice</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenggat Waktu</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {invoices.data.map((inv) => (
                                                    <tr key={inv.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                            #{inv.invoice_number}
                                                            <div className="text-xs text-gray-500 font-normal mt-1">
                                                                {inv.type === 'installation' ? 'Biaya Instalasi' : 'Langganan Bulanan'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{inv.due_date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatRupiah(inv.amount)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <StatusBadge status={inv.status} payment_status={inv.payment_status} />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            {inv.status === 'pending' && (!inv.payment_status) && (
                                                                <button
                                                                    onClick={() => openPaymentModal(inv)}
                                                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none transition ease-in-out duration-150"
                                                                >
                                                                    <FaMoneyBillWave className="mr-2" /> Bayar
                                                                </button>
                                                            )}
                                                            {(inv.status === 'paid' || inv.payment_status === 'pending' || inv.payment_status === 'verified') && (
                                                                <span className="text-sm text-gray-500 italic">
                                                                    {inv.payment_status === 'pending' ? 'Sedang diverifikasi' : 'Selesai'}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* --- MOBILE VIEW (CARDS) --- */}
                                    <div className="md:hidden space-y-4">
                                        {invoices.data.map((inv) => (
                                            <div key={inv.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="font-bold text-gray-900">#{inv.invoice_number}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {inv.type === 'installation' ? 'Biaya Instalasi' : 'Langganan Bulanan'}
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={inv.status} payment_status={inv.payment_status} />
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4 border-t border-gray-100 pt-3">
                                                    <div>
                                                        <span className="text-xs text-gray-400 block">Jatuh Tempo</span>
                                                        {inv.due_date}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-400 block">Total</span>
                                                        <span className="font-bold text-gray-900">{formatRupiah(inv.amount)}</span>
                                                    </div>
                                                </div>

                                                {/* Action Button Mobile */}
                                                {inv.status === 'pending' && (!inv.payment_status) ? (
                                                    <button
                                                        onClick={() => openPaymentModal(inv)}
                                                        className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition"
                                                    >
                                                        <FaMoneyBillWave className="mr-2" /> Bayar Sekarang
                                                    </button>
                                                ) : (
                                                    <div className="text-center text-sm text-gray-500 bg-gray-50 py-2 rounded-lg italic">
                                                        {inv.payment_status === 'pending' ? 'Bukti terkirim, menunggu verifikasi' : 'Pembayaran Selesai'}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-6">
                                        <Pagination links={invoices.links} />
                                    </div>
                                </>
                            ) : (
                                <EmptyState title="Tidak ada tagihan" message="Saat ini Anda tidak memiliki tagihan aktif." />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL PEMBAYARAN --- */}
            <Modal show={!!selectedInvoice} onClose={closeModal} maxWidth="2xl">
                <div className="flex flex-col h-full md:h-auto">
                    {/* Header Modal */}
                    <div className="p-4 md:p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-lg">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                            Pembayaran #{selectedInvoice?.invoice_number}
                        </h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-2">
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                        {/* [FIX] Gunakan grid-cols-1 untuk Mobile, grid-cols-2 untuk Desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* BAGIAN KIRI: Info Rekening & Panduan */}
                            <div className="space-y-6 order-2 md:order-1">
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Total Yang Harus Dibayar</p>
                                    <p className="text-3xl font-black text-blue-800">{selectedInvoice && formatRupiah(selectedInvoice.amount)}</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-700 flex items-center">
                                        <FaCreditCard className="mr-2 text-indigo-500" /> Rekening Tujuan
                                    </h3>

                                    {/* Rekening Mandiri */}
                                    <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm relative group hover:border-indigo-500 transition">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-base md:text-lg text-blue-900">MANDIRI</p>
                                                <p className="text-xs md:text-sm text-gray-500">A.n. AIDI</p>
                                            </div>
                                            <button onClick={() => copyToClipboard('1090021374558')} className="text-gray-400 hover:text-indigo-600 text-xs md:text-sm flex items-center gap-1 bg-gray-50 p-2 rounded-md">
                                                <FaCopy /> Salin
                                            </button>
                                        </div>
                                        <p className="text-xl md:text-2xl font-mono font-bold text-gray-800 mt-2 tracking-wider break-all">1090021374558</p>
                                    </div>

                                    {/* Rekening BSI */}
                                    <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm relative group hover:border-teal-500 transition">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-base md:text-lg text-teal-700">BSI (Syariah)</p>
                                                <p className="text-xs md:text-sm text-gray-500">A.n. AIDI</p>
                                            </div>
                                            <button onClick={() => copyToClipboard('7136563957')} className="text-gray-400 hover:text-teal-600 text-xs md:text-sm flex items-center gap-1 bg-gray-50 p-2 rounded-md">
                                                <FaCopy /> Salin
                                            </button>
                                        </div>
                                        <p className="text-xl md:text-2xl font-mono font-bold text-gray-800 mt-2 tracking-wider break-all">7136563957</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-700 mb-3 text-sm">Panduan Pembayaran</h3>
                                    <GuideItem id="mandiri_mbanking" title="Mandiri - Livin' by Mandiri" steps={["Login ke aplikasi Livin'.", "Pilih 'Transfer Rupiah' > 'Tujuan Baru'.", "Masukkan No Rek: 1090021374558.", "Masukkan nominal tagihan.", "Lanjut dan masukkan PIN."]} />
                                    <GuideItem id="mandiri_atm" title="Mandiri - Mesin ATM" steps={["Masukkan kartu ATM & PIN.", "Menu 'Transfer' > 'Ke Rek Mandiri'.", "No Rek: 1090021374558.", "Masukkan nominal dan konfirmasi."]} />
                                    <GuideItem id="bsi_mobile" title="BSI - BSI Mobile" steps={["Buka BSI Mobile.", "'Transfer' > 'Antar Rekening BSI'.", "No Rek: 7136563957.", "Masukkan nominal dan PIN."]} />
                                    <GuideItem id="bsi_atm" title="BSI - Mesin ATM" steps={["Masukkan kartu & PIN.", "'Transfer' > 'Sesama BSI'.", "No Rek: 7136563957.", "Masukkan nominal dan konfirmasi."]} />
                                </div>
                            </div>

                            {/* BAGIAN KANAN: Upload Bukti */}
                            {/* Di mobile, ini akan muncul paling atas (Order 1) agar user bisa langsung upload jika sudah bayar */}
                            <div className="order-1 md:order-2 bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200 flex flex-col">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                    <FaFileUpload className="mr-2 text-indigo-600" /> Upload Bukti
                                </h3>
                                <form onSubmit={submitPayment} className="flex-1 flex flex-col">
                                    <div className="mb-4 flex-1 flex flex-col justify-center">
                                        <InputLabel htmlFor="payment_proof" value="Foto / Screenshot Bukti" className="mb-2" />
                                        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center min-h-[200px] bg-white relative hover:bg-gray-50 transition">
                                            {previewUrl ? (
                                                <div className="relative w-full h-full">
                                                    <img src={previewUrl} alt="Preview Bukti" className="w-full h-auto max-h-[300px] object-contain rounded-md" />
                                                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition"><FaTrash size={12} /></button>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <FaImage className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                                    <p className="text-sm text-gray-500">Klik untuk memilih file</p>
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" id="payment_proof_input" className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={handleFileChange} accept="image/*" />
                                        <InputError message={errors.payment_proof} className="mt-2" />
                                    </div>
                                    <div className="mt-auto border-t pt-4">
                                        <PrimaryButton className="w-full justify-center py-3 text-base md:text-lg" disabled={processing || !data.payment_proof}>{processing ? 'Mengirim...' : 'Kirim Bukti'}</PrimaryButton>
                                        <SecondaryButton className="w-full justify-center mt-2" onClick={closeModal}>Batal</SecondaryButton>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>

            {/* --- TOAST NOTIFICATION --- */}
            <ToastNotification message={copyNotification} setMessage={setCopyNotification} />
        </AuthenticatedLayout>
    );
}