import {screen, ipcMain, remote, BrowserWindow} from 'electron';
import defaultOptions from "./DefaultOptions";

export default class WindowEventListen {
  private windows: Set<BrowserWindow> = new Set();

  public setWindows(windows: Set<BrowserWindow>) {
    this.windows = windows;
    this.listen();
  }

  private getFocusedWindow(): Promise<BrowserWindow> {
    return new Promise<Electron.BrowserWindow>((resolve) => {
      let window: BrowserWindow;
      this.windows.forEach(win => {
        if (win.isFocused()) {
          window = win;
        }
      });
      if(window && window.setSize) {
        resolve(window)
      } else {
        setTimeout(() => {
          return this.getFocusedWindow();
        }, 100);
      }
    });
  }

  private listen() {
    ipcMain.on("fullScreen", (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.setFullScreen(true);
      });
    });

    ipcMain.on("maximizeWindow", (event, arg) => {
      this.getFocusedWindow().then(win => {
        if(win.isResizable()) {
          if(win.isMaximized()) {
            win.unmaximize();
          } else {
            win.maximize();
          }
        }
        win.setResizable(true);
      });
    });

    ipcMain.on("unmaximizeWindow", (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.unmaximize();
        win.setResizable(true);
      });
    });

    ipcMain.on("minimizeWindow", (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.minimize();
      });
    });

    ipcMain.on("restoreWindow", (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.restore();
        win.setResizable(true);
      });
    });

    ipcMain.on("loginWindow", (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.setSize(defaultOptions.size.width, defaultOptions.size.height);
        win.setResizable(false);
        win.center();
      });
    });

    ipcMain.on("normalWindow", (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.setSize(800, 600);
        win.setResizable(true);
        win.center();
      });
    });

    ipcMain.on("closeWindow", (event, arg) => {
      this.getFocusedWindow().then(win => {
        this.windows.delete(win);
        win.destroy();
        win = null;
      });
    });

    ipcMain.on("openDevTools", (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.webContents.openDevTools();
        win.setResizable(true);
      });
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
