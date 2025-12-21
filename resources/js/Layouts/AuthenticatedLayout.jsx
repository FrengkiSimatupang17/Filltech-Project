import Dropdown from '@/Components/Dropdown';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    Bars3Icon, 
    BellIcon, 
    CheckCircleIcon, 
    ExclamationCircleIcon, 
    BanknotesIcon, 
    InformationCircleIcon 
} from '@heroicons/react/24/outline';
import SideBar from '@/Components/SideBar';
import { useEffect, useState } from 'react';

// Komponen Toast / Flash Message
function FlashMessage({ flash }) {
    if (!flash || (!flash.success && !flash.error)) {
        return null;
    }
    
    const message = flash.success || flash.error;
    const type = flash.success ? 'alert-success' : 'alert-error';
    
    const iconPath = type === 'alert-success'
        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";

    return (
        <div className="toast toast-top toast-center z-[100]">
            <div className={`alert ${type} shadow-lg text-white font-medium flex items-center gap-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
                </svg>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({ user, header, children }) {
    // === 1. AMBIL DATA DARI PROPS (ROOT LEVEL) ===
    // Sesuai dengan perubahan di Middleware HandleInertiaRequests.php
    const { flash, auth, notifications, unreadCount } = usePage().props;

    // === 2. SIAPKAN VARIABEL AMAN (FALLBACK) ===
    const notifList = notifications || [];
    const notifCount = unreadCount || 0;
    const [showFlash, setShowFlash] = useState(true);

    // Timer untuk Flash Message
    useEffect(() => {
        if (flash && (flash.success || flash.error)) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000); 
            return () => clearTimeout(timer);
        } else {
            setShowFlash(false);
        }
    }, [flash]);

    // Handle klik notifikasi (Tandai sudah dibaca -> Redirect)
    const handleNotificationClick = (notifId, url) => {
        router.post(route('notifications.read', notifId), {}, {
            onSuccess: () => {
                if(url) window.location.href = url;
            },
            onError: () => {
                if(url) window.location.href = url;
            }
        });
    };

    // Helper ikon notifikasi
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'payment_verified':
                return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
            case 'invoice':
                return <BanknotesIcon className="w-6 h-6 text-blue-500" />;
            case 'alert':
                return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
            default:
                return <InformationCircleIcon className="w-6 h-6 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            
            {showFlash && <FlashMessage flash={flash} />}

            <div className="drawer sm:drawer-open">
                
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                
                <div className="drawer-content flex flex-col min-h-screen">
                    
                    {/* --- NAVBAR --- */}
                    <nav className="bg-white border-b border-gray-200 sticky top-0 w-full z-40 h-16 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                            <div className="flex justify-between items-center h-full">
                                
                                {/* Sidebar Toggle (Mobile) */}
                                <div className="flex items-center gap-3">
                                    <label htmlFor="my-drawer" className="btn btn-ghost btn-circle btn-sm lg:hidden text-gray-600">
                                        <Bars3Icon className="h-6 w-6" />
                                    </label>
                                </div>
                                
                                {/* Right Side Icons */}
                                <div className="flex items-center gap-2 sm:gap-4">
                                    
                                    {/* === NOTIFICATION DROPDOWN === */}
                                    <div className="relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button className="btn btn-ghost btn-circle btn-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 relative transition-colors">
                                                    <BellIcon className="h-6 w-6" />
                                                    {/* Gunakan variabel notifCount */}
                                                    {notifCount > 0 && (
                                                        <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[8px] text-white justify-center items-center font-bold"></span>
                                                        </span>
                                                    )}
                                                </button>
                                            </Dropdown.Trigger>
                                            
                                            <Dropdown.Content align="right" width="w-80 sm:w-96">
                                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                                    <span className="text-sm font-bold text-gray-700">Notifikasi</span>
                                                    {notifCount > 0 && (
                                                        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                            {notifCount} Baru
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 bg-white">
                                                    {/* Gunakan notifList untuk looping */}
                                                    {notifList.length === 0 ? (
                                                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                                                            <div className="bg-gray-100 p-3 rounded-full mb-3">
                                                                <BellIcon className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                            <p className="text-sm text-gray-500 font-medium">Tidak ada notifikasi baru</p>
                                                        </div>
                                                    ) : (
                                                        notifList.map((notif) => (
                                                            <button
                                                                key={notif.id}
                                                                onClick={() => handleNotificationClick(notif.id, notif.data.url)}
                                                                className={`w-full text-left px-4 py-4 border-b border-gray-50 transition-all duration-200 flex items-start gap-3 hover:bg-gray-50 group ${
                                                                    !notif.read_at ? 'bg-blue-50/50' : 'bg-white'
                                                                }`}
                                                            >
                                                                <div className={`flex-shrink-0 p-2 rounded-full ${!notif.read_at ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                                                                    {getNotificationIcon(notif.data.type)}
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm leading-snug ${!notif.read_at ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                                        {notif.data.message}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                                                        {new Date(notif.created_at).toLocaleString('id-ID', { 
                                                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                                                                        })}
                                                                    </p>
                                                                </div>

                                                                {!notif.read_at && (
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                                )}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                    {/* === END NOTIFICATION === */}

                                    <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                                    {/* === USER DROPDOWN === */}
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-transparent hover:bg-gray-100 transition-colors focus:outline-none group">
                                                <div className="text-right hidden sm:block leading-tight mr-1">
                                                    <div className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition">{user.name}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{user.role}</div>
                                                </div>
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white">
                                                    {user.name.charAt(0)}
                                                </div>
                                            </button>
                                        </Dropdown.Trigger>
                                        
                                        <Dropdown.Content>
                                            <div className="px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider border-b bg-gray-50">
                                                Pengaturan Akun
                                            </div>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Profil Saya
                                            </Dropdown.Link>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 hover:bg-red-50">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </nav>
                    
                    {/* Page Header */}
                    {header && (
                        <header className="bg-white shadow-sm border-b border-gray-100 pt-6 pb-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    
                    {/* Page Content */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                </div> 
                
                {/* Sidebar Drawer */}
                <div className="drawer-side z-50 sm:z-auto">
                    <label htmlFor="my-drawer" className="drawer-overlay sm:hidden"></label>
                    <div className="w-64 min-h-full bg-gray-900 text-white shadow-xl">
                        <SideBar user={user} />
                    </div>
                </div>

            </div>
        </div>
    );
}