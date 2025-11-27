<script lang="ts" module>
  interface MenuItem {
    click(event: {
      ctrlKey: boolean;
      metaKey: boolean;
      shiftKey: boolean;
      altKey: boolean;
      triggeredByAccelerator: boolean;
    }): void;
    type?: "normal" | "separator" | "submenu" | "checkbox" | "radio";
    label?: string;
    accelerator?: string;
    icon?: string;
    enabled?: boolean;
    visible?: boolean;
    checked?: boolean;
    submenu?: MenuItem[];
    id?: string;
  }

  const isMacOS = navigator.userAgent.includes("Mac");
  const keys: Record<string, string> = {
    plus: "+",
    space: " ",
    return: "enter",
    up: "arrowup",
    down: "arrowdown",
    left: "arrowleft",
    right: "arrowright",
    esc: "escape",
    volumeup: "audiovolumeup",
    volumedown: "audiovolumedown",
    volumemute: "audiovolumemute",
    medianexttrack: "mediatracknext",
    mediaprevioustrack: "mediatrackprevious",
  };

  function formatAccelerator(accelerator: string) {
    if (isMacOS) {
      return accelerator
        .replace(/(?:command|cmd|commandorcontrol|cmdorctrl)\+/gi, "⌘")
        .replace(/(?:control|ctrl)\+/gi, "⌃")
        .replace(/shift\+/gi, "⇧")
        .replace(/(?:alt|option)\+/gi, "⌥");
    } else {
      return accelerator
        .replace(/(?:super|meta)\+/gi, "⌘")
        .replace(/(?:control|ctrl|commandorcontrol|cmdorctrl)\+/gi, "⌃")
        .replace(/shift\+/gi, "⇧")
        .replace(/alt\+/gi, "⎇");
    }
  }

  export function registerAccelerators(template: MenuItem[]) {
    for (const item of template) {
      if (item.accelerator) {
        const split = item.accelerator.toLowerCase().split("+");
        const modifiers = split.slice(0, -1);
        const key = split.at(-1);
        const ctrlKey =
          modifiers.includes("control") ||
          modifiers.includes("ctrl") ||
          (!isMacOS &&
            (modifiers.includes("commandorcontrol") ||
              modifiers.includes("cmdorctrl")));
        const metaKey =
          modifiers.includes("super") ||
          modifiers.includes("meta") ||
          (isMacOS &&
            (modifiers.includes("commandorcontrol") ||
              modifiers.includes("cmdorctrl") ||
              modifiers.includes("command") ||
              modifiers.includes("cmd")));
        const shiftKey = modifiers.includes("shift");
        const altKey =
          modifiers.includes("alt") ||
          (isMacOS && modifiers.includes("option"));
        const eventKey = keys[key.toLowerCase()] ?? key.toLowerCase();
        addEventListener("keydown", (event) => {
          if (
            (item.enabled ?? true) &&
            event.key.toLowerCase() === eventKey &&
            event.ctrlKey === ctrlKey &&
            event.metaKey === metaKey &&
            event.shiftKey === shiftKey &&
            event.altKey === altKey
          ) {
            item.click({ ...event, triggeredByAccelerator: true });
          }
        });
      } else if (item.type === "submenu" || (!item.type && item.submenu)) {
        registerAccelerators(item.submenu);
      }
    }
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import Menu from "./Menu.svelte";

  const {
    template = $bindable(),
    menuBar,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    template: MenuItem[];
    menuBar?: boolean;
  } = $props();

  let menu: HTMLDivElement;

  // svelte-ignore non_reactive_update
  let radioName = Math.random().toString(36).slice(2);

  function onAttach(menu: HTMLDivElement) {
    const isSubmenu =
      menu.parentElement.parentElement.classList.contains("menu") &&
      !menu.parentElement.parentElement.classList.contains("menu-bar");
    if (isSubmenu) {
      menu.classList.add("menu-submenu");
    }
    if (!menuBar) {
      const anchor = `--${Math.random().toString(36).slice(2)}`;
      menu.parentElement.style.setProperty("anchor-name", anchor);
      menu.style.setProperty("position-anchor", anchor);
    }
  }

  function closeMenu() {
    let toClose: HTMLElement = menu;
    while (
      toClose.parentElement.parentElement.classList.contains("menu") &&
      !toClose.parentElement.parentElement.classList.contains("menu-bar")
    ) {
      toClose = toClose.parentElement.parentElement;
    }
    if (!toClose.classList.contains("menu-bar")) {
      toClose.hidePopover();
    }
  }
</script>

{#snippet menuItem(item: MenuItem)}
  {#if item.icon}
    <img src={item.icon} alt="" />
  {/if}
  {item.label}
  {#if item.accelerator}
    <div class="menu-item-accelerator">
      {formatAccelerator(item.accelerator)}
    </div>
  {/if}
  {#if !menuBar && (item.type === "submenu" || (!item.type && item.submenu))}
    <svg
      class="menu-item-right-icon"
      width="1em"
      height="1lh"
      viewBox="-1,-1 18,18"
    >
      <path d="m 4,0 8,8 -8,8" fill="none" stroke="currentColor" />
    </svg>
  {/if}
{/snippet}

<div
  bind:this={menu}
  {@attach onAttach}
  class="menu"
  class:menu-bar={menuBar}
  popover={menuBar ? undefined : "auto"}
  {...rest}
>
  {#each template as item, i}
    {#if item.type !== "radio"}
      {void (radioName = Math.random().toString(36).slice(2))}
    {/if}
    {#if item.type === "normal" || (!item.type && !item.submenu)}
      <button
        class="menu-item menu-item-normal"
        disabled={!(item.enabled ?? true)}
        onclick={(event) => {
          closeMenu();
          item.click?.({ ...event, triggeredByAccelerator: false });
        }}
      >
        {@render menuItem(item)}
      </button>
    {:else if item.type === "separator"}
      <div class="menu-item menu-item-separator"></div>
    {:else if item.type === "submenu" || (!item.type && item.submenu)}
      <button class="menu-item menu-item-submenu">
        {@render menuItem(item)}
        <Menu
          {@attach (submenu) => {
            let hideTimer: number;
            submenu.parentElement.addEventListener("click", () => {
              if (!submenu.checkVisibility()) {
                submenu.showPopover();
              }
            });
            submenu.parentElement.addEventListener("mouseenter", () => {
              clearTimeout(hideTimer);
              if (
                !menuBar ||
                [...menu.children].some(
                  (element) =>
                    element !== submenu &&
                    element.classList.contains("menu-item-submenu") &&
                    element.lastElementChild.checkVisibility(),
                )
              ) {
                submenu.showPopover();
              }
            });
            submenu.parentElement.addEventListener(
              "mouseleave",
              () => (hideTimer = setTimeout(() => submenu.hidePopover(), 500)),
            );
          }}
          template={item.submenu}
        />
      </button>
    {:else if item.type === "checkbox"}
      <label class="menu-item menu-item-checkbox">
        <input
          type="checkbox"
          bind:checked={template[i].checked}
          onclick={(event) => {
            closeMenu();
            item.click?.({ ...event, triggeredByAccelerator: false });
          }}
        />
        {@render menuItem(item)}
      </label>
    {:else if item.type === "radio"}
      <label class="menu-item menu-item-radio">
        <input
          type="radio"
          name={radioName}
          onclick={(event) => {
            closeMenu();
            item.click?.({ ...event, triggeredByAccelerator: false });
          }}
        />
        {@render menuItem(item)}
      </label>
    {/if}
  {/each}
</div>

<style>
  .menu {
    flex-direction: column;
    position-area: end span-end;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: light-dark(#d0d0d0, #303030);
    color: light-dark(#000, #fff);
    opacity: 0;
    white-space: nowrap;
    translate: 0 -16px;
    box-shadow: 0 0 8px #000;
    transition:
      display 250ms allow-discrete,
      overlay 250ms allow-discrete,
      opacity 250ms,
      translate 250ms;

    &.menu-bar {
      display: flex;
      flex-direction: row;
      background: none;
      color: inherit;
      opacity: 1;
      translate: 0 0;
      box-shadow: none;

      & > .menu-item.menu-item-separator {
        width: 1px;
        height: unset;
      }
    }

    &.menu-submenu {
      position-area: span-end end;
      position-try: flip-inline;
      translate: -16px 0;
    }

    &:popover-open {
      display: flex;
      opacity: 1;
      translate: 0 0;

      @starting-style {
        opacity: 0;
        translate: 0 -16px;

        &.menu-submenu {
          opacity: 0;
          translate: -16px 0;
        }
      }
    }

    & > .menu-item {
      display: flex;
      height: 1lh;
      margin: 4px;
      padding: 0 4px;
      border: none;
      border-radius: 4px;
      background: none;
      color: inherit;
      font: inherit;
      transition: background 250ms;

      &:hover {
        background: #80808020;
      }

      &:active {
        background: #80808040;
      }

      &:disabled {
        background: none;
        opacity: 0.5;
      }

      &.menu-item-separator {
        height: 1px;
        padding: 0;
        background: currentColor;
        opacity: 0.5;
      }

      &.menu-item-checkbox {
        & > input {
          width: 0;
          color: inherit;
          appearance: none;
          mask: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-1,-1 18,18'><path d='m 0,8 5.333 5.333 10.667 -10.667' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'/></svg>")
            center no-repeat;
          transition:
            width 250ms,
            margin 250ms,
            background 250ms;

          &:checked {
            width: 1lh;
            margin-right: 0.5lh;
            background: currentColor;
          }
        }
      }

      &.menu-item-radio {
        & > input {
          width: 0;
          color: inherit;
          appearance: none;
          mask: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-1,-1 18,18'><circle cx='8' cy='8' r='4' fill='currentColor'/></svg>")
            center no-repeat;
          transition:
            width 250ms,
            margin 250ms,
            background 250ms;

          &:checked {
            width: 1lh;
            margin-right: 0.5lh;
            background: currentColor;
          }
        }
      }

      & > .menu-item-accelerator {
        margin-inline-start: auto;
        opacity: 0.5;

        &::before {
          content: " ";
          white-space: pre;
        }
      }

      &:not(:has(.menu-item-accelerator)) > .menu-item-right-icon {
        margin-inline-start: auto;
      }
    }
  }
</style>
