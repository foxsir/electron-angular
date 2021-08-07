import { screen, ipcMain } from 'electron';
import defaultOptions from "./DefaultOptions";

export default class WindowEventListen {
  public static listen(win) {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    ipcMain.on("fullScreen", function (event, arg) {
      win.setFullScreen(true);
    });

    ipcMain.on("maximizeWindow", function (event, arg) {
      if(win.isResizable()) {
        if(win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
      win.setResizable(true);
    });

    ipcMain.on("unmaximizeWindow", function (event, arg) {
      win.unmaximize();
      win.setResizable(true);
    });

    ipcMain.on("minimizeWindow", function (event, arg) {
      win.minimize();
    });

    ipcMain.on("restoreWindow", function (event, arg) {
      win.restore();
      win.setResizable(true);
    });

    ipcMain.on("loginWindow", function (event, arg) {
      win.setSize(defaultOptions.size.width, defaultOptions.size.height);
      win.setResizable(false);
      win.center();
    });

    ipcMain.on("normalWindow", function (event, arg) {
      win.setSize(800, 600);
      win.setResizable(true);
      win.center();
    });

    ipcMain.on("closeWindow", function (event, arg) {
      win.hide();
    });

    ipcMain.on("openDevTools", function (event, arg) {
      win.webContents.openDevTools();
      win.setResizable(true);
    });

  }
}
