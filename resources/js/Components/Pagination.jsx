import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length === 3) return null;

    return (
        <nav className="flex justify-center mt-6" aria-label="Pagination">
            <div className="join">
                {links.map((link, key) => (
                    link.url === null ? (
                        <button
                            key={key}
                            className="join-item btn btn-sm btn-disabled"
                            disabled
                            aria-disabled="true"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            key={key}
                            href={link.url}
                            className={`join-item btn btn-sm ${link.active ? 'btn-primary' : 'bg-white'}`}
                            aria-current={link.active ? 'page' : undefined}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                ))}
            </div>
        </nav>
    );
}