import Dropdown from '@/Components/Dropdown';
import { Link, usePage, router } from '@inertiajs/react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import SideBar from '@/Components/SideBar';
import { useEffect, useState } from 'react';

function FlashMessage({ flash }) {
    if (!flash || (!flash.success && !flash.error)) return null;
    
    const message = flash.success || flash.error;
    const type = flash.success ? 'alert-success' : 'alert-error';
    const iconPath = type === 'alert-success'
        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";

    return (
        <div className="toast toast-top toast-center z-50" role="alert" aria-live="assertive">
            <div className={`alert ${type} shadow-lg text-white font-medium`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
                </svg>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({ user, header, children }) {
    const { flash, auth } = usePage().props;
    const [showFlash, setShowFlash] = useState(true);
    const notifications = auth.notifications || [];
    const unreadCount = auth.unreadCount || 0;

    useEffect(() => {
        if (flash && (flash.success || flash.error)) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000); 
            return () => clearTimeout(timer);
        } else {
            setShowFlash(false);
        }
    }, [flash]);

    const handleNotificationClick = (notifId, url) => {
        router.post(route('notifications.read', notifId), {}, {
            onSuccess: () => window.location.href = url,
            onError: () => window.location.href = url
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {showFlash && <FlashMessage flash={flash} />}

            <div className="drawer sm:drawer-open">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" aria-label="Toggle Sidebar" />
                
                <div className="drawer-content flex flex-col min-h-screen">
                    <nav className="bg-white border-b border-gray-100 sticky top-0 w-full z-30 h-16" aria-label="Global Navigation">
                        <div className="px-4 sm:px-6 lg:px-8 h-full">
                            <div className="flex justify-between items-center h-full">
                                <div className="flex items-center gap-3">
                                    <label htmlFor="my-drawer" className="btn btn-ghost btn-circle btn-sm drawer-button sm:hidden text-gray-600" aria-label="Open Sidebar">
                                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                    </label>
                                    <div className="shrink-0 flex items-center">
                                        <Link href="/" aria-label="Filltech Home">
                                            <span className="text-xl font-bold text-gray-800">Filltech</span>
                                        </Link>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="ml-3 relative">
                                        <Dropdown width="60">
                                            <Dropdown.Trigger>
                                                <button 
                                                    className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-blue-600 relative"
                                                    aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
                                                >
                                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                                    {unreadCount > 0 && (
                                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full" aria-hidden="true">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </button>
                                            </Dropdown.Trigger>
                                            
                                            <Dropdown.Content align="right" width="80">
                                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                                    <span className="text-sm font-semibold text-gray-700">Notifikasi ({unreadCount})</span>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto" role="list">
                                                    {notifications.length === 0 ? (
                                                        <div className="px-4 py-3 text-sm text-gray-500 text-center" role="listitem">Tidak ada notifikasi baru.</div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <div key={notif.id} role="listitem">
                                                                <button 
                                                                    onClick={() => handleNotificationClick(notif.id, notif.data.url)}
                                                                    className={`block w-full text-left px-4 py-3 text-sm leading-5 text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out ${!notif.read_at ? 'bg-blue-50/70' : 'bg-white'}`}
                                                                >
                                                                    <div className="flex items-start gap-2">
                                                                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!notif.read_at ? 'bg-red-500' : 'bg-gray-300'}`} aria-hidden="true"></div>
                                                                        <div>
                                                                            <p className="font-medium text-gray-800">{notif.data.message}</p>
                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                {new Date(notif.created_at).toLocaleString('id-ID')}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>

                                    <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" aria-hidden="true"></div>

                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" aria-label="Menu Pengguna">
                                                <div className="text-right hidden sm:block mr-2">
                                                    <div className="text-gray-800">{user.name}</div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200" aria-hidden="true">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <svg className="ml-2 -mr-0.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <div className="px-4 py-2 text-xs text-gray-400 border-b">Kelola Akun</div>
                                            <Dropdown.Link href={route('profile.edit')}>Profil Saya</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 hover:bg-red-50">Log Out</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </nav>
                    
                    {header && (
                        <header className="bg-white shadow-sm border-b border-gray-100 pt-16 sm:pt-0"> 
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    
                    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8" role="main">
                        {children}
                    </main>
                </div> 
                
                <div className="drawer-side z-40 sm:z-auto">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay sm:hidden"></label>
                    <aside className="w-64 min-h-full bg-gray-900 text-white">
                        <SideBar user={user} />
                    </aside>
                </div>
            </div>
        </div>
    );
}