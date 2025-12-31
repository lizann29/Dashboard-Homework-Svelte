<script lang="ts">
    let { children } = $props();

</script>

<div class="page-container">
    {@render children?.()}
</div>

<style>
    .page-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
</style>