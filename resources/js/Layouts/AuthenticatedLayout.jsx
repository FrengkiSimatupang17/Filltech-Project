import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'; // Tambah BellIcon
import SideBar from '@/Components/SideBar';
import { useEffect, useState } from 'react';

function FlashMessage({ flash }) {
    if (!flash || (!flash.success && !flash.error)) {
        return null;
    }

    const message = flash.success || flash.error;
    const type = flash.success ? 'alert-success' : 'alert-error';

    return (
        <div className="toast toast-top toast-center z-50">
            <div className={`alert ${type} shadow-lg text-white`}>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({ user, header, children }) {
    const { flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash && (flash.success || flash.error)) {
            setShowFlash(true);
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50">
            {showFlash && <FlashMessage flash={flash} />}
            
            <div className="drawer sm:drawer-open">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                
                {/* --- Konten Halaman Utama --- */}
                <div className="drawer-content flex flex-col min-h-screen">
                    
                    {/* NAVBAR ATAS (White & Clean) */}
                    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 h-16">
                        <div className="px-4 sm:px-6 lg:px-8 h-full">
                            <div className="flex justify-between items-center h-full">
                                
                                {/* Kiri: Toggle & Judul Mobile */}
                                <div className="flex items-center gap-3">
                                    <label htmlFor="my-drawer" className="btn btn-ghost btn-circle btn-sm drawer-button sm:hidden text-gray-600">
                                        <Bars3Icon className="h-6 w-6" />
                                    </label>
                                    <span className="text-lg font-bold text-gray-800 sm:hidden">Filltech</span>
                                </div>

                                {/* Kanan: User Menu & Notifikasi */}
                                <div className="flex items-center gap-4">
                                    {/* Ikon Lonceng (Hiasan) */}
                                    <button className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-blue-600">
                                        <BellIcon className="h-6 w-6" />
                                    </button>

                                    <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out focus:outline-none">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-gray-800">{user.name}</div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <div className="px-4 py-2 text-xs text-gray-400 border-b">Kelola Akun</div>
                                            <Dropdown.Link href={route('profile.edit')}>Profil Saya</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 hover:bg-red-50">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </nav>
                    
                    {/* Content Header */}
                    {header && (
                        <header className="bg-white shadow-sm border-b border-gray-100">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    
                    {/* Main Content Area */}
                    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">{children}</main>
                </div> 
                
                {/* --- SIDEBAR (Dark Mode) --- */}
                <div className="drawer-side z-40 sm:z-auto">
                    <label 
                        htmlFor="my-drawer" 
                        aria-label="close sidebar" 
                        className="drawer-overlay sm:hidden"
                    ></label>
                    <div className="w-64 min-h-full">
                        <SideBar user={user} />
                    </div>
                </div>

            </div>
        </div>
    );
}