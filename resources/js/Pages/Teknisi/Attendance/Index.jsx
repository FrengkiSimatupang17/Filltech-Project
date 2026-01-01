import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { MapPinIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, todayAttendance, history, officeLocation }) {
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        latitude: '',
        longitude: '',
        type: 'clock_in', // default
    });

    const handleAttendance = (type) => {
        setLocating(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Browser Anda tidak mendukung Geolocation.");
            setLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Set data dan kirim
                setData({ ...data, latitude: lat, longitude: lng, type: type });
                
                // Gunakan helper form Inertia untuk post manual agar state terupdate dulu
                // Note: Karena setData async, lebih aman passing payload langsung ke post
                post(route('teknisi.attendance.store'), {
                    data: { latitude: lat, longitude: lng, type: type },
                    onFinish: () => setLocating(false)
                });
            },
            (error) => {
                console.error(error);
                setLocationError("Gagal mengambil lokasi. Pastikan GPS aktif.");
                setLocating(false);
            },
            { enableHighAccuracy: true } // Wajib presisi tinggi
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Absensi Harian</h2>}
        >
            <Head title="Absensi" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="max-w-lg mx-auto px-4">
                    
                    {/* STATUS CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center mb-6">
                        <p className="text-gray-500 text-sm font-bold uppercase mb-1">Status Hari Ini</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h3>
                        
                        {todayAttendance ? (
                            <div className="flex justify-center gap-4 mt-4">
                                <div className="bg-green-50 p-3 rounded-xl border border-green-100 w-1/2">
                                    <p className="text-xs text-green-600 font-bold uppercase">Masuk</p>
                                    <p className="text-xl font-mono font-bold text-green-800">
                                        {todayAttendance.clock_in ? new Date(todayAttendance.clock_in).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '-'}
                                    </p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 w-1/2">
                                    <p className="text-xs text-orange-600 font-bold uppercase">Pulang</p>
                                    <p className="text-xl font-mono font-bold text-orange-800">
                                        {todayAttendance.clock_out ? new Date(todayAttendance.clock_out).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '-'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 bg-gray-100 py-2 rounded-lg text-gray-500 text-sm font-medium">
                                Belum Absen Masuk
                            </div>
                        )}
                    </div>

                    {/* ERROR MESSAGE */}
                    {(locationError || errors.location) && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3">
                            <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
                            <p className="text-sm font-medium">{locationError || errors.location}</p>
                        </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-1 gap-4 mb-8">
                        {!todayAttendance && (
                            <button
                                onClick={() => handleAttendance('clock_in')}
                                disabled={locating || processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 transition transform active:scale-95"
                            >
                                {locating ? (
                                    <span className="animate-pulse">Mencari Lokasi...</span>
                                ) : (
                                    <>
                                        <MapPinIcon className="w-6 h-6" /> ABSEN MASUK
                                    </>
                                )}
                            </button>
                        )}

                        {todayAttendance && !todayAttendance.clock_out && (
                            <button
                                onClick={() => handleAttendance('clock_out')}
                                disabled={locating || processing}
                                className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 flex items-center justify-center gap-3 transition transform active:scale-95"
                            >
                                {locating ? (
                                    <span className="animate-pulse">Mencari Lokasi...</span>
                                ) : (
                                    <>
                                        <ClockIcon className="w-6 h-6" /> ABSEN PULANG
                                    </>
                                )}
                            </button>
                        )}
                        
                        {todayAttendance && todayAttendance.clock_out && (
                            <div className="text-center text-green-600 font-bold p-4 bg-green-50 rounded-xl border border-green-200">
                                Anda sudah menyelesaikan absensi hari ini.
                            </div>
                        )}
                    </div>

                    {/* HISTORY LIST */}
                    <div>
                        <h4 className="font-bold text-gray-700 mb-3 ml-1">Riwayat 5 Hari Terakhir</h4>
                        <div className="space-y-3">
                            {history.map((att) => (
                                <div key={att.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {new Date(att.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Masuk: {att.clock_in ? new Date(att.clock_in).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}) : '-'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${att.clock_out ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {att.clock_out ? 'Selesai' : 'Aktif'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}