<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    titleBar,
    statusBar,
    leftNavigationBar,
    rightNavigationBar,
    titleBarSize = titleBar ? 48 : 0,
    statusBarSize = statusBar ? 24 : 0,
    leftNavigationBarSize = leftNavigationBar ? 48 : 0,
    rightNavigationBarSize = rightNavigationBar ? 48 : 0,
  }: {
    children: Snippet;
    titleBar?: Snippet;
    statusBar?: Snippet;
    leftNavigationBar?: Snippet;
    rightNavigationBar?: Snippet;
    titleBarSize?: number;
    statusBarSize?: number;
    leftNavigationBarSize?: number;
    rightNavigationBarSize?: number;
  } = $props();
</script>

<div
  class="app-layout"
  {@attach (appLayout) => {
    appLayout.style.gridTemplate = `
      "title-bar         title-bar  title-bar         " ${titleBarSize}px
      "left-navigation-bar content    right-navigation-bar" 1fr
      "status-bar        status-bar status-bar        " ${statusBarSize}px
      / ${leftNavigationBarSize}px 1fr ${rightNavigationBarSize}px
    `;
  }}
>
  <div class="app-layout-content">
    {@render children()}
  </div>
  <div class="app-layout-title-bar">
    {@render titleBar?.()}
  </div>
  <div class="app-layout-status-bar">
    {@render statusBar?.()}
  </div>
  <div class="app-layout-left-navigation-bar">
    {@render leftNavigationBar?.()}
  </div>
  <div class="app-layout-right-navigation-bar">
    {@render rightNavigationBar?.()}
  </div>
</div>

<style>
  .app-layout {
    display: grid;

    & > .app-layout-content {
      grid-area: content;
      display: grid;
    }

    & > .app-layout-title-bar {
      grid-area: title-bar;
      display: grid;
    }

    & > .app-layout-status-bar {
      grid-area: status-bar;
      display: grid;
    }

    & > .app-layout-left-navigation-bar {
      grid-area: left-navigation-bar;
      display: grid;
    }

    & > .app-layout-right-navigation-bar {
      grid-area: right-navigation-bar;
      display: grid;
    }
  }
</style>
