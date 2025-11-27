export default function StatusBadge({ status, className = '' }) {
    const styles = {
        // Tugas & Umum
        pending: 'bg-yellow-100 text-yellow-800',
        assigned: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        
        // Langganan
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        
        // Pembayaran
        paid: 'bg-green-100 text-green-800',
        verified: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        
        // Equipment
        available: 'bg-green-100 text-green-800',
        in_use: 'bg-blue-100 text-blue-800',
        maintenance: 'bg-orange-100 text-orange-800',
    };

    const label = status ? status.replace(/_/g, ' ').toUpperCase() : 'UNKNOWN';
    const colorClass = styles[status] || 'bg-gray-100 text-gray-600';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${colorClass} ${className}`}>
            {label}
        </span>
    );
}