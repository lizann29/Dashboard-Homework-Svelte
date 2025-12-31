<script lang="ts">
    import { Pagination, LastUpdated, Loader} from '$lib/components/+page';
    import { currentTenantId } from "$lib/stores/tenants.svelte";
    import {
        getCurrentTransactionsData,
        loadTransactions,
        refreshTransactions,
        setTransactionsFilters,
        setTransactionsPage,
        transactionsState
    } from "$lib/stores/transactions.svelte";

    // Track previous tenant
    let previousTenantId = $state<string | null>(null);

    // Load data when tenant changes
    $effect(() => {
        const tenantId = currentTenantId.value;
        if (tenantId && tenantId !== previousTenantId) {
            loadTransactions(tenantId);
            previousTenantId = tenantId;
        }
    });

    // Also trigger load when page/filters change
    $effect(() => {
        const tenantId = currentTenantId.value;
        if (tenantId) {
            loadTransactions(tenantId);
        }
    });

    function handleRefresh() {
        const tenantId = currentTenantId.value;
        if (tenantId) {
            refreshTransactions(tenantId);
        }
    }

    function handlePageChange(newPage: number) {
        setTransactionsPage(newPage);
    }

    function handleStatusFilter(status: 'pending' | 'completed' | 'failed' | null) {
        setTransactionsFilters({ status });
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatAmount(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
</script>

<div class="transactions-page">
    <div class="page-header">
        <h1>Transactions</h1>
        {#if getCurrentTransactionsData().lastFetched}
            <LastUpdated timestamp={getCurrentTransactionsData().lastFetched} onRefresh={handleRefresh} />
        {/if}
    </div>

    {#if !currentTenantId.value}
        <div class="empty-state">
            <p>Please select a tenant to view transactions.</p>
        </div>
    {:else}
        <!-- Filters -->
        <div class="filters">
            <label>
                Filter by status:
                <select value={transactionsState.filters.status || ''} onchange={(e) => handleStatusFilter(e.currentTarget.value as any || null)}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                </select>
            </label>
        </div>

        {#if transactionsState.error}
            <div class="error-state">
                <p>❌ {transactionsState.error}</p>
                <button onclick={handleRefresh}>Try Again</button>
            </div>
        {:else if transactionsState.loading && getCurrentTransactionsData().data.length === 0}
            <Loader />
        {:else if getCurrentTransactionsData().data.length === 0}
            <div class="empty-state">
                <p>No transactions found.</p>
            </div>
        {:else}
            <!-- Transactions Table -->
            <div class="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each getCurrentTransactionsData().data as transaction (transaction.id)}
                        <tr>
                            <td class="id-cell">{transaction.id}</td>
                            <td>{transaction.description}</td>
                            <td class="amount-cell">{formatAmount(transaction.amount)}</td>
                            <td>{formatDate(transaction.date)}</td>
                            <td>
                                    <span
                                            class="status-badge"
                                            class:pending={transaction.status === 'pending'}
                                            class:completed={transaction.status === 'completed'}
                                            class:failed={transaction.status === 'failed'}
                                    >
                                        {transaction.status}
                                    </span>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            {#if getCurrentTransactionsData().total > transactionsState.pageSize}
                <Pagination
                        currentPage={transactionsState.page}
                        totalItems={getCurrentTransactionsData().total}
                        pageSize={transactionsState.pageSize}
                        onPageChange={handlePageChange}
                />
            {/if}

            {#if transactionsState.loading}
                <div class="loading-overlay">Loading...</div>
            {/if}
        {/if}
    {/if}
</div>

<style>
    .transactions-page {
        padding: 2rem;
    }

    .page-header {
        margin-bottom: 2rem;
    }

    .page-header h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #333;
    }

    .filters {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 4px;
    }

    .filters label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    }

    .filters select {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    .table-container {
        overflow-x: auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead {
        background: #f5f5f5;
    }

    th {
        text-align: left;
        padding: 1rem;
        font-weight: 600;
        color: #555;
        border-bottom: 2px solid #ddd;
    }

    td {
        padding: 1rem;
        border-bottom: 1px solid #eee;
    }

    tbody tr:hover {
        background: #fafafa;
    }

    .id-cell {
        font-family: monospace;
        font-size: 0.85rem;
        color: #666;
    }

    .amount-cell {
        font-weight: 600;
        color: #2e7d32;
    }

    .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .status-badge.pending {
        background: #fff3e0;
        color: #f57c00;
    }

    .status-badge.completed {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .status-badge.failed {
        background: #ffebee;
        color: #c62828;
    }

    .empty-state, .error-state {
        text-align: center;
        padding: 3rem;
        color: #666;
    }

    .error-state button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .loading-overlay {
        text-align: center;
        padding: 1rem;
        color: #666;
        font-size: 0.9rem;
    }
</style>