import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { 
    ClockIcon, 
    ExclamationTriangleIcon, 
    CheckCircleIcon, 
    ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function Index({ auth, attendances, technicians, filters }) {
    const { data, setData, get } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        user_id: filters.user_id || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('admin.attendance.report.index'), { preserveState: true });
    };

    const handleExport = () => {
        const query = new URLSearchParams({
            start_date: data.start_date,
            end_date: data.end_date,
            user_id: data.user_id
        }).toString();
        window.location.href = `${route('admin.attendance.report.export')}?${query}`;
    };

    // [ANTI GAGAL] Fungsi Format Jam
    const formatTime = (dateString) => {
        if (!dateString) return '-';

        // 1. Coba Parsing Normal (Agar Timezone WIB Tepat)
        // Ganti spasi dengan T (fix untuk Safari/iOS)
        const safeString = dateString.replace(' ', 'T');
        const date = new Date(safeString);

        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace('.', ':');
        }

        // 2. FALLBACK MANUAL (Jika parsing gagal, ambil teks jamnya saja)
        // Asumsi format: "YYYY-MM-DD HH:MM:SS" atau "YYYY-MM-DDTHH:MM:SS"
        // Kita cari karakter ':' dan ambil 2 angka di depannya
        try {
            if (dateString.includes(':')) {
                // Ambil posisi titik dua pertama (jam:menit)
                // Contoh: "2023-10-20 08:30:00" -> ambil "08:30"
                const parts = dateString.split(/[ T]/); // Pisah berdasarkan Spasi atau T
                // parts biasanya: ["2023-10-20", "08:30:00"]
                if (parts.length > 1) {
                    const timePart = parts[1]; // "08:30:00"
                    return timePart.substring(0, 5); // "08:30"
                }
            }
        } catch (e) {
            console.error("Format error", e);
        }

        // 3. Terakhir: Tampilkan string aslinya daripada kosong
        return dateString;
    };

    // [ANTI GAGAL] Fungsi Format Tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const safeString = dateString.replace(' ', 'T');
        const date = new Date(safeString);

        // Jika valid, format cantik
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('id-ID', {
                weekday: 'long', 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric'
            });
        }

        // Jika gagal, tampilkan tanggal mentah (misal: 2023-10-20)
        return dateString.split(' ')[0]; 
    };

    const formatDuration = (totalMinutes) => {
        if (!totalMinutes || totalMinutes <= 0) return '0m';
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours > 0 ? `${hours}j ${minutes}m` : `${minutes}m`;
    };

    const inputClass = "w-full border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm";

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Absensi</h2>}>
            <Head title="Laporan Absensi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* FILTER */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-indigo-500"/> Filter Data Absensi
                        </h3>
                        
                        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Mulai</label>
                                <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Akhir</label>
                                <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Pilih Teknisi</label>
                                <select value={data.user_id} onChange={e => setData('user_id', e.target.value)} className={inputClass}>
                                    <option value="">-- Semua Teknisi --</option>
                                    {technicians.map(tech => (
                                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md w-full font-semibold transition shadow-sm">
                                    Tampilkan
                                </button>
                                <button type="button" onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md w-full font-semibold transition shadow-sm flex items-center justify-center gap-2">
                                    Excel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nama Teknisi</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Jam Masuk</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Jam Keluar</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Kehadiran</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((att) => (
                                        <tr key={att.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {formatDate(att.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{att.user.name}</div>
                                                <div className="text-xs text-gray-500">{att.user.email}</div>
                                            </td>
                                            
                                            {/* JAM MASUK */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col items-start">
                                                    <span className="text-green-700 font-bold font-mono text-base">
                                                        {formatTime(att.clock_in)}
                                                    </span>
                                                    {att.status_arrival === 'late' ? (
                                                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 w-fit">
                                                            <ExclamationTriangleIcon className="w-3 h-3"/>
                                                            Telat {formatDuration(att.late_minutes)}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 w-fit">
                                                            <CheckCircleIcon className="w-3 h-3"/>
                                                            Tepat Waktu
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* JAM KELUAR */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col items-start">
                                                    <span className={`font-bold font-mono text-base ${att.clock_out ? 'text-red-600' : 'text-gray-400'}`}>
                                                        {formatTime(att.clock_out)}
                                                    </span>
                                                    {att.clock_out && (
                                                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 w-fit">
                                                            <ArrowRightOnRectangleIcon className="w-3 h-3"/> Pulang
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${att.status === 'present' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'}`}>
                                                    {att.status === 'present' ? 'HADIR' : 'ABSEN/IZIN'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic bg-gray-50">
                                            Data tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <Pagination links={attendances.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}