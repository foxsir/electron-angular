import {
  app, BrowserWindow, screen, ipcMain, Menu, globalShortcut, clipboard,
  Tray
} from 'electron';
import * as path from 'path';
import * as fs from 'fs';

import WindowEventListen from "./windowEventListen";
import defaultOptions from "./DefaultOptions";
import * as md5 from "blueimp-md5";
import Database from "./Database";
import SaveFile from "./SaveFile";
import {exec} from "child_process";

// Initialize remote module
require('@electron/remote/main').initialize();

// 生成设备id文件，每次启动自动生成文件
const os = require('os');
const DeviceID = md5([os.hostname(), os.arch(), os.platform(), os.userInfo().username].join(""));
// const DeviceIDContent = `export default class DeviceID {\n  public static id = "${DeviceID}";\n}`;

process.env.DeviceID = DeviceID;

let registerGlobal = false;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const windows: Set<BrowserWindow> = new Set();

function createWindow(): BrowserWindow {
  // 用来区分多个标签
  process.env.appID = new Date().getTime().toString();

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  let win: BrowserWindow = new BrowserWindow({
    // x: 0,
    // y: 0,
    // width: size.width,
    // height: size.height,
    backgroundColor: "#F1F1F1;",
    show: true,
    resizable: false,
    width: 400,
    height: 460,
    // width: 600,
    // height: 440,
    frame: false,
    webPreferences: {
      webviewTag: true, // 启用webview
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      enableRemoteModule : true, // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
      // preload: path.resolve(__dirname, 'agora-renderer.js')
    },
  });


  win.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    // item.setSavePath('/tmp/save.pdf')

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          // console.log('Download is paused')
        } else {
          // console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        win.webContents.send("download-completed", true);
        // console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })

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
    if(registerGlobal === false) {
      registerGlobalShortcut();
      registerGlobal = true;
    }
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
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
    windows.delete(win);
  });

  // 初始化数据库
  new Database().init().then();
  new SaveFile().init().then();

  const wel = new WindowEventListen();
  wel.setWindows(win);

  const startScreenCapture = ['start-screen-capture', process.env.appID].join(":");
  const screenshotFinished = ['screenshot-finished', process.env.appID].join(":");
  ipcMain.on(startScreenCapture, (event, message) => {
    console.log('start-screen-capture...');

    const exec = require("child_process").exec;
    exec(path.resolve(__dirname, 'screen-capture/screencapture.exe'), (error, stdout, stderr) => {
      console.log('screen shot finished: ', JSON.stringify(error, stdout, stderr));

      let nativeImage = clipboard.readImage();
      if (!nativeImage.isEmpty()) {
        let base64 = nativeImage.toDataURL();
        event.sender.send(screenshotFinished, base64);
      }
    });
  });

  // 设置托盘
  /*const tray = new Tray(path.resolve(__dirname, 'favicon.ico'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)*/
  // tray.destroy()


  windows.add(win);

  return win;
}

function registerGlobalShortcut() {
  globalShortcut.register('Alt+CommandOrControl+I', () => {
    console.log('open devtool')
  })
  globalShortcut.register('Ctrl+CommandOrControl+I', () => {
    console.log('open devtool')
  })
  globalShortcut.register('CommandOrControl+R', () => {
    console.log('CR reload')
  })
  globalShortcut.register('Shift+CommandOrControl+R', () => {
    console.log('SCR reload')
  })
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 500));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
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

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windows.size === 0) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
