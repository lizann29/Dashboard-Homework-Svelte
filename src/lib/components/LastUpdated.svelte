<script lang="ts">
    interface LastUpdatedProps {
        timestamp?: number;
        onRefresh: () => void;
    }

    let { timestamp, onRefresh }: LastUpdatedProps = $props();

    let timeAgo = $derived.by(() => {
        if (!timestamp) return 'Never';

        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    });
</script>

<div class="last-updated">
    <span class="time">Last updated: {timeAgo}</span>
    <div class="refresh-btn" onclick={onRefresh}>
        Refresh
    </div>
</div>

<style>
    .last-updated {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: #f5f5f5;
        border-radius: 1px;
    }

    .time {
        font-size: 1rem;
        color: #666;
    }

    .refresh-btn {
        padding: 0.5rem 1rem;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;

        cursor: pointer;
        font-size: 0.85rem;
    }

    .refresh-btn:hover {
        background: #e0e0e0;
    }
</style>