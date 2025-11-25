import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length === 3) return null; // Jangan tampilkan jika hanya ada 1 halaman

    return (
        <div className="flex justify-center mt-6">
            <div className="join">
                {links.map((link, key) => (
                    link.url === null ? (
                        <button
                            key={key}
                            className="join-item btn btn-sm btn-disabled"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            key={key}
                            href={link.url}
                            className={`join-item btn btn-sm ${link.active ? 'btn-primary' : 'bg-white'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                ))}
            </div>
        </div>
    );
}