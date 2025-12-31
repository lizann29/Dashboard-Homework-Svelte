import type { Transaction, PaginatedResponse } from '$lib/types/+page';
import { currentTenantId } from "$lib/stores/tenants.svelte";
import {fetchTransactions} from "$lib/services/transactions.svelte";

// Cache structure
type TransactionsCache = {
    [tenantId: string]: {
        pages: {
            [pageKey: string]: {
                data: Transaction[];
                total: number;
                lastFetched: number;
            }
        }
    }
};

type TransactionsFilters = {
    status: 'pending' | 'completed' | 'failed' | null;
    startDate: string | null;
    endDate: string | null;
};

// State
let transactionsCache = $state<TransactionsCache>({});
let currentPage = $state(1);
let pageSize = $state(20);
let filters = $state<TransactionsFilters>({
    status: null,
    startDate: null,
    endDate: null
});
let loading = $state(false);
let error = $state<string | null>(null);

// Helper
function getCacheKey(page: number, filterState: TransactionsFilters): string {
    return `page-${page}-status-${filterState.status || 'all'}-start-${filterState.startDate || 'none'}-end-${filterState.endDate || 'none'}`;
}

// Export state
export const transactionsState = {
    get loading() { return loading; },
    get error() { return error; },
    get page() { return currentPage; },
    get pageSize() { return pageSize; },
    get filters() { return filters; }
};

// Get current data
export function getCurrentTransactionsData() {
    const tenantId = currentTenantId.value;
    if (!tenantId) return { data: [], total: 0, lastFetched: undefined };

    const tenantCache = transactionsCache[tenantId];
    if (!tenantCache) return { data: [], total: 0, lastFetched: undefined };

    const cacheKey = getCacheKey(currentPage, filters);
    const pageData = tenantCache.pages[cacheKey];

    if (!pageData) return { data: [], total: 0, lastFetched: undefined };

    return {
        data: pageData.data,
        total: pageData.total,
        lastFetched: pageData.lastFetched
    };
}

// Load transactions
export async function loadTransactions(tenantId: string) {
    const cacheKey = getCacheKey(currentPage, filters);

    if (transactionsCache[tenantId]?.pages[cacheKey]) {
        return;
    }

    loading = true;
    error = null;

    try {
        const response: PaginatedResponse<Transaction> = await fetchTransactions({
            tenantId,
            page: currentPage,
            pageSize: pageSize,
            status: filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate
        });

        if (!transactionsCache[tenantId]) {
            transactionsCache[tenantId] = { pages: {} };
        }

        transactionsCache[tenantId].pages[cacheKey] = {
            data: response.data,
            total: response.total,
            lastFetched: Date.now()
        };

        loading = false;
    } catch (err) {
        loading = false;
        error = err instanceof Error ? err.message : 'Failed to load transactions';
    }
}

// Refresh
export async function refreshTransactions(tenantId: string) {
    const cacheKey = getCacheKey(currentPage, filters);

    if (transactionsCache[tenantId]?.pages[cacheKey]) {
        delete transactionsCache[tenantId].pages[cacheKey];
    }

    await loadTransactions(tenantId);
}

// Change page
export function setTransactionsPage(page: number) {
    currentPage = page;
}

// Change filters
export function setTransactionsFilters(newFilters: Partial<TransactionsFilters>) {
    filters = { ...filters, ...newFilters };
    currentPage = 1;
}

// Reset
export function resetTransactionsState() {
    currentPage = 1;
    filters = { status: null, startDate: null, endDate: null };
    error = null;
}