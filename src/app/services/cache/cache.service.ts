import { Injectable } from '@angular/core';
import * as localforage from "localforage";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {MessageRoamService} from "@services/message-roam/message-roam.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {RoamLastMsgModel} from "@app/models/roam-last-msg.model";
import {ProtocalModel, ProtocalModelDataContent} from "@app/models/protocal.model";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import {RosterProviderService} from "@services/roster-provider/roster-provider.service";
import FriendModel from "@app/models/friend.model";
import {Subject} from "rxjs";

interface CacheItem {
  alarmData: unknown;
  friendList: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  // 缓存更新使用统一订阅，订阅着需要自己去获取相应的缓存
  private cacheSource = new Subject<Partial<CacheItem>>();
  public cacheUpdate$ = this.cacheSource.asObservable();

  constructor(
    private messageRoamService: MessageRoamService,
    private messageEntityService: MessageEntityService,
    private rosterProviderService: RosterProviderService,
  ) { }

  /**
   * 缓存消息
   * @param alarmData
   * @param message
   */
  putChattingCache(alarmData: AlarmItemInterface, message: ChatmsgEntityModel = null): Promise<any> {
    return localforage.getItem("alarmData").then(data => {
      // 缓存中没有数据
      const cache = message !== null ? {[message.fingerPrintOfProtocal]: message} : {};
      alarmData.alarmItem.msgContent = !message ? "" : message.text;
      if (data === null) {
        return localforage.setItem("alarmData", {
          [alarmData.alarmItem.dataId]: {
            alarmData: alarmData,
            message: cache,
          }
        }).then((newCache) => {
          this.cacheSource.next({friendList: newCache});
        });
      } else {
        // 有数据时更新
        const check = data[alarmData.alarmItem.dataId];
        const alreadyMessageMap = !check ? {} : check.message;
        return localforage.setItem("alarmData", Object.assign(data, {
          [alarmData.alarmItem.dataId]: {
            alarmData: alarmData,
            message: Object.assign(
              alreadyMessageMap, cache
            ),
          }
        })).then((newCache) => {
          this.cacheSource.next({alarmData: newCache});
        });
      }
    });
  }

  /**
   * 检查本地缓存是否是最新
   * @param alarmData
   */
  public checkCacheIsNewest(alarmData: AlarmItemInterface) {
    this.getChattingCache(alarmData).then(data => {
      this.getAllLastMessage().then(all => {
        console.dir(all[alarmData.alarmItem.dataId]);
      });
    });
  }

  /**
   * 删除会话列表本地缓存
   * @param alarmData
   */
  removeChattingCache(alarmData: AlarmItemInterface): Promise<any> {
    return new Promise((resolve, reject) => {
      localforage.getItem("alarmData").then(data => {
        delete data[alarmData.alarmItem.dataId];
        localforage.setItem("alarmData", data).then((res) => {
          resolve(res);
        });
      });
    });
  }

  /**
   * 根据会话获取消息缓存
   * @param alarmData
   */
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

  /**
   * 获取聊天列表缓存
   */
  getChattingList(): Promise<unknown> {
    return localforage.getItem("alarmData");
  }

  /**
   * 从服务器同步聊天列表，并缓存列表, 返回同步后的聊天列表
   * @constructor
   */
  SyncChattingList(chattingListCache: unknown): Promise<AlarmItemInterface[]> {
    return new Promise((resolve, reject) => {
      this.getAllLastMessage().then(res =>{
        const newList: AlarmItemInterface[] = [];
        const keys = Object.keys(res);
        keys.forEach(id => {
          if(chattingListCache[id] === undefined) {
            const data: RoamLastMsgModel = res[id];
            const protocalModel: ProtocalModel = JSON.parse(data.lastMsg);
            const dataContent: ProtocalModelDataContent = JSON.parse(protocalModel.dataContent);

            const alarmItem: AlarmItemInterface = {
              alarmItem: {
                alarmMessageType: protocalModel.type,
                dataId: id,
                date: protocalModel.recvTime.toString(),
                istop: true,
                msgContent: dataContent.m,
                title: data.remark,
              },
              // 聊天元数据
              metadata: {
                chatType: data.chatType, // "friend" | "group"
              }
            };
            newList.push(alarmItem);
          }
        });
        resolve(newList);
      });
    });
  }

  /**
   * 返回一个以会话id作为索引的对象
   */
  getAllLastMessage(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.messageRoamService.getAllLastMessage().then((res: RoamLastMsgModel[]) => {
        const all = {};
        res.forEach(item => {
          all[item.uid || item.gid] = item;
        });
        resolve(all);
      });
    });
  }

  /**
   * 获取并缓存好友列表
   */
  cacheFriends() {
    this.rosterProviderService.refreshRosterAsync().subscribe((res: NewHttpResponseInterface<any>) => {
      // 服务端返回的是一维RosterElementEntity对象数组
      if(res.status === 200) {
        const friendList: FriendModel[] = res.data;
        if (friendList.length > 0) {
          const data = {};
          friendList.forEach(f => {
            data[f.friendUserUid] = f;
          });
          localforage.setItem("friendList", data).then((newCache) => {
            this.cacheSource.next({friendList: newCache});
          });
        }
      }
    });
  }

  /**
   * 获取好友列表
   */
  getCacheFriends() {
    return localforage.getItem("friendList");
  }


}
