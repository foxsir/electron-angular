import {ipcMain, BrowserWindow} from 'electron';
import defaultOptions from "./DefaultOptions";

export default class WindowEventListen {
  private window: BrowserWindow;

  public setWindows(window: BrowserWindow) {
    this.window = window;
    this.listen();
  }

  private getFocusedWindow(): Promise<BrowserWindow> {
    return new Promise<Electron.BrowserWindow>((resolve) => {
      resolve(this.window)
    });
  }

  private listen() {
    const fullScreen = ['fullScreen', process.env.appID].join(":");
    ipcMain.on(fullScreen, (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.setFullScreen(true);
        win.setMinimumSize(defaultOptions.size.width, defaultOptions.size.height);
      });
    });

    const maximizeWindow = ['maximizeWindow', process.env.appID].join(":");
    ipcMain.on(maximizeWindow, (event, arg) => {
      this.getFocusedWindow().then(win => {
        if(win.isResizable()) {
          if(win.isMaximized()) {
            win.unmaximize();
          } else {
            win.maximize();
          }
        }
        win.setResizable(true);
        win.setMinimumSize(defaultOptions.size.width, defaultOptions.size.height);
      });
    });

    const unmaximizeWindow = ['unmaximizeWindow', process.env.appID].join(":");
    ipcMain.on(unmaximizeWindow, (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.unmaximize();
        win.setResizable(true);
        win.setMinimumSize(defaultOptions.size.width, defaultOptions.size.height);
      });
    });

    const minimizeWindow = ['minimizeWindow', process.env.appID].join(":");
    ipcMain.on(minimizeWindow, (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.minimize();
        win.setMinimumSize(defaultOptions.size.width, defaultOptions.size.height);
      });
    });

    const restoreWindow = ['restoreWindow', process.env.appID].join(":");
    ipcMain.on(restoreWindow, (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.restore();
        win.setResizable(true);
        win.setMinimumSize(defaultOptions.size.width, defaultOptions.size.height);
      });
    });

    const loginWindow = ['loginWindow', process.env.appID].join(":");
    ipcMain.on(loginWindow, (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.setMinimumSize(400, 460);
        win.setSize(400, 460);
        win.setResizable(false);
        win.center();
      });
    });

    const normalWindow = ['normalWindow', process.env.appID].join(":");
    ipcMain.on(normalWindow, (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.setSize(800, 600);
        win.setResizable(true);
        win.center();
        win.setMinimumSize(defaultOptions.size.width, defaultOptions.size.height);
      });
    });

    const closeWindow = ['closeWindow', process.env.appID].join(":");
    ipcMain.on(closeWindow, (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.close();
      });
    });

    const openDevTools = ['openDevTools', process.env.appID].join(":");
    ipcMain.on(openDevTools, (event, arg) => {
      this.getFocusedWindow().then(win => {
        win.webContents.openDevTools();
        win.setMinimumSize(defaultOptions.size.width, defaultOptions.size.height);
        win.setResizable(true);
      });
    });

    const openUrl = ['openUrl', process.env.appID].join(":");
    ipcMain.on(openUrl, (event, arg) => {
      const win: BrowserWindow = new BrowserWindow({
        frame: true,
      });
      win.loadURL(arg).then(() => {
        win.setMinimumSize(defaultOptions.size.width, defaultOptions.size.height);
        win.show();
      });
    });
  }
}
