import { Injectable } from '@angular/core';

const { ipcRenderer } = window.require("electron");


@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor() { }

  fullScreen() {
    ipcRenderer.send("fullScreen");
  }

  minimizeWindow() {
    ipcRenderer.send("minimizeWindow");
  }

  restoreWindow() {
    ipcRenderer.send("restoreWindow");
  }

  maximizeWindow() {
    ipcRenderer.send("maximizeWindow");
  }

  unmaximizeWindow() {
    ipcRenderer.send("unmaximizeWindow");
  }

  loginWindow() {
    ipcRenderer.send("loginWindow");
  }

  normalWindow() {
    ipcRenderer.send("normalWindow");
  }

  closeWindow() {
    ipcRenderer.send("closeWindow");
  }

}
