import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ auth, isClockedIn, todayAttendance, history }) {

    const handleClockIn = () => {
        if (confirm('Anda yakin ingin clock-in sekarang?')) {
            router.post(route('teknisi.attendance.store'), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleClockOut = () => {
        if (confirm('Anda yakin ingin clock-out sekarang?')) {
            router.post(route('teknisi.attendance.store'), {}, {
                preserveScroll: true,
            });
        }
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        return date.toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        return date.toLocaleString('id-ID', {
            dateStyle: 'full',
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Absensi Harian</h2>}
        >
            <Head title="Absensi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium">Status Hari Ini ({formatDate(new Date())})</h3>
                            <div className="mt-4 flex flex-col md:flex-row items-center justify-between">
                                {isClockedIn ? (
                                    <>
                                        <div className="text-center md:text-left">
                                            <p className="text-xl font-semibold text-green-600">ANDA SUDAH CLOCK-IN</p>
                                            <p className="text-sm text-gray-500">
                                                Pada: {formatDateTime(todayAttendance.clock_in)}
                                            </p>
                                        </div>
                                        <DangerButton onClick={handleClockOut} className="mt-4 md:mt-0 w-full md:w-auto justify-center">
                                            Clock-Out Sekarang
                                        </DangerButton>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center md:text-left">
                                            {todayAttendance?.clock_out ? (
                                                <>
                                                    <p className="text-xl font-semibold text-gray-700">ANDA SUDAH ABSEN HARI INI</p>
                                                    <p className="text-sm text-gray-500">
                                                        Clock-in: {formatDateTime(todayAttendance.clock_in)} | Clock-out: {formatDateTime(todayAttendance.clock_out)}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-xl font-semibold text-red-600">ANDA BELUM CLOCK-IN HARI INI</p>
                                            )}
                                        </div>
                                        {!todayAttendance?.clock_out && (
                                            <PrimaryButton onClick={handleClockIn} className="mt-4 md:mt-0 w-full md:w-auto justify-center">
                                                Clock-In Sekarang
                                            </PrimaryButton>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium">Riwayat Absensi</h3>
                            <div className="mt-4 overflow-x-auto">
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
                                            <tr key={att.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(att.clock_in)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(att.clock_in)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(att.clock_out)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}