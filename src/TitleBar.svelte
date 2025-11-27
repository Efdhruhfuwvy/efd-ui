<script lang="ts" module>
  declare const api: {
    setTitleBarOverlay(titleBarOverlay: {
      height?: number;
      color?: string;
      symbolColor?: string;
    }): void;
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  const {
    left,
    center,
    right,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    left?: Snippet;
    center?: Snippet;
    right?: Snippet;
  } = $props();
</script>

<div
  class="title-bar"
  {...rest}
  {@attach (titleBar) => {
    if (typeof api !== "undefined" && "setTitleBarOverlay" in api) {
      async function updateTitleBarOverlay() {
        const style = getComputedStyle(titleBar);
        api.setTitleBarOverlay({
          height: Math.floor(
            titleBar.getBoundingClientRect().height * (outerWidth / innerWidth),
          ),
          color: style.backgroundColor,
          symbolColor: style.color,
        });
      }

      addEventListener("resize", () => setTimeout(updateTitleBarOverlay));
      matchMedia("(prefers-color-scheme: dark)").addEventListener(
        "change",
        updateTitleBarOverlay,
      );
      new MutationObserver(updateTitleBarOverlay).observe(
        document.documentElement,
        {
          childList: true,
          attributes: true,
          subtree: true,
        },
      );
      titleBar.addEventListener("transitionend", updateTitleBarOverlay);
      titleBar.addEventListener("animationend", updateTitleBarOverlay);

      updateTitleBarOverlay();
    }
  }}
>
  <div class="left">
    {@render left?.()}
  </div>
  <div class="center">
    {@render center?.()}
  </div>
  <div class="right">
    {@render right?.()}
  </div>
</div>

<style>
  .title-bar {
    display: flex;
    align-items: center;
    app-region: drag;

    & :global(:is(button, a, input, textarea, label)) {
      app-region: no-drag;
    }

    & .left {
      flex: 1;
      align-self: stretch;
      display: flex;
      align-items: center;
      padding-left: env(titlebar-area-x);
    }

    & .center {
      align-self: stretch;
      display: flex;
      align-items: center;
    }

    & .right {
      flex: 1;
      align-self: stretch;
      display: flex;
      align-items: center;
      justify-content: end;
      padding-right: calc(
        100vw - env(titlebar-area-x) - env(titlebar-area-width)
      );
    }
  }
</style>
