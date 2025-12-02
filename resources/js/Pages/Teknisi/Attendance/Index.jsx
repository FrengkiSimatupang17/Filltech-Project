import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import LoadingOverlay from '@/Components/LoadingOverlay';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaHourglassEnd, FaUserClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

const HistoryCard = ({ att }) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1">
                <FaCalendarAlt className="text-blue-500" /> {att.date}
            </h4>
            {att.clock_out !== '-' ? (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Selesai</span>
            ) : (
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Belum Selesai</span>
            )}
        </div>
        <div className="text-xs text-gray-600 space-y-1 border-t pt-2 mt-2">
            <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1"><FaCheckCircle /> Masuk:</span>
                <span className="font-semibold text-gray-700">{att.clock_in}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1"><FaHourglassEnd /> Keluar:</span>
                <span className="font-semibold text-gray-700">{att.clock_out}</span>
            </div>
        </div>
    </div>
);

export default function Index({ auth, isClockedIn, todayAttendance, history }) {
    const [processing, setProcessing] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Koordinat Kantor PT Filltech Berkah Bersama (Sagulung, Batam)
    const OFFICE_LAT = 1.0427411;
    const OFFICE_LNG = 103.9455038;
    const MAX_RADIUS_METERS = 100; 

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Radius bumi (meter)
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; 
    };

    const handleClock = () => {
        const action = isClockedIn ? 'Clock-Out' : 'Clock-In';
        setLocationError(null);

        if (!confirm(`Anda yakin ingin melakukan ${action} sekarang? Pastikan Anda berada di kantor.`)) return;

        if (!navigator.geolocation) {
            alert("Browser Anda tidak mendukung fitur lokasi.");
            return;
        }

        setProcessing(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const distance = calculateDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);

                // Validasi Jarak di Frontend
                if (distance > MAX_RADIUS_METERS) {
                    setProcessing(false);
                    const msg = `Gagal! Anda berada ${Math.round(distance)}m dari kantor. (Maksimal ${MAX_RADIUS_METERS}m)`;
                    setLocationError(msg);
                    alert(msg);
                    return;
                }

                // Kirim ke Backend
                router.post(route('teknisi.attendance.store'), {
                    latitude: latitude,
                    longitude: longitude
                }, {
                    preserveScroll: true,
                    onSuccess: () => setProcessing(false),
                    onError: (errors) => {
                        setProcessing(false);
                        if (errors.location) {
                            setLocationError(errors.location);
                            alert(errors.location);
                        }
                    }
                });
            },
            (error) => {
                setProcessing(false);
                let msg = "Gagal mengambil lokasi.";
                // Penanganan Error Izin
                if (error.code === 1) msg = "Izin lokasi ditolak. Mohon izinkan akses lokasi di pengaturan browser.";
                else if (error.code === 2) msg = "Sinyal GPS tidak tersedia.";
                else if (error.code === 3) msg = "Waktu permintaan lokasi habis.";
                
                setLocationError(msg);
                alert(msg);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const StatusDisplay = () => {
        if (isClockedIn) {
            return (
                <>
                    <p className="text-xl font-semibold text-green-600 flex items-center gap-2 justify-center md:justify-start">
                        <FaCheckCircle /> ANDA SUDAH CLOCK-IN
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Masuk Pukul: {todayAttendance.clock_in}</p>
                </>
            );
        }
        
        if (todayAttendance?.clock_out) {
            return (
                <>
                    <p className="text-xl font-semibold text-gray-700 flex items-center gap-2 justify-center md:justify-start">
                        <FaUserClock /> ABSENSI HARI INI SELESAI
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Masuk: {todayAttendance.clock_in} | Keluar: {todayAttendance.clock_out}
                    </p>
                </>
            );
        }

        return (
            <p className="text-xl font-semibold text-red-600 flex items-center gap-2 justify-center md:justify-start">
                <FaTimesCircle /> ANDA BELUM CLOCK-IN
            </p>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Absensi Harian</h2>}
        >
            <Head title="Absensi" />
            
            <LoadingOverlay show={processing} message="Memverifikasi Lokasi..." />

            <div className="py-6 sm:py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* SECTION 1: STATUS */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg border border-gray-200">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold border-b pb-3 mb-4 flex justify-between items-center">
                                Status Kehadiran
                                <span className="text-xs font-normal bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 flex items-center gap-1">
                                    <FaMapMarkerAlt /> Lokasi Terkunci
                                </span>
                            </h3>
                            
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="w-full text-center md:text-left">
                                    <StatusDisplay />
                                    {locationError && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 font-medium">
                                            ⚠️ {locationError}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="w-full md:w-auto flex justify-center md:justify-end">
                                    {isClockedIn ? (
                                        <DangerButton onClick={handleClock} className="w-full md:w-auto justify-center h-12 text-base" disabled={processing}>
                                            Clock-Out Sekarang
                                        </DangerButton>
                                    ) : (
                                        !todayAttendance?.clock_out && (
                                            <PrimaryButton onClick={handleClock} className="w-full md:w-auto justify-center h-12 text-base" disabled={processing}>
                                                Clock-In Sekarang
                                            </PrimaryButton>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: RIWAYAT */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6 text-gray-900 border-b bg-gray-50/50">
                            <h3 className="text-lg font-bold">Riwayat 30 Hari Terakhir</h3>
                        </div>

                        <div className="p-4 sm:p-6">
                            {history.data.length > 0 ? (
                                <>
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Masuk</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keluar</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {history.data.map((att) => (
                                                    <tr key={att.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{att.date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-mono">{att.clock_in}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-mono">{att.clock_out}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="md:hidden space-y-3">
                                        {history.data.map(att => <HistoryCard key={att.id} att={att} />)}
                                    </div>
                                    <div className="mt-6">
                                        <Pagination links={history.links} />
                                    </div>
                                </>
                            ) : (
                                <EmptyState title="Belum Ada Data" message="Riwayat absensi Anda masih kosong." />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}