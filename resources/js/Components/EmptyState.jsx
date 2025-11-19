import { InboxIcon } from '@heroicons/react/24/outline';

export default function EmptyState({ title, message, children }) {
    return (
        <div className="text-center py-12">
            <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            <div className="mt-6">
                {children}
            </div>
        </div>
    );
}