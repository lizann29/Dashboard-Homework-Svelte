<script lang="ts">
    import { resetUsersState } from "$lib/stores/users.svelte";
    import { resetTransactionsState } from "$lib/stores/transactions.svelte";
    import { tenants, currentTenantId, getSelectedTenant, selectTenant } from "$lib/stores/tenants.svelte";

    let isOpen = $state(false);

    function handleTenantChange(tenantId: string) {
        selectTenant(tenantId);
        resetUsersState();
        resetTransactionsState();
        isOpen = false;
    }

    function toggleDropdown() {
        isOpen = !isOpen;
    }

</script>

<div class="tenant-switcher">
    <button class="dropdown-toggle" onclick={toggleDropdown}>
        {#if tenants.loading}
            Loading...
        {:else if getSelectedTenant()}
            {getSelectedTenant()?.name}
        {:else}
            Select Tenant
        {/if}
    </button>

    {#if isOpen}
        <div class="dropdown-menu">
            {#if tenants.error}
                <div class="error">{tenants.error}</div>
            {:else}
                {#each tenants.data as tenant}
                    <div
                            class="dropdown-item"
                            class:active={currentTenantId.value === tenant.id}
                            onclick={() => handleTenantChange(tenant.id)}
                    >
                        {tenant.name}
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</div>

<style>
    .tenant-switcher {
        position: relative;
    }

    .dropdown-toggle {
        cursor: pointer;

        display: flex;
        padding: 0.5rem 1rem;
        border: 1px #e6e6ea solid;
        border-radius: 0.5rem;
        background: #fffcfc;
    }

    .dropdown-toggle:hover {
        background: #f5f5f5;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.25rem;
        background: white;
        border: 1px solid #ccc;
        border-radius: 0.5px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        min-width: 200px;
        z-index: 1000;

        cursor: pointer;

        display: flex;
        flex-direction: column;
        padding: 0.5rem 1rem;

    }

    .dropdown-item {
        padding: 0.5rem 1rem;
        background: white;
        text-align: center;
        cursor: pointer;
    }

    .dropdown-item:hover {
        background: #f0f0f0;
    }

    .dropdown-item.active {
        border: 2px solid #fbbf24;
        background: #fffbeb;
    }

    .error {
        padding: 0.75rem 1rem;
        color: #d32f2f;
        font-size: 0.9rem;
    }
</style>