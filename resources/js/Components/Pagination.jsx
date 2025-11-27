import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length === 3) return null;

    return (
        <nav className="flex justify-center mt-6" aria-label="Pagination">
            <div className="flex flex-wrap gap-1 justify-center">
                {links.map((link, key) => (
                    link.url === null ? (
                        <button
                            key={key}
                            className="px-4 py-3 sm:py-2 text-sm border rounded-md text-gray-400 bg-gray-50 cursor-not-allowed min-h-[44px] sm:min-h-[38px] flex items-center"
                            disabled
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            key={key}
                            href={link.url}
                            className={`px-4 py-3 sm:py-2 text-sm border rounded-md transition-colors min-h-[44px] sm:min-h-[38px] flex items-center ${
                                link.active 
                                    ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                            aria-current={link.active ? 'page' : undefined}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                ))}
            </div>
        </nav>
    );
}