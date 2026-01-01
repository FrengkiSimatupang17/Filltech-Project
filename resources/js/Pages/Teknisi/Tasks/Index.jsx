import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { 
    MapPinIcon, UserIcon, CameraIcon, 
    CheckCircleIcon, PlayCircleIcon, 
    PhoneIcon, ChatBubbleLeftRightIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const formatWaNumber = (phone) => {
    if (!phone) return '';
    let number = phone.replace(/\D/g, ''); 
    if (number.startsWith('0')) number = '62' + number.substring(1);
    return number;
};

export default function Index({ auth, tasks }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form setup
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PATCH', // Penting: Laravel butuh ini untuk upload file di route PUT/PATCH
        status: '', 
        description: '', 
        evidence: null,
    });

    // --- LOGIC TOMBOL ---
    const handleTaskAction = (task) => {
        if (task.status === 'assigned') {
            // SKENARIO 1: MULAI KERJAKAN (Langsung Update)
            
            // Kita set data manual untuk request ini
            const formData = {
                _method: 'PATCH',
                status: 'in_progress',
                description: 'Memulai pengerjaan tugas.',
                evidence: null
            };

            // Menggunakan visit/post manual karena kita tidak ingin mengubah state 'data' form utama
            // atau bisa menggunakan setData lalu post, tapi pastikan reset setelahnya.
            setData(formData);
            
            // Kita bungkus dalam timeout sebentar agar state setData terapply, 
            // atau lebih aman gunakan post inertia langsung jika tidak butuh reactive form state di UI saat ini.
            // Namun cara di bawah ini menggunakan useForm helper:
            
            // Hack: setData bersifat async di React batching, tapi Inertia useForm tidak selalu immediate.
            // Cara paling aman untuk direct action tanpa modal adalah mengirim payload langsung.
            
            post(route('teknisi.tasks.update', task.id), {
                data: formData, // Override data form
                onSuccess: () => reset(),
            });

        } else if (task.status === 'in_progress') {
            // SKENARIO 2: SELESAIKAN TUGAS (Buka Modal)
            setSelectedTask(task);
            setData({
                _method: 'PATCH',
                status: 'completed',
                description: '',
                evidence: null
            });
            setIsModalOpen(true);
        }
    };

    const closeModal = () => { setIsModalOpen(false); setSelectedTask(null); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Menggunakan POST dengan _method: PATCH agar file upload terbaca di Laravel
        post(route('teknisi.tasks.update', selectedTask.id), { 
            onSuccess: () => closeModal(),
            forceFormData: true // Memastikan dikirim sebagai multipart/form-data
        });
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100';
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Daftar Tugas Saya</h2>}>
            <Head title="Tugas Lapangan" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {tasks.length === 0 ? (
                        <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-200">
                            <CheckCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                            <h3 className="text-lg font-bold text-gray-700">Tidak Ada Tugas Aktif</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasks.map((task) => {
                                const client = task.client || {};
                                const clientPhone = client.phone_number;
                                const waLink = clientPhone 
                                    ? `https://wa.me/${formatWaNumber(clientPhone)}?text=Halo%20${encodeURIComponent(client.name)},%20saya%20teknisi%20internet.` 
                                    : '#';

                                const addressParts = [];
                                if (client.alamat && client.alamat !== '-') addressParts.push(client.alamat);
                                if (client.rt && client.rt !== '-') addressParts.push("RT." + client.rt);
                                if (client.rw && client.rw !== '-') addressParts.push("RW." + client.rw);
                                if (client.blok && client.blok !== '-') addressParts.push("Blok " + client.blok);
                                if (client.nomor_rumah && client.nomor_rumah !== '-') addressParts.push("No. " + client.nomor_rumah);
                                
                                const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Alamat belum lengkap';
                                
                                // Bersihkan deskripsi dari prefix jika ada
                                let jobDescription = "Instalasi / Perbaikan Jaringan";
                                if (task.description) {
                                    jobDescription = task.description.split('LOKASI:')[0].trim();
                                }
                                
                                return (
                                    <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
                                        <div className="p-5 border-b border-gray-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${getStatusBadge(task.status)}`}>{task.status.replace('_', ' ')}</span>
                                                <span className="text-xs text-gray-400 font-mono">#{task.id}</span>
                                            </div>
                                            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 line-clamp-2">{task.title}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">{task.type || 'General'}</p>
                                        </div>

                                        <div className="p-5 flex-grow space-y-4">
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <UserIcon className="w-5 h-5 text-indigo-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-bold uppercase">Client</p>
                                                        <p className="text-sm font-bold text-gray-900">{client.name || 'Nama Client'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {clientPhone ? (
                                                        <>
                                                            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition"><ChatBubbleLeftRightIcon className="w-4 h-4"/> WhatsApp</a>
                                                            <a href={`tel:${clientPhone}`} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition"><PhoneIcon className="w-4 h-4"/> Telpon</a>
                                                        </>
                                                    ) : (
                                                        <div className="w-full text-center text-xs text-red-500 italic bg-white py-1 rounded border border-red-100">No HP Tidak Tersedia</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase">Detail & Lokasi</p>
                                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line break-words">
                                                        {jobDescription}<br/><br/>
                                                        <strong>ALAMAT:</strong><br/>
                                                        {fullAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                                            {task.status !== 'completed' ? (
                                                <button 
                                                    disabled={processing}
                                                    onClick={() => handleTaskAction(task)} 
                                                    className={`w-full py-3 text-white rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 active:scale-95 transform ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                                >
                                                    {task.status === 'assigned' ? (
                                                        <><PlayCircleIcon className="w-5 h-5"/> {processing ? 'Memproses...' : 'Mulai Kerjakan'}</>
                                                    ) : (
                                                        <><CheckCircleIcon className="w-5 h-5"/> Selesaikan Tugas</>
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="text-center text-green-600 font-bold text-sm flex items-center justify-center gap-1 bg-green-50 py-2 rounded-lg border border-green-200"><CheckCircleIcon className="w-5 h-5"/> Tugas Selesai</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal untuk Selesaikan Tugas (Completed) */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-indigo-600">
                        <CheckCircleIcon className="w-8 h-8"/>
                        <h2 className="text-xl font-bold text-gray-900">Selesaikan Tugas</h2>
                    </div>
                    
                    <div className="space-y-5">
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-2">
                            <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 shrink-0"/>
                            <p className="text-xs text-yellow-700">Pastikan Anda telah mengisi catatan hasil pekerjaan dan mengupload foto bukti di lokasi.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Catatan Hasil Pekerjaan</label>
                            <textarea 
                                className="w-full border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500" 
                                rows="3" 
                                placeholder="Jelaskan apa saja yang telah dikerjakan..."
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)}
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <label className="block text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2"><CameraIcon className="w-5 h-5"/> Upload Bukti Foto</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => setData('evidence', e.target.files[0])} 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-white file:text-indigo-700 file:font-bold file:border-none file:shadow-sm hover:file:bg-gray-100 transition"
                            />
                            {errors.evidence && <p className="text-red-500 text-xs mt-1 font-bold">{errors.evidence}</p>}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={closeModal} className="px-5 py-2.5 bg-gray-100 rounded-xl text-gray-700 font-bold hover:bg-gray-200 transition">Batal</button>
                        <button type="submit" disabled={processing} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition disabled:opacity-50">
                            {processing ? 'Mengirim...' : 'Konfirmasi Selesai'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}