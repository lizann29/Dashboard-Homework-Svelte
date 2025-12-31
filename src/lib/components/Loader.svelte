<div class="spinner">
    <div class="spinner-circle"></div>
</div>

<style>
    .spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
    }

    .spinner-circle {
        width: 3rem;
        height: 3rem;
        border: 1px solid #f3f3f3;
        border-top: 0.25rem solid #020000;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

</style>