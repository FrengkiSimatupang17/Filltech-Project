import Dropdown from '@/Components/Dropdown';
import { Link } from '@inertiajs/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import SideBar from '@/Components/SideBar';

export default function AuthenticatedLayout({ user, header, children }) {

    return (
        <div className="min-h-screen bg-base-200">
            <div className="drawer sm:drawer-open">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                
                {/* --- Konten Halaman --- */}
                <div className="drawer-content flex flex-col">
                    
                    {/* Navbar Atas (Sticky) */}
                    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                
                                {/* Tombol Toggle Mobile */}
                                <div className="flex items-center sm:hidden">
                                    <label htmlFor="my-drawer" className="btn btn-ghost btn-circle drawer-button">
                                        <Bars3Icon className="h-6 w-6" />
                                    </label>
                                </div>
                                
                                {/* Spacer (agar dropdown ke kanan) */}
                                <div className="flex-1"></div>

                                {/* Dropdown User (Kanan) */}
                                <div className="flex items-center ms-6">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profil</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </nav>
                    
                    {/* Header Halaman (di bawah Navbar) */}
                    {header && (
                        <header className="bg-white shadow">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                        </header>
                    )}
                    
                    {/* Konten Utama */}
                    <main>{children}</main>
                </div> 
                
                {/* --- Sidebar --- */}
                {/* z-40: Menurunkan z-index agar di bawah modal (z-50) */}
                <div className="drawer-side z-40">
                    
                    {/* PENTING: sm:hidden -> Menyembunyikan overlay di desktop
                       Inilah yang memperbaiki bug "modal berkedip".
                    */}
                    <label 
                        htmlFor="my-drawer" 
                        aria-label="close sidebar" 
                        className="drawer-overlay sm:hidden"
                    ></label>
                    
                    <div className="w-64 min-h-full bg-base-100 border-r border-base-200">
                        <SideBar user={user} />
                    </div>
                </div>

            </div>
        </div>
    );
}