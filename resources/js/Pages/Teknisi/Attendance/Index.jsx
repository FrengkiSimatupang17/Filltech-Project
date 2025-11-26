import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import { FaClock, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaHourglassEnd, FaUserClock } from 'react-icons/fa';

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

    const handleClock = () => {
        const action = isClockedIn ? 'Clock-Out' : 'Clock-In';
        if (confirm(`Anda yakin ingin melakukan ${action} sekarang?`)) {
            router.post(route('teknisi.attendance.store'), {}, {
                preserveScroll: true,
                onSuccess: () => router.reload({ only: ['isClockedIn', 'todayAttendance', 'history'] })
            });
        }
    };

    const StatusDisplay = () => {
        if (isClockedIn) {
            return (
                <>
                    <p className="text-xl font-semibold text-green-600 flex items-center gap-2 justify-center md:justify-start">
                        <FaCheckCircle /> ANDA SUDAH CLOCK-IN
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Pada: {todayAttendance.clock_in}</p>
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

            <div className="py-6 sm:py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* SECTION 1: STATUS HARI INI */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg border border-gray-200">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold border-b pb-3 mb-4">Status Hari Ini</h3>
                            
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                
                                <div className="w-full text-center md:text-left">
                                    <StatusDisplay />
                                </div>
                                
                                {/* Action Button */}
                                <div className="w-full md:w-auto flex justify-center md:justify-end">
                                    {isClockedIn ? (
                                        <DangerButton onClick={handleClock} className="w-full md:w-auto justify-center">
                                            Clock-Out Sekarang
                                        </DangerButton>
                                    ) : (
                                        !todayAttendance?.clock_out && (
                                            <PrimaryButton onClick={handleClock} className="w-full md:w-auto justify-center">
                                                Clock-In Sekarang
                                            </PrimaryButton>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: RIWAYAT ABSENSI */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6 text-gray-900 border-b bg-gray-50/50">
                            <h3 className="text-lg font-bold">Riwayat Kehadiran</h3>
                        </div>

                        <div className="p-4 sm:p-6">
                            {history.data.length > 0 ? (
                                <>
                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock-In</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock-Out</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {history.data.map((att) => (
                                                    <tr key={att.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{att.date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{att.clock_in}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{att.clock_out}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="md:hidden space-y-3">
                                        {history.data.map(att => <HistoryCard key={att.id} att={att} />)}
                                    </div>

                                    <div className="mt-6">
                                        <Pagination links={history.links} />
                                    </div>
                                </>
                            ) : (
                                <EmptyState title="Belum Ada Riwayat" message="Teknisi belum mencatat kehadiran." />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}