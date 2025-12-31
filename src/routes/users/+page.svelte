<script lang="ts">
    import { Pagination, LastUpdated, Loader } from '$lib/components/+page';
    import { currentTenantId } from "$lib/stores/tenants.svelte";
    import {
        getCurrentUsersData,
        loadUsers,
        refreshUsers,
        setUsersFilters,
        setUsersPage,
        usersState
    } from "$lib/stores/users.svelte";
    import VirtualList from "$lib/components/VirtualList.svelte";

    let previousTenantId = $state<string | null>(null);

    // Reactive values - access getters directly
    $effect(() => {
        const tenantId = currentTenantId.value;
        if (tenantId && tenantId !== previousTenantId) {
            loadUsers(tenantId);
            previousTenantId = tenantId;
        }
    });

    // Also trigger load when page changes
    $effect(() => {
        const tenantId = currentTenantId.value;
        if (tenantId) {
            loadUsers(tenantId);
        }
    });

    function handleRefresh() {
        const tenantId = currentTenantId.value;
        if (tenantId) {
            refreshUsers(tenantId);
        }
    }

    function handlePageChange(newPage: number) {
        setUsersPage(newPage);
    }

    function handleRoleFilter(role: 'admin' | 'user' | null) {
        setUsersFilters({ role });
    }
</script>

<div class="users-page">
    <div class="page-header">
        {#if getCurrentUsersData().lastFetched}
            <LastUpdated timestamp={getCurrentUsersData().lastFetched} onRefresh={handleRefresh} />
        {/if}
    </div>

    {#if !currentTenantId.value}
        <div class="empty-state">
            <p>Please select a tenant to view users.</p>
        </div>
    {:else}
        <div class="filters">
            <label>
                Filter by role:
                <select value={usersState.filters.role || ''} onchange={(e) => handleRoleFilter(e.currentTarget.value as any || null)}>
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </label>
        </div>

        {#if usersState.error}
            <div class="error-state">
                <p>{usersState.error}</p>
                <button onclick={handleRefresh}>Try Again</button>
            </div>
        {:else if usersState.loading && getCurrentUsersData().data.length === 0}
            <Loader />
        {:else if getCurrentUsersData().data.length === 0}
            <div class="empty-state">
                <p>No users found.</p>
            </div>
        {:else}
            <!-- Users Table -->
            <div class="table-container">
                <table>
                    <thead>
                    <tr>
                        <th style="width: 25%;">Name</th>
                        <th style="width: 35%;">Email</th>
                        <th style="width: 20%;">Role</th>
                        <th style="width: 20%;">Status</th>
                    </tr>
                    </thead>
                </table>

                <VirtualList items={getCurrentUsersData().data} itemHeight={53} height="500px">
                    {#snippet children(user)}
                        <table class="virtual-table">
                            <tbody>
                            <tr>
                                <td style="width: 25%;">{user.name}</td>
                                <td style="width: 35%;">{user.email}</td>
                                <td style="width: 20%;">
                                <span class="role-badge" class:admin={user.role === 'admin'}>
                                    {user.role}
                                </span>
                                </td>
                                <td style="width: 20%;">
                                <span class="status-badge" class:active={user.active}>
                                    {user.active ? 'Active' : 'Inactive'}
                                </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    {/snippet}
                </VirtualList>
            </div>
            {#if getCurrentUsersData().total > usersState.pageSize}
                <Pagination
                        currentPage={usersState.page}
                        totalItems={getCurrentUsersData().total}
                        pageSize={usersState.pageSize}
                        onPageChange={handlePageChange}
                />
            {/if}

            {#if usersState.loading}
                <div class="loading-overlay">Loading...</div>
            {/if}
        {/if}
    {/if}
</div>

<style>
    .users-page {
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

    .role-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: #e3f2fd;
        color: #1976d2;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .role-badge.admin {
        background: #fff3e0;
        color: #f57c00;
    }

    .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: #ffebee;
        color: #c62828;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .status-badge.active {
        background: #e8f5e9;
        color: #2e7d32;
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