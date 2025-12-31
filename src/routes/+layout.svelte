<script lang="ts">
    import type {Routes} from "$lib/types/+page";
    import {Header, PageContainer} from "$lib/components/+page";
    import {onMount} from "svelte";
    import {getTenants} from "$lib/services/tenants.svelte";
    import {loadTenants} from "$lib/stores/tenants.svelte";

    let {children} = $props();


    let routes: Routes[] = [
        {
            name: 'Transactions',
            path: '/transactions',
            icon: 'list'
        },
        {
            name: 'Users',
            path: '/users',
            icon: 'users'
        }
    ]

    onMount(() => {
        loadTenants();
    })

</script>

<div class="main">
    <Header {routes}/>
    <PageContainer>
        {@render children()}
    </PageContainer>

</div>

<style>
    .main {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>

