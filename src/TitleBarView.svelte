<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    titleBar,
    titleBarSize = 48,
  }: { children: Snippet; titleBar: Snippet; titleBarSize?: number } = $props();
</script>

<div
  class="title-bar-view"
  {@attach (titleBarView) => {
    titleBarView.style.gridTemplate = `
      "title-bar" ${titleBarSize}px
      "content  " 1fr
      / 1fr
    `;
  }}
>
  <div class="title-bar-view-content">
    {@render children()}
  </div>
  <div class="title-bar-view-title-bar">
    {@render titleBar()}
  </div>
</div>

<style>
  .title-bar-view {
    display: grid;

    & > .title-bar-view-content {
      grid-area: content;
      display: grid;
    }

    & > .title-bar-view-title-bar {
      grid-area: title-bar;
      display: grid;
    }
  }
</style>
