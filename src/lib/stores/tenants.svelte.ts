// lib/stores/tenants.svelte.ts

import type { Tenant, DataState } from '$lib/types/+page';
import { getTenants } from "$lib/services/tenants.svelte";

// ✅ Cache configuration
const TENANTS_TTL = 5 * 60 * 1000; // 5 minutes
const TENANTS_STALE_TIME = 10 * 60 * 1000; // 10 minutes (can serve stale)

// State using Svelte 5 runes
let tenantsState = $state<DataState<Tenant[]>>({
    loading: false,
    data: [],
    error: null,
    lastFetched: undefined
});

let selectedTenantId = $state<string | null>(null);

// ✅ Request deduplication: store ongoing fetch promise
let fetchPromise: Promise<void> | null = null;

// Export state with getters (reactive access)
export const tenants = {
    get loading() { return tenantsState.loading; },
    get data() { return tenantsState.data; },
    get error() { return tenantsState.error; },
    get lastFetched() { return tenantsState.lastFetched; }
};

export const currentTenantId = {
    get value() { return selectedTenantId; }
};

// Derived value as a getter function
export function getSelectedTenant(): Tenant | null {
    if (!selectedTenantId) return null;
    return tenantsState.data.find(t => t.id === selectedTenantId) || null;
}

// ✅ Check if cache is fresh
function isCacheFresh(): boolean {
    if (!tenantsState.lastFetched) return false;
    const age = Date.now() - tenantsState.lastFetched;
    return age < TENANTS_TTL;
}

// ✅ Check if cache is stale but usable (for SWR)
function isCacheStale(): boolean {
    if (!tenantsState.lastFetched) return false;
    const age = Date.now() - tenantsState.lastFetched;
    return age >= TENANTS_TTL && age < TENANTS_STALE_TIME;
}

// ✅ Load tenants with caching
export async function loadTenants(options?: { forceRefresh?: boolean }) {
    // 1. Return fresh cache immediately
    if (!options?.forceRefresh && isCacheFresh()) {
        console.log('✅ Using fresh cache');
        return;
    }

    // 2. If cache is stale, return stale data and refetch in background (SWR)
    if (!options?.forceRefresh && isCacheStale() && tenantsState.data.length > 0) {
        console.log('🔄 Using stale cache, refetching in background');
        fetchTenantsInBackground(); // Don't await
        return;
    }

    // 3. Request deduplication: if already fetching, reuse the promise
    if (fetchPromise) {
        console.log('⏳ Fetch already in progress, waiting...');
        await fetchPromise;
        return;
    }

    // 4. No cache or force refresh, fetch new data
    console.log('🌐 Fetching fresh data');
    await fetchTenantsData();
}

// ✅ Fetch tenants data
async function fetchTenantsData() {
    tenantsState.loading = true;
    tenantsState.error = null;

    // Create promise for deduplication
    fetchPromise = (async () => {
        try {
            const data = await getTenants();
            tenantsState = {
                loading: false,
                data,
                error: null,
                lastFetched: Date.now()
            };

            // Auto-select first tenant if none selected
            if (!selectedTenantId && data.length > 0) {
                selectedTenantId = data[0].id;
            }
        } catch (error) {
            tenantsState = {
                ...tenantsState,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to load tenants'
            };
        } finally {
            fetchPromise = null; // Clear promise after completion
        }
    })();

    await fetchPromise;
}

function fetchTenantsInBackground() {
    if (fetchPromise) return;

    fetchPromise = (async () => {
        try {
            const data = await getTenants();
            tenantsState = {
                ...tenantsState,
                data,
                lastFetched: Date.now(),
                error: null
            };
        } catch {
            // silent
        } finally {
            fetchPromise = null;
        }
    })();
}


export async function refreshTenants() {
    console.log('🔄 Manual refresh triggered');
    await loadTenants({ forceRefresh: true });
}

export function selectTenant(tenantId: string) {
    selectedTenantId = tenantId;
}

export function getCacheStatus() {
    if (!tenantsState.lastFetched) return 'empty';
    if (isCacheFresh()) return 'fresh';
    if (isCacheStale()) return 'stale';
    return 'expired';
}