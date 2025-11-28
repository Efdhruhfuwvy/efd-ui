<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    top,
    right,
    bottom,
    left,
    topSize = $bindable(top ? 256 : 0),
    rightSize = $bindable(right ? 256 : 0),
    bottomSize = $bindable(bottom ? 256 : 0),
    leftSize = $bindable(left ? 256 : 0),
    minContentWidth = 256,
    minContentHeight = 256,
    minTopSize = 128,
    minRightSize = 128,
    minBottomSize = 128,
    minLeftSize = 128,
    topSpansLeft,
    topSpansRight,
    bottomSpansLeft,
    bottomSpansRight,
  }: {
    children: Snippet;
    top?: Snippet;
    right?: Snippet;
    bottom?: Snippet;
    left?: Snippet;
    topSize?: number;
    rightSize?: number;
    bottomSize?: number;
    leftSize?: number;
    minContentWidth: number;
    minContentHeight: number;
    minTopSize?: number;
    minRightSize?: number;
    minBottomSize?: number;
    minLeftSize?: number;
    topSpansLeft?: boolean;
    topSpansRight?: boolean;
    bottomSpansLeft?: boolean;
    bottomSpansRight?: boolean;
  } = $props();

  let topElement: HTMLDivElement;
  let rightElement: HTMLDivElement;
  let bottomElement: HTMLDivElement;
  let leftElement: HTMLDivElement;
  let topLeftResizer: HTMLDivElement;
  let topResizer: HTMLDivElement;
  let topRightResizer: HTMLDivElement;
  let rightResizer: HTMLDivElement;
  let bottomRightResizer: HTMLDivElement;
  let bottomResizer: HTMLDivElement;
  let bottomLeftResizer: HTMLDivElement;
  let leftResizer: HTMLDivElement;
</script>

<div
  class="paned-view"
  {@attach (panedView) => {
    panedView.style.gridTemplate = `
      "${topSpansLeft ? "top" : "left"}       top     ${topSpansRight ? "top" : "right"}      " max(${topSize}px, ${minTopSize}px)
      "left                                   content right                                   " minmax(${minContentHeight}px, 1fr)
      "${bottomSpansLeft ? "bottom" : "left"} bottom  ${bottomSpansRight ? "bottom" : "right"}" max(${bottomSize}px, ${minBottomSize}px)
      / max(${leftSize}px, ${minLeftSize}px) minmax(${minContentWidth}px, 1fr) max(${rightSize}px, ${minRightSize}px)
    `;
    function updateResizers() {
      const rect = panedView.getBoundingClientRect();

      topLeftResizer.style.left = `${leftElement.getBoundingClientRect().right - rect.left - 2}px`;
      topLeftResizer.style.top = `${topElement.getBoundingClientRect().bottom - rect.top - 2}px`;

      topResizer.style.left = `${topElement.getBoundingClientRect().left - rect.left}px`;
      topResizer.style.top = `${topElement.getBoundingClientRect().bottom - rect.top - 2}px`;
      topResizer.style.width = `${topElement.getBoundingClientRect().width}px`;

      topRightResizer.style.left = `${rightElement.getBoundingClientRect().left - rect.left - 2}px`;
      topRightResizer.style.top = `${topElement.getBoundingClientRect().bottom - rect.top - 2}px`;

      rightResizer.style.left = `${rightElement.getBoundingClientRect().left - rect.left - 2}px`;
      rightResizer.style.top = `${rightElement.getBoundingClientRect().top - rect.top}px`;
      rightResizer.style.height = `${rightElement.getBoundingClientRect().height}px`;

      bottomRightResizer.style.left = `${rightElement.getBoundingClientRect().left - rect.left - 2}px`;
      bottomRightResizer.style.top = `${bottomElement.getBoundingClientRect().top - rect.top - 2}px`;

      bottomResizer.style.left = `${bottomElement.getBoundingClientRect().left - rect.left}px`;
      bottomResizer.style.top = `${bottomElement.getBoundingClientRect().top - rect.top - 2}px`;
      bottomResizer.style.width = `${bottomElement.getBoundingClientRect().width}px`;

      bottomLeftResizer.style.left = `${leftElement.getBoundingClientRect().right - rect.left - 2}px`;
      bottomLeftResizer.style.top = `${bottomElement.getBoundingClientRect().top - rect.top - 2}px`;

      leftResizer.style.left = `${leftElement.getBoundingClientRect().right - rect.left - 2}px`;
      leftResizer.style.top = `${leftElement.getBoundingClientRect().top - rect.top}px`;
      leftResizer.style.height = `${leftElement.getBoundingClientRect().height}px`;
    }
    updateResizers();
    new ResizeObserver(updateResizers).observe(panedView);
  }}
>
  <div class="paned-view-content">
    {@render children()}
  </div>
  <div bind:this={topElement} class="paned-view-top">{@render top?.()}</div>
  <div bind:this={rightElement} class="paned-view-right">
    {@render right?.()}
  </div>
  <div bind:this={bottomElement} class="paned-view-bottom">
    {@render bottom?.()}
  </div>
  <div bind:this={leftElement} class="paned-view-left">{@render left?.()}</div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={topResizer}
    class="paned-view-resizer paned-view-vertical-resizer"
    onmousedown={(event) => {
      const offsetY = event.offsetY;
      const parent = event.currentTarget.parentElement!;

      function resize(event: MouseEvent) {
        topSize = event.y - parent.getBoundingClientRect().top - offsetY;
      }

      addEventListener("mousemove", resize);
      addEventListener(
        "mouseup",
        () => removeEventListener("mousemove", resize),
        { once: true },
      );
    }}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={rightResizer}
    class="paned-view-resizer paned-view-horizontal-resizer"
    onmousedown={(event) => {
      const offsetX = event.offsetX;
      const parent = event.currentTarget.parentElement!;

      function resize(event: MouseEvent) {
        rightSize = parent.getBoundingClientRect().right - event.x - offsetX;
      }

      addEventListener("mousemove", resize);
      addEventListener(
        "mouseup",
        () => removeEventListener("mousemove", resize),
        { once: true },
      );
    }}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={bottomResizer}
    class="paned-view-resizer paned-view-vertical-resizer"
    onmousedown={(event) => {
      const offsetY = event.offsetY;
      const parent = event.currentTarget.parentElement!;

      function resize(event: MouseEvent) {
        bottomSize = parent.getBoundingClientRect().bottom - event.y - offsetY;
      }

      addEventListener("mousemove", resize);
      addEventListener(
        "mouseup",
        () => removeEventListener("mousemove", resize),
        { once: true },
      );
    }}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={leftResizer}
    class="paned-view-resizer paned-view-horizontal-resizer"
    onmousedown={(event) => {
      const offsetX = event.offsetX;
      const parent = event.currentTarget.parentElement!;

      function resize(event: MouseEvent) {
        leftSize = event.x - parent.getBoundingClientRect().left - offsetX;
      }

      addEventListener("mousemove", resize);
      addEventListener(
        "mouseup",
        () => removeEventListener("mousemove", resize),
        { once: true },
      );
    }}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={topLeftResizer}
    class="paned-view-resizer paned-view-left-corner-resizer"
    onmousedown={(event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const parent = event.currentTarget.parentElement!;

      function resize(event: MouseEvent) {
        topSize = event.y - parent.getBoundingClientRect().top - offsetY;
        leftSize = event.x - parent.getBoundingClientRect().left - offsetX;
      }

      addEventListener("mousemove", resize);
      addEventListener(
        "mouseup",
        () => removeEventListener("mousemove", resize),
        { once: true },
      );
    }}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={topRightResizer}
    class="paned-view-resizer paned-view-right-corner-resizer"
    onmousedown={(event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const parent = event.currentTarget.parentElement!;

      function resize(event: MouseEvent) {
        topSize = event.y - parent.getBoundingClientRect().top - offsetY;
        rightSize = parent.getBoundingClientRect().right - event.x - offsetX;
      }

      addEventListener("mousemove", resize);
      addEventListener(
        "mouseup",
        () => removeEventListener("mousemove", resize),
        { once: true },
      );
    }}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={bottomRightResizer}
    class="paned-view-resizer paned-view-left-corner-resizer"
    onmousedown={(event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const parent = event.currentTarget.parentElement!;

      function resize(event: MouseEvent) {
        rightSize = parent.getBoundingClientRect().right - event.x - offsetX;
        bottomSize = parent.getBoundingClientRect().bottom - event.y - offsetY;
      }

      addEventListener("mousemove", resize);
      addEventListener(
        "mouseup",
        () => removeEventListener("mousemove", resize),
        { once: true },
      );
    }}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={bottomLeftResizer}
    class="paned-view-resizer paned-view-right-corner-resizer"
    onmousedown={(event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const parent = event.currentTarget.parentElement!;

      function resize(event: MouseEvent) {
        bottomSize = parent.getBoundingClientRect().bottom - event.y - offsetY;
        leftSize = event.x - parent.getBoundingClientRect().left - offsetX;
      }

      addEventListener("mousemove", resize);
      addEventListener(
        "mouseup",
        () => removeEventListener("mousemove", resize),
        { once: true },
      );
    }}
  ></div>
</div>

<style>
  .paned-view {
    display: grid;
    position: relative;

    & > .paned-view-content {
      display: grid;
      grid-area: content;
    }

    & > .paned-view-top {
      display: grid;
      grid-area: top;
      border-bottom: 1px solid #808080;
    }

    & > .paned-view-right {
      display: grid;
      grid-area: right;
      border-left: 1px solid #808080;
    }

    & > .paned-view-bottom {
      display: grid;
      grid-area: bottom;
      border-top: 1px solid #808080;
    }

    & > .paned-view-left {
      display: grid;
      grid-area: left;
      border-right: 1px solid #808080;
    }

    & > .paned-view-resizer {
      position: absolute;
      width: 4px;
      height: 4px;
    }

    & > .paned-view-horizontal-resizer {
      cursor: ew-resize;
    }

    & > .paned-view-vertical-resizer {
      cursor: ns-resize;
    }

    & > .paned-view-left-corner-resizer {
      cursor: nwse-resize;
    }

    & > .paned-view-right-corner-resizer {
      cursor: nesw-resize;
    }
  }
</style>
