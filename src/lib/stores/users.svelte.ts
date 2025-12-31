import type { User, PaginatedResponse } from '$lib/types/+page';
import { currentTenantId } from "$lib/stores/tenants.svelte";
import {fetchUsers} from "$lib/services/user.svelte";

type UsersCache = {
    [tenantId: string]: {
        pages: {
            [pageKey: string]: {
                data: User[];
                total: number;
                lastFetched: number;
            }
        }
    }
};

type UsersFilters = {
    role: 'admin' | 'user' | null;
};

let usersCache = $state<UsersCache>({});
let currentPage = $state(1);
let pageSize = $state(100);
let filters = $state<UsersFilters>({ role: null });
let loading = $state(false);
let error = $state<string | null>(null);

function getCacheKey(page: number, filterState: UsersFilters): string {
    return `page-${page}-role-${filterState.role || 'all'}`;
}

export const usersState = {
    get loading() { return loading; },
    get error() { return error; },
    get page() { return currentPage; },
    get pageSize() { return pageSize; },
    get filters() { return filters; }
};

export function getCurrentUsersData() {
    const tenantId = currentTenantId.value;
    if (!tenantId) return { data: [], total: 0, lastFetched: undefined };

    const tenantCache = usersCache[tenantId];
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

export async function loadUsers(tenantId: string) {
    const cacheKey = getCacheKey(currentPage, filters);

    if (usersCache[tenantId]?.pages[cacheKey]) {
        return;
    }

    loading = true;
    error = null;

    try {
        const response: PaginatedResponse<User> = await fetchUsers({
            tenantId,
            page: currentPage,
            pageSize: pageSize,
            role: filters.role
        });

        // Update cache
        if (!usersCache[tenantId]) {
            usersCache[tenantId] = { pages: {} };
        }

        usersCache[tenantId].pages[cacheKey] = {
            data: response.data,
            total: response.total,
            lastFetched: Date.now()
        };

        loading = false;
    } catch (err) {
        loading = false;
        error = err instanceof Error ? err.message : 'Failed to load users';
    }
}

export async function refreshUsers(tenantId: string) {
    const cacheKey = getCacheKey(currentPage, filters);

    if (usersCache[tenantId]?.pages[cacheKey]) {
        delete usersCache[tenantId].pages[cacheKey];
    }

    await loadUsers(tenantId);
}

export function setUsersPage(page: number) {
    currentPage = page;
}

export function setUsersFilters(newFilters: Partial<UsersFilters>) {
    filters = { ...filters, ...newFilters };
    currentPage = 1;
}

export function resetUsersState() {
    currentPage = 1;
    filters = { role: null };
    error = null;
}