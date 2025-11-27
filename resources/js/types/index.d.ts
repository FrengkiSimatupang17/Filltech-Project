export interface User {
    id: number;
    name: string;
    email: string;
    role: 'administrator' | 'teknisi' | 'client';
    id_unik?: string;
    phone_number?: string;
    email_verified_at?: string;
    avatar?: string;
    address_detail?: string;
    // Alamat
    rt?: string;
    rw?: string;
    blok?: string;
    nomor_rumah?: string;
}

export interface Package {
    id: number;
    name: string;
    speed: string;
    price: number;
    description?: string;
}

export interface Subscription {
    id: number;
    user_id: number;
    package_id: number;
    status: 'active' | 'pending' | 'inactive' | 'cancelled';
    activated_at?: string;
    user?: User;
    package?: Package;
}

export interface Task {
    id: number;
    client_user_id: number;
    technician_user_id?: number;
    assigned_by_admin_id: number;
    title: string;
    description?: string;
    type: 'installation' | 'repair';
    status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    completed_at?: string;
    client?: User;
    technician?: User;
    client_name?: string; // Dari Controller transformation
    technician_name?: string; // Dari Controller transformation
}

export interface Equipment {
    id: number;
    name: string;
    serial_number?: string;
    status: 'available' | 'in_use' | 'maintenance' | 'lost';
}

export interface PaginatedData<T> {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export type PageProps<T = Record<string, unknown>> = T & {
    auth: {
        user: User;
        notifications: any[];
        unreadCount: number;
    };
    flash: {
        success?: string;
        error?: string;
    };
};