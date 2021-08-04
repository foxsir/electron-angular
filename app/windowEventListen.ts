export default class WindowEventListen {
  public static listen(win, ipcMain) {
    ipcMain.on("fullScreen", function (event, arg) {
      win.setSize(800, 600);
      win.center();
    });

    ipcMain.on("minimizeWindow", function (event, arg) {
      win.setSize(800, 600);
      win.center();
    });

    ipcMain.on("maximizeWindow", function (event, arg) {
      win.setSize(800, 600);
      win.center();
    });

    ipcMain.on("loginWindow", function (event, arg) {
      win.setSize(400, 440);
      win.center();
    });

    ipcMain.on("normalWindow", function (event, arg) {
      win.setSize(800, 600);
      win.center();
    });

    ipcMain.on("closeWindow", function (event, arg) {
      win.setSize(800, 600);
      win.center();
    });

  }
}
