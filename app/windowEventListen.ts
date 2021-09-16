import {screen, ipcMain, remote, BrowserWindow} from 'electron';
import defaultOptions from "./DefaultOptions";

export default class WindowEventListen {
  private windows: Set<BrowserWindow> = new Set();

  public setWindows(windows: Set<BrowserWindow>) {
    this.windows = windows;
    this.listen();
  }

  private getFocusedWindow(): BrowserWindow {
    let window: BrowserWindow;
    this.windows.forEach(win => {
      if (win.isFocused()) {
        window = win;
      }
    });
    return window;
  }

  private listen() {
    ipcMain.on("fullScreen", (event, arg) => {
      this.getFocusedWindow().setFullScreen(true);
    });

    ipcMain.on("maximizeWindow", (event, arg) => {
      if(this.getFocusedWindow().isResizable()) {
        if(this.getFocusedWindow().isMaximized()) {
          this.getFocusedWindow().unmaximize();
        } else {
          this.getFocusedWindow().maximize();
        }
      }
      this.getFocusedWindow().setResizable(true);
    });

    ipcMain.on("unmaximizeWindow", (event, arg) => {
      this.getFocusedWindow().unmaximize();
      this.getFocusedWindow().setResizable(true);
    });

    ipcMain.on("minimizeWindow", (event, arg) => {
      this.getFocusedWindow().minimize();
    });

    ipcMain.on("restoreWindow", (event, arg) => {
      this.getFocusedWindow().restore();
      this.getFocusedWindow().setResizable(true);
    });

    ipcMain.on("loginWindow", (event, arg) => {
      this.getFocusedWindow().setSize(defaultOptions.size.width, defaultOptions.size.height);
      this.getFocusedWindow().setResizable(false);
      this.getFocusedWindow().center();
    });

    ipcMain.on("normalWindow", (event, arg) => {
      this.getFocusedWindow().setSize(800, 600);
      this.getFocusedWindow().setResizable(true);
      this.getFocusedWindow().center();
    });

    ipcMain.on("closeWindow", (event, arg) => {
      let win = this.getFocusedWindow();
      this.windows.delete(win);
      win.destroy();
      win = null;
    });

    ipcMain.on("openDevTools", (event, arg) => {
      this.getFocusedWindow().webContents.openDevTools();
      this.getFocusedWindow().setResizable(true);
    });

    ipcMain.on("openUrl", (event, arg) => {
      const win: BrowserWindow = new BrowserWindow({
        frame: true,
      });
      win.loadURL(arg).then(() => {
        win.show();
      });
    });
  }
}
