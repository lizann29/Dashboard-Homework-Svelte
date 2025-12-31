export type DataState<T> = {
    loading: boolean;
    data: T;
    error: string | null;
    lastFetched?: number;
};

export type Tenant = {
    id: string;
    name: string;
};

export type User = {
    id: string;
    tenantId: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    active: boolean;
};

export type Transaction = {
    id: string;
    tenantId: string;
    amount: number;
    description: string;
    date: string;
    status: 'pending' | 'completed' | 'failed';
};

export type PaginatedResponse<T> = {
    total: number;
    page: number;
    pageSize: number;
    data: T[];
};

export type Routes = {
    name: string;
    path: string;
    icon: string;
};