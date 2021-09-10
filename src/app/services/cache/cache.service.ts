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
import {HttpService} from "@services/http/http.service";
import {_HTTP_SERVER_URL} from "@app/config/post-api";
import {SoundService} from "@services/sound/sound.service";
import SessionStatusModel from "@app/models/session-status.model";

export type AlarmDataMap = Map<string, {alarmData: AlarmItemInterface; message?: Map<string, ChatmsgEntityModel>}>;

interface CacheItem {
  alarmData: AlarmDataMap;
  friendList: Map<string, FriendModel>;
  groupList: Map<string, GroupModel>;
  groupAdminList: Map<string, Map<number, GroupAdminModel>>;
  myInfo: UserModel;
  mute: Map<string, boolean>;
  top: Map<string, boolean>;
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
    mute: "mute",
    top: "top",
  };

  constructor(
    private messageRoamService: MessageRoamService,
    private messageEntityService: MessageEntityService,
    private rosterProviderService: RosterProviderService,
    private restService: RestService,
    private localUserService: LocalUserService,
    private messageService: MessageService,
    private historyMessageService: HistoryMessageService,
    private httpService: HttpService,
    private soundService: SoundService
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
   * @param position end 向下合并，top 向上合并
   */
  putChattingCache(
    alarmData: AlarmItemInterface, messages: ChatmsgEntityModel | ChatmsgEntityModel[] = null, position: 'top' | 'end' = 'end'
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      localforage.getItem(this.dataKeys.alarmData).then((data: Map<string, any>) => {
        // 缓存中没有数据
        const cache = new Map();
        if(messages !== null) {
          if(messages.hasOwnProperty("length")) {
            messages = messages as ChatmsgEntityModel[];
            messages.forEach(msg => {
              cache.set(msg.fingerPrintOfProtocal, msg);
            });
            alarmData.alarmItem.msgContent = messages.slice(-1)[0]?.text;
          } else {
            messages  = messages as ChatmsgEntityModel;
            cache.set(messages.fingerPrintOfProtocal, messages);
            alarmData.alarmItem.msgContent = messages.text;
          }
        }

        if (data === null) {
          const map = new Map();
          map.set(alarmData.alarmItem.dataId, {
            alarmData: alarmData,
            message: cache,
          });
          localforage.setItem(this.dataKeys.alarmData, map).then((newCache) => {
            resolve(newCache);
            this.cacheSource.next({alarmData: newCache});
          });
        } else {
          // 有数据时更新
          const check = data.get(alarmData.alarmItem.dataId);
          const alreadyMessageMap = !check ? new Map() : check.message;
          if(check) {
            alarmData.metadata.unread = check.alarmData.metadata.unread;
          }

          let newMessages: Map<string, ChatmsgEntityModel>;
          if(position === 'end') {
            newMessages = new Map([...alreadyMessageMap, ...cache]);
          } else {
            newMessages = new Map([...cache, ...alreadyMessageMap]);
          }
          data.set(alarmData.alarmItem.dataId, {
            alarmData: alarmData,
            message: newMessages,
          });
          localforage.setItem(this.dataKeys.alarmData, data).then((newCache) => {
            resolve(newCache);
            this.cacheSource.next({alarmData: newCache});
          });
        }
      });
    });
  }

  /**
   * 设置未读数
   * @param alarmData
   * @param badges
   */
  setChattingBadges(alarmData: AlarmItemInterface, badges: number) {
    localforage.getItem(this.dataKeys.alarmData).then((data: Map<string, any>) => {
      const check = data.get(alarmData.alarmItem.dataId);
      const alreadyMessageMap = !check ? new Map() : check.message;
      if(check) {
        if(badges > 0) {
          check.alarmData.metadata.unread = check.alarmData.metadata.unread || 0;
          alarmData.metadata.unread = check.alarmData.metadata.unread + badges;
          // 如果不是静音则播放提示音
          this.getMute().then(mute => {
            if(mute.get(alarmData.alarmItem.dataId) !== true) {
              this.soundService.messagePlay().then();
            }
          });
        }
        const map = new Map();
        map.set(alarmData.alarmItem.dataId, {
          alarmData: alarmData,
          message: alreadyMessageMap,
        });
        localforage.setItem(this.dataKeys.alarmData, new Map([...data, ...map])).then((newCache) => {
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
  deleteMessageCache(alarmData: AlarmItemInterface, messages: ChatmsgEntityModel[] = null): Promise<any> {
    return localforage.getItem(this.dataKeys.alarmData).then((data: Map<string, any>) => {
      const check = data.get(alarmData.alarmItem.dataId);
      const alreadyMessageMap: Map<string, any> = !check ? new Map() : check.message;
      if(check) {
        messages.forEach(m => {
          alreadyMessageMap.delete(m.fingerPrintOfProtocal);
        });
        const map = new Map();
        map.set(alarmData.alarmItem.dataId, {
          alarmData: alarmData,
          message: alreadyMessageMap,
        });
        return localforage.setItem(this.dataKeys.alarmData, new Map([...data, ...map])).then((newCache) => {
          this.cacheSource.next({alarmData: newCache});
        });
      }
    });
  }

  /**
   * 清除会话消息
   * @param alarmData
   */
  clearChattingCache(alarmData: AlarmItemInterface): Promise<any> {
    return localforage.getItem(this.dataKeys.alarmData).then((data: Map<string, any>) => {
      const check = data.get(alarmData.alarmItem.dataId);
      if(check) {
        const map = new Map();
        map.set(alarmData.alarmItem.dataId, {
          alarmData: alarmData,
          message: new Map(),
        });
        return localforage.setItem(this.dataKeys.alarmData, new Map([...data, ...map])).then((newCache) => {
          this.cacheSource.next({alarmData: newCache});
        });
      }
    });
  }

  /**
   * 删除会话消息
   * @param alarmData
   */
  deleteChattingCache(alarmData: AlarmItemInterface): Promise<any> {
    return localforage.getItem(this.dataKeys.alarmData).then((data: Map<string, any>) => {
      const check = data.get(alarmData.alarmItem.dataId);
      if(check) {
        data.delete(alarmData.alarmItem.dataId);
        return localforage.setItem(this.dataKeys.alarmData, data).then((newCache) => {
          this.cacheSource.next({alarmData: newCache});
        });
      }
    });
  }

  /**
   * 删除会话列表本地缓存
   * @param alarmData
   */
  removeChattingCache(alarmData: AlarmItemInterface): Promise<Map<string, ChatmsgEntityModel>> {
    return new Promise((resolve, reject) => {
      localforage.getItem(this.dataKeys.alarmData).then((data: Map<string, any>) => {
        data.delete(alarmData.alarmItem.dataId);
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
  getChattingCache(alarmData: AlarmItemInterface): Promise<Map<string, ChatmsgEntityModel>> {
    return new Promise((resolve, reject) => {
      localforage.getItem(this.dataKeys.alarmData).then((data: Map<string, any>) => {
        if (data === null) {
          resolve(data);
        } else {
          const cache = data.get(alarmData.alarmItem.dataId);
          resolve(!cache ? new Map() : cache.message);
        }
      });
    });
  }

  /**
   * 获取聊天列表缓存
   */
  getChattingList(): Promise<AlarmDataMap> {
    return localforage.getItem(this.dataKeys.alarmData);
  }

  /**
   * 从服务器同步聊天列表，并缓存列表, 返回同步后的聊天列表
   * @constructor
   */
  async syncChattingList(chattingListCache: AlarmDataMap): Promise<Map<string, AlarmItemInterface>> {
    const friends = await this.getCacheFriends().then(res => res);
    const groups = await this.getCacheGroups().then(res => res);

    return new Promise((resolve, reject) => {
      this.getAllLastMessage().then((res: Map<string, any>) =>{
        console.dir("getAllLastMessage");
        const newMap: Map<string, AlarmItemInterface> = new Map();

        res.forEach((_, dataID) => {
          const data: RoamLastMsgModel = res.get(dataID);
          const protocalModel: ProtocalModel = JSON.parse(data.lastMsg);
          const dataContent: ProtocalModelDataContent = JSON.parse(protocalModel.dataContent);

          let title = "";
          let avatar = "";
          if(data.chatType === 'friend' && friends && friends.get(dataID)) {
            title = friends.get(dataID).nickname;
            avatar = friends.get(dataID).userAvatarFileName;
          } else if(groups && groups.get(dataID)) {
            title = groups.get(dataID).gname;
            avatar = groups.get(dataID).avatar;
          }

          const alarmItem: AlarmItemInterface = {
            alarmItem: {
              alarmMessageType: protocalModel.type,
              dataId: dataID,
              date: protocalModel.recvTime.toString(),
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
          if(chattingListCache && chattingListCache.get(dataID) === undefined) {
            newMap.set(alarmItem.alarmItem.dataId, alarmItem);
          }
          // 同步消息
          console.dir("chattingListCache");
          this.syncMessage(alarmItem, protocalModel);
        });

        // newList.forEach(item => {
        //   if(item.metadata.chatType === 'group') {
        //     const g = groups[item.alarmItem.dataId];
        //   }
        //   if(item.metadata.chatType === 'friend') {
        //     const f = friends[item.alarmItem.dataId];
        //   }
        // });
        resolve(newMap);
      });
    });
  }

  /**
   * 返回一个以会话id作为索引的对象
   */
  getAllLastMessage(): Promise<Map<string, RoamLastMsgModel>> {
    return new Promise((resolve, reject) => {
      this.messageRoamService.getAllLastMessage().then((res: RoamLastMsgModel[]) => {
        const all = new Map();
        res.forEach(item => {
          all.set(item.uid || item.gid, item);
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
          const data = new Map<string, FriendModel>();
          friendList.forEach(f => {
            data.set(f.friendUserUid.toString(), f);
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
        const groupMap = new Map<string, GroupModel>();
        res.data.forEach(g => {
          groupMap.set(g.gid, g);
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
        const groupAdminMap = new Map<number, GroupAdminModel>();
        res.data.forEach(admin => {
          groupAdminMap.set(admin.userUid, admin);
        });

        let newData = new Map<string, Map<number, GroupAdminModel>>();
        localforage.getItem(this.dataKeys.groupAdminList).then((data: Map<string, Map<number, GroupAdminModel>>) => {
          if(data) {
            data.set(gid, groupAdminMap);
            newData = data;
          } else {
            newData.set(gid, groupAdminMap);
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
  getCacheGroupAdmins(): Promise<Map<string, Map<number, GroupAdminModel>>> {
    return localforage.getItem(this.dataKeys.groupAdminList);
  }

  /**
   * 获取好友列表
   */
  getCacheFriends(): Promise<Map<string, FriendModel>> {
    return localforage.getItem(this.dataKeys.friendList);
  }

  /**
   * 获取群列表
   */
  getCacheGroups(): Promise<Map<string, GroupModel>> {
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
    this.getChattingCache(alarmItem).then((data: Map<string, any>) => {
      let localLastMsgFP = "";
      if(data && data.size) {
        const list: ChatmsgEntityModel[] = new Array(...data.values());
        const localLastMsg: ChatmsgEntityModel[] = list.slice(-1);
        localLastMsgFP = localLastMsg[0].fingerPrintOfProtocal;
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
          msgContent: this.messageService.parseMessageForShow(dataContent.m, dataContent.ty),
          title: null,
          avatar: null,
        },
        metadata: {
          chatType: chatType
        }
      };
      if(chatType === 'group') {
        alarm.alarmItem.title = groups.get(alarm.alarmItem.dataId).gname;
        alarm.alarmItem.avatar = groups.get(alarm.alarmItem.dataId).avatar;
      } else {
        alarm.alarmItem.title = friends.get(alarm.alarmItem.dataId.toString()).nickname;
        alarm.alarmItem.avatar = friends.get(alarm.alarmItem.dataId.toString()).userAvatarFileName;
      }

      resolve(alarm);
    });
  }

  /**
   * 缓存会话状态
   */
  cacheSessionStatusList() {
    const url = _HTTP_SERVER_URL + "/api/user/sessionStatusList";
    const params = {
      userId: this.localUserService.localUserInfo.userId,
    };
    this.httpService.get(url, params).subscribe((res: NewHttpResponseInterface<SessionStatusModel[]>) => {
      if (res.status === 200) {
        res.data.forEach(m => {
          let type = 'friend';
          if(m.userType && m.userType.toString() === '1') {
            type = 'group';
          }
          this.setMute(m.friendId, type, m.noDisturb).then();
          this.setTop(m.friendId, type, m.noDisturb).then();
        });

        localforage.getItem(this.dataKeys.mute).then((data: Map<string, boolean>) => {
          this.cacheSource.next({mute: data});
        });
        localforage.getItem(this.dataKeys.top).then((data: Map<string, boolean>) => {
          this.cacheSource.next({top: data});
        });
      }
    });
  }

  /**
   * 设置静音
   * @param dataId
   * @param type
   * @param mute
   */
  setMute(dataId: string, type: string, mute: boolean): Promise<Map<string, boolean>> {
    return new Promise((resolve, reject) => {
      localforage.getItem(this.dataKeys.mute).then((data: Map<string, boolean>) => {
        data = data ? data : new Map();
        data.set(dataId, mute);

        localforage.setItem(this.dataKeys.mute, data).then(() => {
          resolve(data);
          this.cacheSource.next({mute: data});

          const url = _HTTP_SERVER_URL + "/api/user/setNoDisturb";
          const params = {
            userId: this.localUserService.localUserInfo.userId,
            noDisturbId: dataId,
            type: mute ? 1 : 0,
            userType: type === 'friend' ? 0 : 1,
          };
          this.httpService.postForm(url, params).subscribe();
        });
      });
    });
  }

  /**
   * 获取静音列表
   */
  getMute(): Promise<Map<string, boolean>> {
    return localforage.getItem(this.dataKeys.mute);
  }

  /**
   * 设置顶置
   * @param dataId
   * @param type
   * @param top
   */
  setTop(dataId: string, type: string, top: boolean): Promise<Map<string, boolean>> {
    return new Promise((resolve, reject) => {
      localforage.getItem(this.dataKeys.top).then((data: Map<string, boolean>) => {
        data = data ? data : new Map();
        data.delete(dataId);
        data = new Map([[dataId, top], ...data]);

        localforage.setItem(this.dataKeys.top, data).then(() => {
          resolve(data);
          this.cacheSource.next({top: data});

          const url = _HTTP_SERVER_URL + "/api/user/setTop";
          const params = {
            userId: this.localUserService.localUserInfo.userId,
            topId: dataId,
            type: top ? 1 : 0,
            userType: type === 'friend' ? 0 : 1,
          };
          this.httpService.postForm(url, params).subscribe();
        });
      });
    });
  }

  /**
   * 获取顶置列表
   */
  getTop(): Promise<Map<string, boolean>> {
    return localforage.getItem(this.dataKeys.top);
  }
}
