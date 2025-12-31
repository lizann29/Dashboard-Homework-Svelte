import { json } from '@sveltejs/kit';
import { generateUsers } from '$lib/utils/mockData';
import type { RequestHandler } from './$types';
import type { PaginatedResponse, User } from '$lib/types/+page';

export const GET: RequestHandler = async ({ params, url }) => {
    const tenantId = params.id;

    // Get query params
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const role = url.searchParams.get('role'); // 'admin' | 'user' | null

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Generate all users for this tenant
    let allUsers = generateUsers(tenantId, 1000);

    // Filter by role if provided
    if (role) {
        allUsers = allUsers.filter(u => u.role === role);
    }

    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = allUsers.slice(start, end);

    const response: PaginatedResponse<User> = {
        total: allUsers.length,
        page,
        pageSize,
        data: paginatedUsers
    };

    return json(response);
};