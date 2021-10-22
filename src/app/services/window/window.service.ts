import { Injectable } from '@angular/core';
import {ElectronService} from "@app/core/services";

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor(
    private electronService: ElectronService
  ) { }

  fullScreen() {
    this.electronService.ipcRendererSend("fullScreen");
  }

  minimizeWindow() {
    this.electronService.ipcRendererSend("minimizeWindow");
  }

  restoreWindow() {
    this.electronService.ipcRendererSend("restoreWindow");
  }

  maximizeWindow() {
    this.electronService.ipcRendererSend("maximizeWindow");
  }

  unmaximizeWindow() {
    this.electronService.ipcRendererSend("unmaximizeWindow");
  }

  loginWindow() {
    this.electronService.ipcRendererSend("loginWindow");
  }

  normalWindow() {
    this.electronService.ipcRendererSend("normalWindow");
  }

  closeWindow() {
    this.electronService.ipcRendererSend("closeWindow");
  }

  openDevTools() {
    this.electronService.ipcRendererSend("openDevTools");
  }

  openUrl(url: string) {
    this.electronService.ipcRendererSend("openUrl", url);
  }

}
