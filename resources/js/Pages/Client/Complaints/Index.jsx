import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import { FaSearch, FaPlus, FaExclamationCircle, FaUserCog } from 'react-icons/fa';

export default function Index({ auth, complaints, filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('client.complaints.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openCreateModal = () => {
        reset();
        setShowCreateModal(true);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        reset();
    };

    const submitComplaint = (e) => {
        e.preventDefault();
        post(route('client.complaints.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">MENUNGGU</span>;
            case 'assigned': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">DIPROSES</span>;
            case 'in_progress': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">PENGERJAAN</span>;
            case 'completed': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">SELESAI</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Layanan Aduan</h2>
                    <PrimaryButton onClick={openCreateModal} className="hidden md:flex">
                        <FaPlus className="mr-2" /> Buat Aduan
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Aduan Saya" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <form onSubmit={handleSearch} className="w-full md:w-1/3 flex">
                            <TextInput
                                type="text"
                                className="w-full rounded-r-none"
                                placeholder="Cari judul aduan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <PrimaryButton className="rounded-l-none justify-center px-4">
                                <FaSearch />
                            </PrimaryButton>
                        </form>
                        <PrimaryButton onClick={openCreateModal} className="w-full md:hidden justify-center">
                            <FaPlus className="mr-2" /> Buat Aduan Baru
                        </PrimaryButton>
                    </div>

                    {complaints.data.length > 0 ? (
                        <>
                            <div className="hidden md:block bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Aduan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teknisi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {complaints.data.map((task) => (
                                            <tr key={task.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-900">{task.title}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-xs">{task.description || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(task.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {task.technician_name || <span className="italic text-gray-400">Belum ada</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {task.created_at}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden space-y-4">
                                {complaints.data.map((task) => (
                                    <div key={task.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                                        <div className="flex justify-between items-start mb-3 border-b pb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                                                <span className="text-xs text-gray-500">{task.created_at}</span>
                                            </div>
                                            {getStatusBadge(task.status)}
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded border border-gray-100">
                                            {task.description || 'Tidak ada deskripsi detail.'}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <FaUserCog className="text-blue-500" />
                                            <span>Teknisi: </span>
                                            <span className="font-semibold text-gray-700">{task.technician_name || 'Menunggu Penugasan'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <Pagination links={complaints.links} />
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            title="Belum Ada Aduan"
                            message={search ? `Tidak ditemukan aduan dengan kata kunci "${search}"` : "Jika internet Anda bermasalah, segera laporkan di sini."}
                        />
                    )}
                </div>
            </div>

            <Modal show={showCreateModal} onClose={closeModal}>
                <form onSubmit={submitComplaint} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <FaExclamationCircle className="text-red-500" /> Buat Laporan Gangguan
                    </h2>
                    <p className="mb-6 text-sm text-gray-600">
                        Jelaskan kendala yang Anda alami secara detail agar teknisi kami dapat membawa peralatan yang tepat.
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="title" value="Judul Masalah (Singkat)" />
                            <TextInput 
                                id="title" 
                                value={data.title} 
                                onChange={(e) => setData('title', e.target.value)} 
                                className="mt-1 block w-full" 
                                placeholder="Contoh: Internet Mati Total / Kabel Putus"
                                required 
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Deskripsi Detail (Opsional)" />
                            <TextArea 
                                id="description" 
                                value={data.description} 
                                onChange={(e) => setData('description', e.target.value)} 
                                className="mt-1 block w-full" 
                                rows="4"
                                placeholder="Ceritakan kronologi atau kondisi lampu modem..."
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            Kirim Laporan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}