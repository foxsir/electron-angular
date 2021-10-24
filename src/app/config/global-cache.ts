import { Component, OnInit } from '@angular/core';
import appConfigInterface from "../interfaces/app-config.interface";
export class GlobalCache {
  public static appConfig: appConfigInterface;
  public static sensitiveList: string[] = [];
  public static loginProtocol: boolean = true;
  public static messageNumber: number = 0;

  static setAppConfig(appConfig: appConfigInterface) {
    GlobalCache.appConfig = appConfig;
    sessionStorage.setItem('global-cache-appConfig', JSON.stringify(appConfig));
  }

  static setSensitiveList(list: string[]) {
    GlobalCache.sensitiveList = list;
    sessionStorage.setItem('global-cache-sensitiveList', JSON.stringify(list));
  }

  static setLoginProtocol(loginProtocol: boolean) {
    GlobalCache.loginProtocol = loginProtocol;
    sessionStorage.setItem('global-cache-loginProtocol', JSON.stringify(loginProtocol));
  }

  static setMessageNumber(messageNumber: number) {
    GlobalCache.messageNumber = messageNumber;
    sessionStorage.setItem('global-cache-loginProtocol', JSON.stringify(messageNumber));
  }

  static getAll() {
    if(sessionStorage.getItem('global-cache-appConfig')?.length > 0) {
      GlobalCache.appConfig = JSON.parse(sessionStorage.getItem('global-cache-appConfig'));
    }
    if(sessionStorage.getItem('global-cache-sensitiveList')?.length > 0) {
      GlobalCache.sensitiveList = JSON.parse(sessionStorage.getItem('global-cache-sensitiveList'));
    }
    if(sessionStorage.getItem('global-cache-loginProtocol')?.length > 0) {
      GlobalCache.loginProtocol = JSON.parse(sessionStorage.getItem('global-cache-loginProtocol'));
    }
    if(sessionStorage.getItem('global-cache-messageNumber')?.length > 0) {
      GlobalCache.messageNumber = JSON.parse(sessionStorage.getItem('global-cache-messageNumber'));
    }

    return GlobalCache;
  }

}
