import { Injectable } from '@angular/core';
import * as localforage from "localforage";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  putChattingCache(alarmData: AlarmItemInterface, message: ChatmsgEntityModel) {
    localforage.getItem("alarmData").then(data => {
      // 缓存中没有数据
      if (data === null) {
        return localforage.setItem("alarmData", {
          [alarmData.alarmItem.dataId]: {
            alarmData: alarmData,
            message: {[message.fingerPrintOfProtocal]: message},
          }
        });
      } else {
        // 有数据时更新
        const check = data[alarmData.alarmItem.dataId];
        const alreadyMessageMap = !check ? {} : check.message;
        return localforage.setItem("alarmData", Object.assign(data, {
          [alarmData.alarmItem.dataId]: {
            alarmData: alarmData,
            message: Object.assign(
              alreadyMessageMap, {[message.fingerPrintOfProtocal]: message}
            ),
          }
        }));
      }
    });
  }

  removeChattingCache(): Promise<any> {
    return localforage.removeItem("alarmData");
  }

  getChattingCache(alarmData: AlarmItemInterface): Promise<any> {
    return new Promise((resolve, reject) => {
      localforage.getItem("alarmData").then(data => {
        if (data === null) {
          resolve(data);
        } else {
          const cache = data[alarmData.alarmItem.dataId];
          resolve(!cache ? null : cache.message);
        }
      });
    });
  }

}
