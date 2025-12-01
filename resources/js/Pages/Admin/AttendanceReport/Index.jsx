import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Pagination from '@/Components/Pagination';
import InputLabel from '@/Components/InputLabel';
import EmptyState from '@/Components/EmptyState';
import { FaFilePdf, FaClock, FaUserClock } from 'react-icons/fa';

export default function AttendanceReportIndex({ auth, history, technicians, filters }) {
    const [selectedTechnician, setSelectedTechnician] = useState(filters.technician_id || '');

    const handleFilterChange = (e) => {
        const val = e.target.value;
        setSelectedTechnician(val);
        router.get(route('admin.attendance.report.index'), { technician_id: val }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        const url = route('admin.attendance.report.export', { technician_id: selectedTechnician });
        window.open(url, '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Absensi Teknisi</h2>}
        >
            <Head title="Laporan Absensi" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filter & Action */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="w-full md:w-1/3">
                            <InputLabel htmlFor="tech_filter" value="Filter Teknisi" />
                            <SelectInput
                                id="tech_filter"
                                className="mt-1 block w-full"
                                value={selectedTechnician}
                                onChange={handleFilterChange}
                            >
                                <option value="">Semua Teknisi</option>
                                {technicians.map((tech) => (
                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                ))}
                            </SelectInput>
                        </div>
                        <div className="w-full md:w-auto">
                            <PrimaryButton onClick={handleExport} className="w-full justify-center bg-red-600 hover:bg-red-700">
                                <FaFilePdf className="mr-2" /> Download PDF
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {history.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Teknisi</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Masuk</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Pulang</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {history.data.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.technician_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono">{item.clock_in}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.is_late ? (
                                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">TERLAMBAT</span>
                                                        ) : (
                                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">TEPAT WAKTU</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{item.clock_out}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 border-t border-gray-100">
                                    <Pagination links={history.links} />
                                </div>
                            </>
                        ) : (
                            <EmptyState title="Tidak Ada Data" message="Belum ada data absensi yang tercatat sesuai filter ini." />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}