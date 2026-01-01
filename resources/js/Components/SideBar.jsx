import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import SideBarLink from '@/Components/SideBarLink';

import { 
    HomeIcon, 
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
    ClipboardDocumentCheckIcon // Icon untuk Absensi
} from '@heroicons/react/24/outline';

export default function SideBar({ user }) {
    
    // --- SUSUNAN MENU ADMIN PER KATEGORI ---
    const adminLinks = [
        { name: 'Dashboard', route: 'dashboard', icon: HomeIcon },

        { label: 'LAYANAN & TRANSAKSI' },
        { name: 'Langganan', route: 'admin.subscriptions.index', icon: BookmarkIcon },
        { name: 'Verifikasi Bayar', route: 'admin.payments.index', icon: CreditCardIcon },
        { name: 'Monitoring Tugas', route: 'admin.tasks.index', icon: ClipboardDocumentListIcon },
        
        { label: 'MASTER DATA' },
        { name: 'Paket Internet', route: 'admin.packages.index', icon: WifiIcon },
        { name: 'Inventaris Alat', route: 'admin.equipment.index', icon: WrenchIcon },
        
        { label: 'MANAJEMEN USER' },
        { name: 'Data Klien', route: 'admin.clients.index', icon: UserIcon }, 
        { name: 'Data Teknisi', route: 'admin.technicians.index', icon: WrenchScrewdriverIcon },
        
        { label: 'REPORT & SYSTEM' },
        { name: 'Laporan Keuangan', route: 'admin.reports.index', icon: ChartBarIcon },
        { name: 'Laporan Absensi', route: 'admin.attendance.report.index', icon: ClipboardDocumentCheckIcon },
        { name: 'Activity Log', route: 'admin.activity-log.index', icon: DocumentTextIcon },
    ];

    // --- MENU CLIENT ---
    const clientLinks = [
        { name: 'Dashboard', route: 'dashboard', icon: HomeIcon },
        { label: 'TAGIHAN & LAYANAN' },
        { name: 'Langganan Saya', route: 'client.subscribe.index', icon: WifiIcon },
        { name: 'Riwayat Tagihan', route: 'client.invoices.index', icon: CurrencyDollarIcon },
        { name: 'Aduan / Komplain', route: 'client.complaints.index', icon: ExclamationCircleIcon },
    ];
    
    // --- MENU TEKNISI ---
    const teknisiLinks = [
         { name: 'Dashboard', route: 'dashboard', icon: HomeIcon },
         { label: 'OPERASIONAL' },
         { name: 'Tugas Saya', route: 'teknisi.tasks.index', icon: ClipboardDocumentListIcon },
         { name: 'Absensi Harian', route: 'teknisi.attendance.index', icon: ClockIcon },
         { name: 'Stok Alat', route: 'teknisi.equipment.index', icon: WrenchIcon },
    ];

    let navLinks = [];
    if (user.role === 'administrator') navLinks = adminLinks; // Pastikan role di DB 'administrator' atau 'admin' sesuaikan
    if (user.role === 'client') navLinks = clientLinks;
    if (user.role === 'teknisi') navLinks = teknisiLinks;

    // Fallback jika role admin disimpan sebagai 'admin' bukan 'administrator'
    if (user.role === 'admin') navLinks = adminLinks;

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white border-r border-gray-800 w-64 transition-all duration-300">
            
            {/* LOGO HEADER */}
            <div className="flex items-center justify-center h-16 flex-shrink-0 border-b border-gray-800 bg-gray-900 shadow-md">
                <Link href={route('dashboard')} className="flex items-center gap-3 hover:opacity-80 transition">
                    <ApplicationLogo className="block h-8 w-auto text-blue-500 fill-current" />
                    <span className="text-xl font-bold tracking-wide text-white">FILLTECH</span>
                </Link>
            </div>
            
            {/* SCROLLABLE MENU */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
                {navLinks.map((link, index) => (
                    link.label ? (
                        <div key={index} className="px-4 mt-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-1">
                            {link.label}
                        </div>
                    ) : (
                        <SideBarLink
                            key={link.name}
                            href={route(link.route)}
                            // Logic Active: Cek apakah route sekarang mengandung string route menu (misal: 'admin.tasks' cocok dgn 'admin.tasks.edit')
                            active={route().current(link.route.replace('.index', '*'))} 
                            icon={link.icon}
                        >
                            {link.name}
                        </SideBarLink>
                    )
                ))}
            </div>

            {/* USER INFO FOOTER (Opsional, agar sidebar terlihat penuh) */}
            <div className="p-4 border-t border-gray-800 bg-gray-900">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div className="text-sm overflow-hidden">
                        <p className="font-bold truncate">{user.name}</p>
                        <p className="text-gray-500 text-xs capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}