
import type { PaginatedResponse, User } from '$lib/types/+page';

export type FetchUsersParams = {
    tenantId: string;
    page: number;
    pageSize: number;
    role?: 'admin' | 'user' | null;
};

export async function fetchUsers(params: FetchUsersParams): Promise<PaginatedResponse<User>> {
    const { tenantId, page, pageSize, role } = params;

    const url = new URL(`/api/tenants/${tenantId}/users`, window.location.origin);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('pageSize', pageSize.toString());

    if (role) {
        url.searchParams.set('role', role);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return response.json();
}