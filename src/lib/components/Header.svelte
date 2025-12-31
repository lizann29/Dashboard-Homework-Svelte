<script lang="ts">
    import type {Routes} from "$lib/types/+page";
    import {goto} from "$app/navigation";
    import TenantsSwitcherDropdown from "$lib/components/TenantsSwitcherDropdown.svelte";
    import {Tab} from "$lib/components/+page";
    import {page} from "$app/state";

    interface HeaderProps {
        title?: string
        routes: Routes[]
    }

    let {title, routes}: HeaderProps = $props();

    const navigate = (path: string) => {
        goto(path)
    }
    const currentPath = $derived(page.url.pathname);

</script>
<div class="header">
    <div class="right-side">
        <div class="routes-container">
            {#each routes as route }
                <Tab
                        active={currentPath === route.path || currentPath.startsWith(route.path + '/')}
                        onclick={() => navigate(route.path)}>
                    {#snippet children()}
                        {route.name}
                    {/snippet}
                </Tab>
            {/each}
        </div>
    </div>

    <div class="left-side">
        <TenantsSwitcherDropdown/>
    </div>
</div>

<style>
    .header {
        display: flex;
        padding: 1rem;
        background: #eee;
        justify-content: space-between;
        align-items: center;

        p {
            align-items: center;
            font-size: 1.5rem;
            color: #333;
        }
    }

    .left-side, .right-side {
        display: flex;
    }

    .routes-container {
        display: flex;
        gap: 0.5rem;

    }

</style>