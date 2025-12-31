import { json } from '@sveltejs/kit';
import { generateTransactions } from '$lib/utils/mockData';
import type { RequestHandler } from './$types';
import type { PaginatedResponse, Transaction } from '$lib/types/+page';

export const GET: RequestHandler = async ({ params, url }) => {
    const tenantId = params.id;

    // Get query params
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const status = url.searchParams.get('status'); // 'pending' | 'completed' | 'failed' | null
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Generate all transactions for this tenant
    let allTransactions = generateTransactions(tenantId, 10000);

    // Filter by status if provided
    if (status) {
        allTransactions = allTransactions.filter(t => t.status === status);
    }

    // Filter by date range if provided
    if (startDate) {
        allTransactions = allTransactions.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
        allTransactions = allTransactions.filter(t => new Date(t.date) <= new Date(endDate));
    }

    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedTransactions = allTransactions.slice(start, end);

    const response: PaginatedResponse<Transaction> = {
        total: allTransactions.length,
        page,
        pageSize,
        data: paginatedTransactions
    };

    return json(response);
};