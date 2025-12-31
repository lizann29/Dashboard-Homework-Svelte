<script lang="ts">
    import type {Snippet} from "svelte";

    interface tabProps {
        children: Snippet;
        onclick: () => void;
        active?: boolean;
    }

    let { children, onclick, active = false}: tabProps = $props();

</script>
<div class="tab-container" class:active {onclick}>
    {@render children?.()}
</div>

<style lang="scss">
  .tab-container {
    cursor: pointer;
    display: flex;
    padding: 1rem;
    background: #ffffff;
    border: 1px #e6e6ea solid;
    border-radius: 1rem;
    transition: border-color 0.2s ease;

    &.active {
      border: 2px solid #fbbf24;
      background: #fffbeb;
    }

    &:hover {
      border-color: #d1d1d6;
    }
  }
</style>