import type { PaginatedResponse, Transaction } from '$lib/types/+page';

export type FetchTransactionsParams = {
    tenantId: string;
    page: number;
    pageSize: number;
    status?: 'pending' | 'completed' | 'failed' | null;
    startDate?: string | null;
    endDate?: string | null;
};

export async function fetchTransactions(params: FetchTransactionsParams): Promise<PaginatedResponse<Transaction>> {
    const { tenantId, page, pageSize, status, startDate, endDate } = params;

    const url = new URL(`/api/tenants/${tenantId}/transactions`, window.location.origin);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('pageSize', pageSize.toString());

    if (status) {
        url.searchParams.set('status', status);
    }

    if (startDate) {
        url.searchParams.set('startDate', startDate);
    }

    if (endDate) {
        url.searchParams.set('endDate', endDate);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    return response.json();
}