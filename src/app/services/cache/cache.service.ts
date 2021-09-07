import {Injectable, OnInit} from '@angular/core';
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
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {GroupModel} from "@app/models/group.model";
import {GroupAdminModel} from "@app/models/group-admin.model";
import {UserModel} from "@app/models/user.model";
import CommonTools from "@app/common/common.tools";
import {MessageService} from "@services/message/message.service";
import {HistoryMessageService} from "@services/history-message/history-message.service";
import {ChatModeType} from "@app/config/rbchat-config";

interface CacheItem {
  alarmData: unknown;
  friendList: unknown;
  groupList: unknown;
  groupAdminList: unknown;
  myInfo: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  // 缓存更新使用统一订阅，订阅着需要自己去获取相应的缓存
  private cacheSource = new Subject<Partial<CacheItem>>();
  public cacheUpdate$ = this.cacheSource.asObservable();

  private dataKeys = {
    alarmData: "alarmData",
    friendList: "friendList",
    groupList: "groupList",
    groupAdminList: "groupAdminList",
    myInfo: "myInfo",
  };

  constructor(
    private messageRoamService: MessageRoamService,
    private messageEntityService: MessageEntityService,
    private rosterProviderService: RosterProviderService,
    private restService: RestService,
    private localUserService: LocalUserService,
    private messageService: MessageService,
    private historyMessageService: HistoryMessageService,
  ) {
    const userId = this.localUserService.localUserInfo.userId;
    for (const key in this.dataKeys) {
      if(this.dataKeys.hasOwnProperty(key)) {
        this.dataKeys[key] = [this.dataKeys[key], CommonTools.md5(userId.toString())].join("-");
      }
    }
  }

  /**
   * 缓存消息
   * @param alarmData
   * @param messages
   */
  putChattingCache(alarmData: AlarmItemInterface, messages: ChatmsgEntityModel | ChatmsgEntityModel[] = null): Promise<any> {
    return localforage.getItem(this.dataKeys.alarmData).then(data => {
      // 缓存中没有数据
      let cache = {};
      if(messages !== null) {
        if(messages.hasOwnProperty("length")) {
          messages = messages as ChatmsgEntityModel[];
          messages.forEach(msg => {
            cache[msg.fingerPrintOfProtocal] = msg;
          });
          alarmData.alarmItem.msgContent = messages.slice(-1)[0].text;
        } else {
          messages  = messages as ChatmsgEntityModel;
          cache = {[messages.fingerPrintOfProtocal]: messages};
          alarmData.alarmItem.msgContent = messages.text;
        }
      }

      if (data === null) {
        return localforage.setItem(this.dataKeys.alarmData, {
          [alarmData.alarmItem.dataId]: {
            alarmData: alarmData,
            message: cache,
          }
        }).then((newCache) => {
          this.cacheSource.next({alarmData: newCache});
        });
      } else {
        // 有数据时更新
        const check = data[alarmData.alarmItem.dataId];
        const alreadyMessageMap = !check ? {} : check.message;
        if(check) {
          alarmData.metadata.unread = check.alarmData.metadata.unread;
        }
        return localforage.setItem(this.dataKeys.alarmData, Object.assign(data, {
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
   * 清除未读数
   * @param alarmData
   * @param badges
   */
  setChattingBadges(alarmData: AlarmItemInterface, badges: number) {
    localforage.getItem(this.dataKeys.alarmData).then(data => {
      const check = data[alarmData.alarmItem.dataId];
      const alreadyMessageMap = !check ? {} : check.message;
      if(check) {
        if(badges > 0) {
          check.alarmData.metadata.unread = check.alarmData.metadata.unread || 0;
          alarmData.metadata.unread = check.alarmData.metadata.unread + badges;
        }
        localforage.setItem(this.dataKeys.alarmData, Object.assign(data, {
          [alarmData.alarmItem.dataId]: {
            alarmData: alarmData,
            message: Object.assign(
              alreadyMessageMap
            ),
          }
        })).then((newCache) => {
          this.cacheSource.next({alarmData: newCache});
        });
      }
    });
  }

  /**
   * 删除本地消息缓存
   * @param alarmData
   * @param messages
   */
  deleteChattingCache(alarmData: AlarmItemInterface, messages: ChatmsgEntityModel[] = null): Promise<any> {
    return localforage.getItem(this.dataKeys.alarmData).then(data => {
      const check = data[alarmData.alarmItem.dataId];
      const alreadyMessageMap = !check ? {} : check.message;
      if(check) {
        messages.forEach(m => {
          delete alreadyMessageMap[m.fingerPrintOfProtocal];
        });
        return localforage.setItem(this.dataKeys.alarmData, Object.assign(data, {
          [alarmData.alarmItem.dataId]: {
            alarmData: alarmData,
            message: alreadyMessageMap,
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
      localforage.getItem(this.dataKeys.alarmData).then(data => {
        delete data[alarmData.alarmItem.dataId];
        localforage.setItem(this.dataKeys.alarmData, data).then((res) => {
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
      localforage.getItem(this.dataKeys.alarmData).then(data => {
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
    return localforage.getItem(this.dataKeys.alarmData);
  }

  /**
   * 从服务器同步聊天列表，并缓存列表, 返回同步后的聊天列表
   * @constructor
   */
  async syncChattingList(chattingListCache: unknown): Promise<AlarmItemInterface[]> {
    const friends = await this.getCacheFriends().then(res => res);
    const groups = await this.getCacheGroups().then(res => res);

    return new Promise((resolve, reject) => {
      this.getAllLastMessage().then(res =>{
        console.dir("getAllLastMessage");
        const newList: AlarmItemInterface[] = [];
        const keys = Object.keys(res);

        this.getCacheFriends();

        keys.forEach(dataID => {
          const data: RoamLastMsgModel = res[dataID];
          const protocalModel: ProtocalModel = JSON.parse(data.lastMsg);
          const dataContent: ProtocalModelDataContent = JSON.parse(protocalModel.dataContent);

          let title = "";
          let avatar = "";
          if(data.chatType === 'friend' && friends[dataID]) {
            title = friends[dataID].nickname;
            avatar = friends[dataID].userAvatarFileName;
          } else if(groups[dataID]) {
            title = groups[dataID].gname;
            avatar = groups[dataID].avatar;
          }

          const alarmItem: AlarmItemInterface = {
            alarmItem: {
              alarmMessageType: protocalModel.type,
              dataId: dataID,
              date: protocalModel.recvTime.toString(),
              istop: true,
              msgContent: this.messageService.parseMessageForShow(dataContent.m, dataContent.ty),
              title: title,
              avatar: avatar,
            },
            // 聊天元数据
            metadata: {
              chatType: data.chatType, // "friend" | "group"
              unread: data.unread
            }
          };
          // 将本地不存在的对话返回到聊天列表
          if(chattingListCache[dataID] === undefined) {
            newList.push(alarmItem);
          }
          // 同步消息
          console.dir("chattingListCache");
          this.syncMessage(alarmItem, protocalModel);
        });
        newList.forEach(item => {
          if(item.metadata.chatType === 'group') {
            const g = groups[item.alarmItem.dataId];
          }
          if(item.metadata.chatType === 'friend') {
            const f = friends[item.alarmItem.dataId];
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
          localforage.setItem(this.dataKeys.friendList, data).then((newCache) => {
            this.cacheSource.next({friendList: newCache});
          });
        }
      }
    });
  }

  /**
   * 获取并缓存群列表
   */
  cacheGroups() {
    this.restService.getUserJoinGroup().subscribe((res: NewHttpResponseInterface<GroupModel[]>) => {
      if(res.status === 200) {
        const groupMap = {};
        res.data.forEach(g => {
          groupMap[g.gid] = g;
        });
        localforage.setItem(this.dataKeys.groupList, groupMap).then((newCache) => {
          this.cacheSource.next({groupList: newCache});
        });
      }
    });
  }

  /**
   * 获取并缓存群管理员列表
   */
  cacheGroupAdmins(gid: string) {
    this.restService.getGroupAdminList(gid).subscribe((res: NewHttpResponseInterface<GroupAdminModel[]>) => {
      if(res.status === 200) {
        const groupAdminMap = {};
        res.data.forEach(admin => {
          groupAdminMap[admin.userUid] = admin;
        });

        let newData = {};
        localforage.getItem(this.dataKeys.groupAdminList).then(data => {
          if(data) {
            data[gid] = groupAdminMap;
            newData = data;
          } else {
            newData[gid] = groupAdminMap;
          }
          localforage.setItem(this.dataKeys.groupAdminList, newData).then((newCache) => {
            this.cacheSource.next({groupAdminList: newCache});
          });
        });
      }
    });
  }

  /**
   * 获取好友列表
   */
  getCacheGroupAdmins(): Promise<any> {
    return localforage.getItem(this.dataKeys.groupAdminList);
  }

  /**
   * 获取好友列表
   */
  getCacheFriends(): Promise<any> {
    return localforage.getItem(this.dataKeys.friendList);
  }

  /**
   * 获取群列表
   */
  getCacheGroups(): Promise<any> {
    return localforage.getItem(this.dataKeys.groupList);
  }

  /**
   * 清空缓存
   */
  clearAllCache() {
    return localforage.clear();
  }

  /**
   * 缓存个人信息
   */
  cacheMyInfo(): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const localUserInfo = this.localUserService.localUserInfo;
      this.restService.getUserBaseById(localUserInfo.userId.toString()).subscribe((res: NewHttpResponseInterface<UserModel>) => {
        if(res.status === 200) {
          localforage.setItem(this.dataKeys.myInfo, res.data).then(data => {
            this.cacheSource.next({myInfo: data});
            resolve(data);
          });
        }
      });
    });
  }

  /**
   * 获取个人信息
   */
  getMyInfo(): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      localforage.getItem(this.dataKeys.myInfo).then((data: UserModel) => {
        if(data) {
          resolve(data);
        } else {
          this.cacheMyInfo().then(cache => {
            resolve(cache);
          });
        }
      });
    });
  }

  /**
   * 同步其他客户端更新的消息
   * @param alarmItem
   * @param protocal
   */
  private syncMessage(alarmItem: AlarmItemInterface, protocal: ProtocalModel) {
    this.getChattingCache(alarmItem).then(data => {
      let localLastMsgFP = "0";
      if(data) {
        const list: ChatmsgEntityModel[] = Object.values(data);
        const localLastMsg = list.slice(-1)[0];
        localLastMsgFP = localLastMsg.fingerPrintOfProtocal;
      }
      if(localLastMsgFP !== protocal.fp) {
        if(alarmItem.metadata.chatType === 'friend') {
          this.historyMessageService.getFriendMessage(
            alarmItem,
            {start: localLastMsgFP, end: protocal.fp},
          'end',
            0
          ).subscribe(res => {
            if(res.status === 200 && res.data) {
              const entityList = [];
              res.data.list.forEach(msg => {
                const msgJson: ProtocalModel = JSON.parse(msg);
                let chatMsgEntity: ChatmsgEntityModel;
                const dataContent = JSON.parse(msgJson.dataContent);
                if(msgJson.from === this.localUserService.localUserInfo.userId.toString()) {
                  chatMsgEntity = this.messageEntityService.prepareSendedMessage(
                    dataContent.m, msgJson.recvTime, msgJson.fp, dataContent.ty
                  );
                } else {
                  chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
                    msgJson.from, alarmItem.alarmItem.title, dataContent.m, msgJson.recvTime, dataContent.ty, msgJson.fp
                  );
                }
                entityList.unshift(chatMsgEntity);
              });
              this.putChattingCache(alarmItem, entityList).then(() => {
                this.setChattingBadges(alarmItem, alarmItem.metadata.unread);
              });
            }
          });
        } else if(alarmItem.metadata.chatType === 'group') {
          this.historyMessageService.getGroupMessage(
            alarmItem,
            {start: localLastMsgFP, end: protocal.fp},
            'end',
            0
          ).subscribe(res => {
            if(res.status === 200 && res.data) {
              const entityList = [];
              res.data.list.forEach(msg => {
                const msgJson: ProtocalModel = JSON.parse(msg);
                let chatMsgEntity: ChatmsgEntityModel;
                const dataContent = JSON.parse(msgJson.dataContent);
                if(msgJson.from === this.localUserService.localUserInfo.userId.toString()) {
                  chatMsgEntity = this.messageEntityService.prepareSendedMessage(
                    dataContent.m, msgJson.recvTime, msgJson.fp, dataContent.ty
                  );
                } else {
                  chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
                    msgJson.from, "nickName", dataContent.m, msgJson.recvTime, dataContent.ty, msgJson.fp
                  );
                }
                entityList.unshift(chatMsgEntity);
              });
              this.putChattingCache(alarmItem, entityList).then(() => {
                this.setChattingBadges(alarmItem, alarmItem.metadata.unread);
              });
            }
          });
        }
      }
    });
  }

  /**
   * 使用 ProtocalModel 构建 AlarmItemInterface
   * @param protocal
   */
  public async generateAlarmItem(protocal: ProtocalModel): Promise<AlarmItemInterface> {
    const friends = await this.getCacheFriends().then(res => res);
    const groups = await this.getCacheGroups().then(res => res);

    return new Promise((resolve, reject) => {
      const dataContent: ProtocalModelDataContent = JSON.parse(protocal.dataContent);

      let chatType = "friend";
      if(dataContent.cy === ChatModeType.CHAT_TYPE_GROUP$CHAT) {
        chatType = 'group';
      }
      const alarm =  {
        alarmItem: {
          alarmMessageType: dataContent.cy,
          dataId: chatType === 'group' ? dataContent.t : protocal.from,
          date: protocal.recvTime.toString(),
          istop: true,
          msgContent: this.messageService.parseMessageForShow(dataContent.m, dataContent.ty),
          title: null,
          avatar: null,
        },
        metadata: {
          chatType: chatType
        }
      };
      if(chatType === 'group') {
        alarm.alarmItem.title = groups[alarm.alarmItem.dataId].gname;
        alarm.alarmItem.avatar = groups[alarm.alarmItem.dataId].avatar;
      } else {
        alarm.alarmItem.title = friends[alarm.alarmItem.dataId].nickname;
        alarm.alarmItem.avatar = friends[alarm.alarmItem.dataId].userAvatarFileName;
      }

      resolve(alarm);
    });
  }

}
