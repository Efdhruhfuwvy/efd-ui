import { TitleBarOverlay } from "electron";

declare global {
  interface WindowControlsOverlay {
    readonly visible: boolean;
  }

  interface Navigator {
    windowControlsOverlay: WindowControlsOverlay;
  }

  const efdUI: {
    minimize(): void;
    maximize(): void;
    unmaximize(): void;
    close(): void;
    getDesktopEnvironment(): Promise<string>;
    getButtonLayout(): Promise<string>;
    onMaximize(callback: () => void): void;
    onUnmaximize(callback: () => void): void;
  };
}
