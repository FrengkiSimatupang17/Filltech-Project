import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-blue-600 to-blue-900">
            <div className="mb-6">
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-white" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-2xl overflow-hidden sm:rounded-xl border border-white/10">
                {children}
            </div>
            
            <div className="mt-8 text-blue-200 text-sm">
                &copy; 2025 PT. Filltech Berkah Bersama
            </div>
        </div>
    );
}