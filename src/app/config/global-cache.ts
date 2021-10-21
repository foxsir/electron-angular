import { Component, OnInit } from '@angular/core';
import appConfigInterface from "../interfaces/app-config.interface";
export class GlobalCache {
  public static  appConfig:appConfigInterface;
  public static sensitiveList : string[] = [];
  public static loginProtocol : boolean = true;
}
