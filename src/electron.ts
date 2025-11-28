import * as electron from "electron";

export function initMain() {
  electron.ipcMain.on("efd-ui:minimize", (event) =>
    electron.BrowserWindow.fromWebContents(event.sender)?.minimize(),
  );
  electron.ipcMain.on("efd-ui:maximize", (event) =>
    electron.BrowserWindow.fromWebContents(event.sender)?.maximize(),
  );
  electron.ipcMain.on("efd-ui:unmaximize", (event) =>
    electron.BrowserWindow.fromWebContents(event.sender)?.unmaximize(),
  );
  electron.ipcMain.on("efd-ui:close", (event) =>
    electron.BrowserWindow.fromWebContents(event.sender)?.close(),
  );
  electron.ipcMain.handle(
    "efd-ui:get-desktop-environment",
    () => process.env.XDG_CURRENT_DESKTOP,
  );
  electron.ipcMain.handle("efd-ui:get-button-layout", async () =>
    (await import("node-gsettings-wrapper")).default.Key.findById(
      "org.gnome.desktop.wm.preferences",
      "button-layout",
    ).getValue(),
  );
  electron.app.on("browser-window-created", (_event, win) => {
    win.on("maximize", () => win.webContents.send("efd-ui:maximize"));
    win.on("unmaximize", () => win.webContents.send("efd-ui:unmaximize"));
    if (win.isMaximized()) {
      win.webContents.send("efd-ui:maximize");
    }
  });
}

export function initPreload() {
  electron.contextBridge.exposeInMainWorld("efdUI", {
    minimize() {
      electron.ipcRenderer.send("efd-ui:minimize");
    },
    maximize() {
      electron.ipcRenderer.send("efd-ui:maximize");
    },
    unmaximize() {
      electron.ipcRenderer.send("efd-ui:unmaximize");
    },
    close() {
      electron.ipcRenderer.send("efd-ui:close");
    },
    async getDesktopEnvironment() {
      return await electron.ipcRenderer.invoke(
        "efd-ui:get-desktop-environment",
      );
    },
    async getButtonLayout() {
      return await electron.ipcRenderer.invoke("efd-ui:get-button-layout");
    },
    onMaximize(callback: () => void) {
      electron.ipcRenderer.on("efd-ui:maximize", () => callback());
    },
    onUnmaximize(callback: () => void) {
      electron.ipcRenderer.on("efd-ui:unmaximize", () => callback());
    },
  });
}
