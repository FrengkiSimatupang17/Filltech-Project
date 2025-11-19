import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import SideBarLink from '@/Components/SideBarLink';

import { 
    HomeIcon, 
    UserGroupIcon, 
    WifiIcon, 
    ChartBarIcon,
    CreditCardIcon,
    BookmarkIcon,
    WrenchIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    ExclamationCircleIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    WrenchScrewdriverIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon // Ikon Logout
} from '@heroicons/react/24/outline';

export default function SideBar({ user }) {
    
    const adminLinks = [
        { name: 'Dashboard', route: 'dashboard', icon: HomeIcon },
        { name: 'Laporan', route: 'admin.reports.index', icon: ChartBarIcon },
        { name: 'Verifikasi', route: 'admin.payments.index', icon: CreditCardIcon },
        { name: 'Tugas', route: 'admin.tasks.index', icon: ClipboardDocumentListIcon },
        { name: 'Langganan', route: 'admin.subscriptions.index', icon: BookmarkIcon },
        { name: 'Alat', route: 'admin.equipment.index', icon: WrenchIcon },
        { name: 'Paket', route: 'admin.packages.index', icon: WifiIcon },
        
        { label: 'MANAJEMEN USER' },
        { name: 'Klien', route: 'admin.clients.index', icon: UserIcon }, 
        { name: 'Teknisi', route: 'admin.technicians.index', icon: WrenchScrewdriverIcon },
        
        { label: 'SYSTEM' },
        { name: 'Activity Log', route: 'admin.activity-log.index', icon: DocumentTextIcon },
    ];

    const clientLinks = [
        { name: 'Dashboard', route: 'dashboard', icon: HomeIcon },
        { name: 'Langganan', route: 'client.subscribe.index', icon: WifiIcon },
        { name: 'Tagihan', route: 'client.invoices.index', icon: CurrencyDollarIcon },
        { name: 'Aduan', route: 'client.complaints.index', icon: ExclamationCircleIcon },
    ];
    
    const teknisiLinks = [
         { name: 'Dashboard', route: 'dashboard', icon: HomeIcon },
         { name: 'Tugas Saya', route: 'teknisi.tasks.index', icon: ClipboardDocumentListIcon },
         { name: 'Absensi', route: 'teknisi.attendance.index', icon: ClockIcon },
         { name: 'Alat', route: 'teknisi.equipment.index', icon: WrenchIcon },
    ];

    let navLinks = [];
    if (user.role === 'administrator') navLinks = adminLinks;
    if (user.role === 'client') navLinks = clientLinks;
    if (user.role === 'teknisi') navLinks = teknisiLinks;

    return (
        // PERBAIKAN: min-h-screen agar sidebar selalu full ke bawah
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            
            {/* Logo Area */}
            <div className="flex items-center justify-center h-20 border-b border-gray-800 bg-gray-900">
                <Link href="/" className="flex items-center gap-3">
                    <ApplicationLogo className="block h-8 w-auto text-blue-500 fill-current" />
                    <span className="text-xl font-bold tracking-wide text-white">FILLTECH</span>
                </Link>
            </div>
            
            {/* Menu Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
                {navLinks.map((link, index) => (
                    link.label ? (
                        <div key={index} className="px-4 mt-8 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            {link.label}
                        </div>
                    ) : (
                        <SideBarLink
                            key={link.name}
                            href={route(link.route)}
                            active={route().current(link.route)}
                            icon={link.icon}
                        >
                            {link.name}
                        </SideBarLink>
                    )
                ))}
            </div>

            {/* User Info Bottom (Fixed at bottom) */}
            <div className="p-4 border-t border-gray-800 bg-gray-800/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>
                <Link 
                    href={route('logout')} 
                    method="post" 
                    as="button" 
                    className="btn btn-outline btn-error btn-sm w-full flex items-center gap-2 text-white hover:bg-red-600 hover:border-red-600"
                >
                    <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                    Log Out
                </Link>
            </div>
        </div>
    );
}