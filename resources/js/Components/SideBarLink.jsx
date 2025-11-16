import { Link } from '@inertiajs/react';

export default function SideBarLink({ active = false, className = '', children, icon: Icon, ...props }) {
    return (
        <Link
            {...props}
            className={
                `flex items-center w-full p-3 rounded-lg text-base-content hover:bg-base-200 transition-colors duration-200 ` +
                (active ? '!bg-primary/20 text-primary font-semibold ' : 'font-medium ') +
                className
            }
        >
            {Icon && <Icon className="h-5 w-5 me-3 flex-shrink-0" />}
            <span className="flex-1 truncate">{children}</span>
        </Link>
    );
}