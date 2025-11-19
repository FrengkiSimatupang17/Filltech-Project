import { Link } from '@inertiajs/react';

export default function SideBarLink({ active = false, className = '', children, icon: Icon, ...props }) {
    return (
        <Link
            {...props}
            className={
                `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ` +
                (active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 '
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white ') +
                className
            }
        >
            {Icon && (
                <Icon 
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                        active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`} 
                />
            )}
            <span className="flex-1 truncate">{children}</span>
        </Link>
    );
}