<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    left,
    center,
    right,
    leftWindowControls = true,
    rightWindowControls = true,
  }: {
    left?: Snippet;
    center?: Snippet;
    right?: Snippet;
    leftWindowControls?: boolean;
    rightWindowControls?: boolean;
  } = $props();

  let desktopEnvironment = $state("");
  let buttonLayout = $state(":minimize,maximize,close");
  let maximized = $state(false);

  if (typeof efdUI !== "undefined") {
    efdUI.getDesktopEnvironment().then((de) => (desktopEnvironment = de));
    efdUI.getButtonLayout().then((bl) => (buttonLayout = bl));
    efdUI.onMaximize(() => (maximized = true));
    efdUI.onUnmaximize(() => (maximized = false));
  }
</script>

{#snippet windowControls(side: number)}
  {#if !navigator.windowControlsOverlay.visible}
    <div
      class="title-bar-window-controls"
      class:title-bar-gnome={desktopEnvironment === "GNOME"}
      class:title-bar-ubuntu={desktopEnvironment === "ubuntu:GNOME"}
      class:title-bar-kde={desktopEnvironment === "KDE"}
      class:title-bar-xfce={desktopEnvironment === "XFCE"}
      class:title-bar-mate={desktopEnvironment === "MATE"}
      class:title-bar-lxde={desktopEnvironment === "LXDE" ||
        desktopEnvironment === "LXQt"}
      class:title-bar-cinnamon={desktopEnvironment === "Cinnamon"}
    >
      {#each buttonLayout.split(":")[side]?.split(",") as button}
        {#if button === "minimize" || button === "maximize" || button === "close"}
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button
            class="title-bar-{button === 'maximize'
              ? maximized
                ? 'unmaximize'
                : 'maximize'
              : button}"
            tabindex={-1}
            onclick={() => {
              if (button === "minimize") {
                efdUI.minimize();
              } else if (button === "maximize") {
                if (maximized) {
                  efdUI.unmaximize();
                } else {
                  efdUI.maximize();
                }
              } else if (button === "close") {
                efdUI.close();
              }
            }}
          ></button>
        {/if}
      {/each}
    </div>
  {/if}
{/snippet}

<div class="title-bar">
  <div class="title-bar-left">
    {#if leftWindowControls}
      {@render windowControls(0)}
    {/if}
    {@render left?.()}
  </div>
  <div class="title-bar-center">
    {@render center?.()}
  </div>
  <div class="title-bar-right">
    {@render right?.()}
    {#if rightWindowControls}
      {@render windowControls(1)}
    {/if}
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

    & > .title-bar-left {
      flex: 1;
      align-self: stretch;
      display: flex;
      align-items: center;
      padding-inline-start: env(titlebar-area-x);
    }

    & > .title-bar-center {
      align-self: stretch;
      display: flex;
      align-items: center;
    }

    & > .title-bar-right {
      flex: 1;
      align-self: stretch;
      display: flex;
      align-items: center;
      justify-content: end;
      padding-inline-end: calc(
        100vw - env(titlebar-area-x) - env(titlebar-area-width)
      );
    }

    & > :is(.title-bar-left, .title-bar-right) > .title-bar-window-controls {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 12px;

      & > button {
        display: grid;
        position: relative;
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 50%;
        background: none;
        color: inherit;

        &:hover {
          background: #80808020;
        }

        &:active {
          background: #80808040;
        }

        &.title-bar-minimize::after {
          mask-image: url("images/title-bar/generic-minimize.svg");
        }

        &.title-bar-maximize::after {
          mask-image: url("images/title-bar/generic-maximize.svg");
        }

        &.title-bar-unmaximize::after {
          mask-image: url("images/title-bar/generic-unmaximize.svg");
        }

        &.title-bar-close::after {
          mask-image: url("images/title-bar/generic-close.svg");
        }

        &::after {
          content: "";
          background: currentColor;
          mask-size: 100%;
        }
      }

      &.title-bar-gnome > button {
        background: light-dark(#3d3d3d1a, #f7f7f71a);

        &:hover {
          background: light-dark(#19191926, #f4f4f426);
        }

        &:active {
          background: light-dark(#0a0a0a40, #eaeaea40);
        }

        &.title-bar-minimize::after {
          mask-image: url("images/title-bar/gnome-minimize.svg");
        }

        &.title-bar-maximize::after {
          mask-image: url("images/title-bar/gnome-maximize.svg");
        }

        &.title-bar-unmaximize::after {
          mask-image: url("images/title-bar/gnome-unmaximize.svg");
        }

        &.title-bar-close::after {
          mask-image: url("images/title-bar/gnome-close.svg");
        }

        &::after {
          mask-position: center;
          mask-size: 16px;
          mask-repeat: no-repeat;
        }
      }

      &.title-bar-ubuntu > button {
        width: 24px;
        height: 24px;
        background: light-dark(#3d3d3d1a, #f7f7f71a);

        &:hover {
          background: light-dark(#19191926, #f4f4f426);
        }

        &:active {
          background: light-dark(#0a0a0a40, #eaeaea40);
        }

        &.title-bar-minimize::after {
          mask-image: url("images/title-bar/ubuntu-minimize.svg");
        }

        &.title-bar-maximize::after {
          mask-image: url("images/title-bar/ubuntu-maximize.svg");
        }

        &.title-bar-unmaximize::after {
          mask-image: url("images/title-bar/ubuntu-unmaximize.svg");
        }

        &.title-bar-close::after {
          mask-image: url("images/title-bar/ubuntu-close.svg");
        }

        &::after {
          mask-position: center;
          mask-size: 16px;
          mask-repeat: no-repeat;
        }
      }

      &.title-bar-kde {
        gap: 0;
        margin: 0;

        & > button {
          box-sizing: content-box;
          width: 18px;
          height: 18px;
          padding-block: calc((100% - 18px) / 2);
          padding-inline: 12px;
          border-radius: 0;

          &:is(:hover, :active) {
            background: none;
          }

          &.title-bar-minimize {
            &:hover::after {
              mask-image: url("images/title-bar/kde-minimize-hover.svg");
            }

            &:active::after {
              mask-image: url("images/title-bar/kde-minimize-active.svg");
            }

            &::after {
              mask-image: url("images/title-bar/kde-minimize.svg");
            }
          }

          &.title-bar-maximize {
            &:hover::after {
              mask-image: url("images/title-bar/kde-maximize-hover.svg");
            }

            &:active::after {
              mask-image: url("images/title-bar/kde-maximize-active.svg");
            }

            &::after {
              mask-image: url("images/title-bar/kde-maximize.svg");
            }
          }

          &.title-bar-unmaximize {
            &:hover::after {
              mask-image: url("images/title-bar/kde-unmaximize-hover.svg");
            }

            &:active::after {
              mask-image: url("images/title-bar/kde-unmaximize-active.svg");
            }

            &::after {
              mask-image: url("images/title-bar/kde-unmaximize.svg");
            }
          }

          &.title-bar-close {
            &:hover {
              background: url("images/title-bar/kde-close-hover.svg") center /
                100% content-box;

              &::after {
                content: none;
              }
            }

            &:active {
              background: url("images/title-bar/kde-close-active.svg") center /
                100% content-box;

              &::after {
                content: none;
              }
            }

            &::after {
              mask-image: url("images/title-bar/kde-close.svg");
            }
          }
        }
      }

      &.title-bar-cinnamon > button {
        width: 24px;
        height: 24px;

        &:hover {
          background: #80808020;
        }

        &:active {
          background: #80808040;
        }

        &.title-bar-minimize::after {
          mask-image: url("images/title-bar/ubuntu-minimize.svg");
        }

        &.title-bar-maximize::after {
          mask-image: url("images/title-bar/ubuntu-maximize.svg");
        }

        &.title-bar-unmaximize::after {
          mask-image: url("images/title-bar/ubuntu-unmaximize.svg");
        }

        &.title-bar-close {
          background: #249ddd;
          color: light-dark(#fff, #000);

          &:hover {
            background: #37a7e2;
          }

          &:active {
            background: #228dc7;
          }

          &::after {
            mask-image: url("images/title-bar/ubuntu-close.svg");
          }
        }

        &::after {
          mask-position: center;
          mask-size: 16px;
          mask-repeat: no-repeat;
        }
      }
    }
  }
</style>
