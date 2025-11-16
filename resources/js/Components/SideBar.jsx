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
    ClockIcon
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
        { name: 'User', route: 'admin.clients.index', icon: UserGroupIcon },
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
        <div className="h-full flex flex-col p-4 bg-base-100 text-base-content">
            <Link href="/" className="mb-5 flex items-center justify-center h-16">
                <ApplicationLogo className="block h-9 w-auto" />
            </Link>
            
            <ul className="menu p-0 space-y-2">
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <SideBarLink
                            href={route(link.route)}
                            active={route().current(link.route)}
                            icon={link.icon}
                        >
                            {link.name}
                        </SideBarLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}