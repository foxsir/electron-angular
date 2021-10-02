import { app, BrowserWindow, screen, ipcMain, Menu, globalShortcut, clipboard } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

import WindowEventListen from "./windowEventListen";
import defaultOptions from "./DefaultOptions";
import * as md5 from "blueimp-md5";
import Database from "./Database";

// Initialize remote module
require('@electron/remote/main').initialize();

// 生成设备id文件，每次启动自动生成文件
const os = require('os');
const DeviceID = md5([os.hostname(), os.arch(), os.platform()].join(""));
// const DeviceIDContent = `export default class DeviceID {\n  public static id = "${DeviceID}";\n}`;

process.env.DeviceID = DeviceID;


// 声网：如果使用 Electron 9.x 及以上版本，需要将 allowRendererProcessReuse 设为 false
app.allowRendererProcessReuse = false;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const windows: Set<BrowserWindow> = new Set();
const wel = new WindowEventListen();

function createWindow(): BrowserWindow {

  // const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  const win: BrowserWindow = new BrowserWindow({
    // x: 0,
    // y: 0,
    // width: size.width,
    // height: size.height,
    backgroundColor: "#F1F1F1;",
    show: false,
    resizable: false,
    width: defaultOptions.size.width,
    height: defaultOptions.size.height,
    minWidth: defaultOptions.size.width,
    minHeight: defaultOptions.size.height,
    frame: false,
    webPreferences: {
      webviewTag: true, // 启用webview
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      enableRemoteModule : true, // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
      preload: path.resolve(__dirname, 'agora-renderer.js')
    },
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200').then(res => {
      win.webContents.openDevTools();
    });
  } else {
    registerGlobalShortcut();
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    // win.loadURL(url.format({
    //   pathname: path.join(__dirname, pathIndex),
    //   protocol: 'file:',
    //   slashes: true
    // }));
    win.loadFile(path.join(__dirname, pathIndex)).then(res => {
      // console.dir(res);
    });
  }

  // Emitted when the window is closed.
  // win.on('closed', () => {
  //   // Dereference the window object, usually you would store window
  //   // in an array if your app supports multi windows, this is the time
  //   // when you should delete the corresponding element.
  //   win = null;
  // });

  let template = [
    {
      label: "调试",
      submenu: [
        {
          label: "打开控制台",
          click: function () {
            win.webContents.openDevTools();
          }
        },
        {
          label: "退出",
          click: function () {
            app.exit();
          }
        }
      ]
    }
  ];

  // let menu = Menu.buildFromTemplate(template)
  //
  // // 3.设置菜单到应用中
  // Menu.setApplicationMenu(menu)
  windows.add(win);
  return win;
}

function registerGlobalShortcut() {
  globalShortcut.register('Alt+CommandOrControl+I', () => {
    console.log('open devtool')
  })
  globalShortcut.register('CommandOrControl+R', () => {
    console.log('CR reload')
  })
  globalShortcut.register('Shift+CommandOrControl+R', () => {
    console.log('SCR reload')
  })
}

function runApp() {
  try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () => {
      createWindow();
      // 初始化数据库
      new Database().init().then();

      wel.setWindows(windows);
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (windows.size === 0) {
        createWindow();
      } else {
        // windows[0].show();
        app.show();
      }
    });

    // 使用单例模式打开多个窗口
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
    } else {
      app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        createWindow();
      })
    }

    ipcMain.on("start-screen-capture", (event, message) => {
      console.log('start-screen-capture...');

      const exec = require("child_process").exec;
      exec(path.resolve(__dirname, 'screen-capture/screencapture.exe'), (error, stdout, stderr) => {
        console.log('screen shot finished: ', JSON.stringify(error, stdout, stderr));

        let nativeImage = clipboard.readImage();
        if (!nativeImage.isEmpty()) {
          let base64 = nativeImage.toDataURL();
          event.sender.send('screenshot-finished', base64);
        }
      });
    });

  } catch (e) {
    // Catch Error
    // throw e;
  }
}

runApp();
