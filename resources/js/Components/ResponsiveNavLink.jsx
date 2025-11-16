import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${
                active
                    ? 'border-white text-white bg-white/10 focus:outline-none focus:text-white focus:bg-white/20'
                    : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5 focus:outline-none focus:text-white focus:bg-white/10'
            } text-base font-medium transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}