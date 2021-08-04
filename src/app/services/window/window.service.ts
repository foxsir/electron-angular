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

  maximizeWindow() {
    ipcRenderer.send("maximizeWindow");
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
