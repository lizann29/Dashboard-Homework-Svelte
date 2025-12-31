<script lang="ts">
    interface PaginationProps {
        currentPage: number;
        totalItems: number;
        pageSize: number;
        onPageChange: (page: number) => void;
    }

    let { currentPage, totalItems, pageSize, onPageChange }: PaginationProps = $props();

    let totalPages = $derived(Math.ceil(totalItems / pageSize));

    let canGoPrev = $derived(currentPage > 1);
    let canGoNext = $derived(currentPage < totalPages);

    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    }
</script>

<div class="pagination">
    <button
            class="pagination-btn"
            disabled={!canGoPrev}
            onclick={() => goToPage(currentPage - 1)}
    >
        Back
    </button>

    <span>
        Page {currentPage} of {totalPages}
    </span>

    <button
            class="pagination-btn"
            disabled={!canGoNext}
            onclick={() => goToPage(currentPage + 1)}
    >
        Next
    </button>
</div>

<style>
    .pagination {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        justify-content: center;
    }

    .pagination-btn {
        cursor: pointer;

        display: flex;
        padding: 0.5rem 1rem;
        border: 1px #e6e6ea solid;
        border-radius: 0.5rem;
        background: #fffcfc;
    }

    .pagination-btn:hover {
        background: #edb8b8;
    }

    .pagination-btn:disabled {
        background: rgba(236, 236, 236, 0.87);
        cursor: not-allowed;
    }

</style>