<script lang="ts">
    type VirtualListProps<T> = {
        items: T[];
        itemHeight?: number;
        height?: string;
        children: (item: T) => any;
    };

    let {
        items,
        itemHeight = 50,
        height = '500px',
        children
    }: VirtualListProps<any> = $props();

    let scrollTop = $state(0);
    let containerHeight = $state(parseInt(height));

    let startIndex = $derived(Math.floor(scrollTop / itemHeight));
    let endIndex = $derived(Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
    ));

    let visibleItems = $derived(items.slice(startIndex, endIndex));
    let offsetY = $derived(startIndex * itemHeight);
    let totalHeight = $derived(items.length * itemHeight);

    function handleScroll(e: Event) {
        scrollTop = (e.target as HTMLElement).scrollTop;
    }
</script>

<div
        class="virtual-list-container"
        style="height: {height}; overflow-y: auto;"
        onscroll={handleScroll}
>
    <div style="height: {totalHeight}px; position: relative;">
        <div style="transform: translateY({offsetY}px);">
            {#each visibleItems as item (item.id || item)}
                {@render children(item)}
            {/each}
        </div>
    </div>
</div>

<style>
    .virtual-list-container {
        overflow-y: auto;
    }
</style>