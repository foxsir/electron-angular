import {Injectable} from '@angular/core';
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
import {ChatModeType, MsgType} from "@app/config/rbchat-config";
import {HttpService} from "@services/http/http.service";
import {_HTTP_SERVER_URL} from "@app/config/post-api";
import {SoundService} from "@services/sound/sound.service";
import SessionStatusModel from "@app/models/session-status.model";
import {AvatarService} from "@services/avatar/avatar.service";
import {GroupMemberModel} from "@app/models/group-member.model";
import BlackListModel from "@app/models/black-list.model";
import {FriendRequestModel} from "@app/models/friend-request.model";
import {DatabaseService} from "@services/database/database.service";
import IpcResponseInterface from "@app/interfaces/ipc-response.interface";
import ChattingModel from "@app/models/chatting.model";
import MuteModel from "@app/models/mute.model";
import TopModel from "@app/models/top.model";
import AtMeModel from "@app/models/at-me.model";
import SilenceUserModel from "@app/models/silence-user.model";

export type AlarmDataMap = Map<string, {alarmData: AlarmItemInterface; message?: Map<string, ChatmsgEntityModel>}>;

interface CacheItem {
  alarmDataMap: AlarmDataMap;
  friendMap: Map<string, FriendModel>;
  groupMap: Map<string, GroupModel>;
  groupAdminMap: Map<string, Map<string, GroupAdminModel>>;
  groupMemberMap: Map<string, GroupMemberModel>;
  myInfo: UserModel;
  muteMap: Map<string, boolean>;
  topMap: Map<string, boolean>;
  blackListMap: Map<string, BlackListModel>;
  newFriendMap: Map<string, FriendRequestModel>;
  atMe: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService extends DatabaseService {
  // 缓存更新使用统一订阅，订阅着需要自己去获取相应的缓存
  private cacheSource = new Subject<Partial<CacheItem>>();
  public cacheUpdate$ = this.cacheSource.asObservable();

  private groupSilenceSource = new Subject<Map<string, SilenceUserModel>>();
  public groupSilence$ = this.groupSilenceSource.asObservable();

  // 给ChattingAreaComponent组件使用
  public chatMsgEntityMapTemp: Map<string, ChatmsgEntityModel> = new Map();
  public chatMsgEntityMap: Map<string, ChatmsgEntityModel> = new Map();
  public chatMsgEntityList: ChatmsgEntityModel[] = [];

  // 当前群禁言用户列表
  private groupSilenceMap: Map<string, SilenceUserModel> = new Map();

  private dataKeys = {
    alarmDataMap: "alarmDataMap",
    friendMap: "friendMap",
    groupMap: "groupMap",
    groupAdminMap: "groupAdminMap",
    groupMemberMap: "groupMemberMap",
    myInfo: "myInfo",
    muteMap: "muteMap",
    topMap: "topMap",
    blackListMap: "blackListMap",
    newFriendMap: "newFriendMap",
    atMe: "atMe",
  };

  // 防止多次初始化
  private initDataKey = false;

  constructor(
    private messageRoamService: MessageRoamService,
    private messageEntityService: MessageEntityService,
    private rosterProviderService: RosterProviderService,
    private restService: RestService,
    private localUserService: LocalUserService,
    private messageService: MessageService,
    private historyMessageService: HistoryMessageService,
    private httpService: HttpService,
    private soundService: SoundService,
    private avatarService: AvatarService,
  ) {
    super();
    this.initDataKeys();
  }

  initDataKeys(uid: number = null) {
    if(this.initDataKey === false) {
      this.initDataKey = true;
      if(this.localUserService.localUserInfo && this.localUserService.localUserInfo.userId) {
        const userId = uid ? uid: this.localUserService.localUserInfo.userId;
        for (const key in this.dataKeys) {
          if(this.dataKeys.hasOwnProperty(key)) {
            this.dataKeys[key] = [this.dataKeys[key], CommonTools.md5(userId.toString())].join("-");
          }
        }
      }
    }
  }

  /**
   * 缓存消息
   * @param alarmData
   * @param messages
   * @param subscription
   */
  putChattingCache(
    alarmData: AlarmItemInterface, messages: ChatmsgEntityModel | ChatmsgEntityModel[] = null, subscription: boolean = true
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const cache: Map<string, ChatmsgEntityModel> = new Map();
      let lastTime = null;
      if(messages !== null) {
        if(messages.hasOwnProperty("length")) {
          messages = messages as ChatmsgEntityModel[];
          messages.forEach(msg => {
            cache.set(msg.fingerPrintOfProtocal, msg);
          });
          const lastItem = messages.slice(-1)[0];
          if(lastItem && lastItem[0]) {
            alarmData.alarmItem.msgContent = messages.slice(-1)[0]?.text;
            lastTime = lastItem.date;
          }
        } else {
          messages  = messages as ChatmsgEntityModel;
          cache.set(messages.fingerPrintOfProtocal, messages);
          alarmData.alarmItem.msgContent = messages.text;
          lastTime = messages.date;
        }
      }
      const chatting: Partial<ChattingModel> = {
        ...alarmData.alarmItem,
        ...alarmData.metadata,
      };
      chatting.date = lastTime || alarmData.alarmItem.date;

      this.saveData<ChattingModel>({model: "chatting", data: chatting, update: {dataId: chatting.dataId}}).then();
      cache.forEach((msg) => {
        msg.dataId = chatting.dataId;
        this.saveData<ChatmsgEntityModel>({
          model: "chatmsgEntity", data: msg, update: {fingerPrintOfProtocal: msg.fingerPrintOfProtocal}
        }).then();
      });

      if (subscription) {
        this.getChattingList().then(list => {
          this.cacheSource.next({alarmDataMap: list});
        });
      }
      resolve(true);
    });
  }

  /**
   * 设置未读数
   * @param alarmData
   * @param badges
   */
  setChattingBadges(alarmData: AlarmItemInterface, badges: number) {
    this.getChattingList().then((data: AlarmDataMap) => {
      const check = data.get(alarmData.alarmItem.dataId.toString());
      if(check) {
        if(badges > 0) {
          check.alarmData.metadata.unread = check.alarmData.metadata.unread || 0;
          alarmData.metadata.unread = check.alarmData.metadata.unread + badges;
          // 如果不是静音则播放提示音
          this.getMute().then(mute => {
            if(mute && mute.get(alarmData.alarmItem.dataId.toString()) !== true) {
              this.soundService.messagePlay().then();
            }
          });
        }

        this.putChattingCache(alarmData).then(() => {
          this.cacheSource.next({alarmDataMap: data});
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
    return new Promise((resolve) => {
      this.getChattingList().then(list => {
        messages.forEach(msg => {
          this.deleteData<ChatmsgEntityModel>({model: 'chatmsgEntity', query: {fingerPrintOfProtocal: msg.fingerPrintOfProtocal}}).then();
        });
        this.cacheSource.next({alarmDataMap: list});
        resolve(true);
      });
    });
  }

  /**
   * 清除会话消息
   * @param alarmData
   */
  clearChattingCache(alarmData: AlarmItemInterface): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.deleteData<ChatmsgEntityModel>({model: "chatmsgEntity", query: {dataId: alarmData.alarmItem.dataId}}).then(() => {
        this.getChattingList().then(list => {
          list.set(alarmData.alarmItem.dataId, {
            alarmData: alarmData,
            message: new Map<string, ChatmsgEntityModel>()
          });
          this.cacheSource.next({alarmDataMap: list});
          resolve(true);
        });
      });
    });
  }

  /**
   * 删除会话消息
   * @param dataId
   */
  deleteChattingCache(dataId: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.deleteData<ChattingModel>({model: "chatting", query: {dataId: dataId}}).then(() => {
        this.getChattingList().then(list => {
          list.delete(dataId);
          this.cacheSource.next({alarmDataMap: list});
          resolve(true);
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
      this.queryData<ChatmsgEntityModel>({
        model: "chatmsgEntity", query: {dataId: alarmData.alarmItem.dataId}, orderBy: ['date', "ASC"]
      }).then((res) => {
        if(res.status === 200) {
          const map = new Map();
          res.data.forEach(entity => {
            map.set(entity.fingerPrintOfProtocal, entity);
          });
          resolve(map);
        }
      });
    });
  }

  /**
   * 获取聊天Map缓存
   */
  getChattingList(): Promise<AlarmDataMap> {
    return new Promise((resolve) => {
      this.queryData<ChattingModel>({model: 'chatting', query: null, orderBy: ['date', "DESC"]}).then(res => {
        const map: AlarmDataMap = new Map();
        res.data.forEach(chatting => {
          map.set(chatting.dataId, {
            alarmData: {
              alarmItem: chatting,
              metadata: chatting
            }
          });
        });
        resolve(map);
      });
    });
  }

  /**
   * 从服务器同步聊天Map，并缓存Map, 返回同步后的聊天Map
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
          dataID = dataID.toString();
          const data: RoamLastMsgModel = res.get(dataID);
          const protocalModel: ProtocalModel = JSON.parse(data.lastMsg);
          const dataContent: ProtocalModelDataContent = JSON.parse(protocalModel.dataContent);

          let title = "";
          let avatar = "";
          if(data.chatType === 'friend' && friends && friends.get(dataID)) {
            title = friends.get(dataID).nickname;
            avatar = friends.get(dataID).userAvatarFileName;
            if(avatar.includes('http') === false) {
              avatar = this.avatarService.defaultLocalAvatar;
            }
          } else if(groups && groups.get(dataID)) {
            title = groups.get(dataID).gname;
            avatar = groups.get(dataID).avatar;
          }

          const alarmItem: AlarmItemInterface = {
            alarmItem: {
              alarmMessageType: protocalModel.type,
              dataId: dataID,
              date: protocalModel.recvTime,
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
          // 将本地不存在的对话返回到聊天Map
          if(chattingListCache === null) {
            newMap.set(alarmItem.alarmItem.dataId, alarmItem);
          } else if(chattingListCache.get(alarmItem.alarmItem.dataId)) {
            // 如果已经有缓存， 只更新缓存有的会话
            newMap.set(alarmItem.alarmItem.dataId, alarmItem);
          }
          // 同步消息
          this.syncMessage(alarmItem, protocalModel.fp);
        });

        const entries = newMap.entries();
        const next = entries.next();
        const loop = (alarmItem: AlarmItemInterface) => {
          this.putChattingCache(alarmItem).then(() => {
            const n = entries.next();
            if(n.value) {
              loop(n.value[1]);
            } else {
              this.getChattingList().then(list => {
                this.cacheSource.next({alarmDataMap: list});
              });
            }
          });
        };
        if(next.value) {
          loop(next.value[1]);
        }

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
          const dataID = item.uid || item.gid;
          all.set(dataID.toString(), item);
        });
        resolve(all);
      });
    });
  }

  /**
   * 获取并缓存好友Map
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
            this.saveData<FriendModel>({model: 'friend', data: f, update: {friendUserUid: f.friendUserUid}}).then();
          });
          this.cacheSource.next({friendMap: data});
        }
      }
    });
  }

  /**
   * 获取并缓存群Map
   */
  cacheGroups() {
    this.restService.getUserJoinGroup().subscribe((res: NewHttpResponseInterface<GroupModel[]>) => {
      if(res.status === 200) {
        const groupMap = new Map<string, GroupModel>();
        res.data.forEach(g => {
          if(g) {
            groupMap.set(g.gid, g);
            this.saveData<GroupModel>({model: 'group', data: g, update: {gid: g.gid}}).then();
          }
        });
        this.cacheSource.next({groupMap: groupMap});
      }
    });
  }

  /**
   * 获取并缓存群管理员Map
   */
  cacheGroupAdmins(gid: string): Promise<Map<string, Map<string, GroupAdminModel>>> {
    return new Promise(resolve => {
      this.restService.getGroupAdminList(gid).subscribe((res: NewHttpResponseInterface<GroupAdminModel[]>) => {
        if(res.status === 200) {
          this.deleteData<GroupAdminModel>({model: 'groupAdmin', query: {gid: gid}}).then(() => {
            const groupAdminMap = new Map<string, GroupAdminModel>();
            res.data.forEach(admin => {
              groupAdminMap.set(admin.userUid.toString(), admin);
              admin.gid = gid;
              this.saveData<GroupAdminModel>({
                model: "groupAdmin", data: admin, update: {gid: gid, userUid: admin.userUid}
              }).then();
            });
            const newData = new Map<string, Map<string, GroupAdminModel>>();
            this.cacheSource.next({groupAdminMap: newData});
            resolve(newData);
          });
        }
      });
    });
  }

  /**
   * 获取群管理
   * @param gid
   */
  getCacheGroupAdmins(gid: string): Promise<Map<string, GroupAdminModel>> {
    return new Promise<Map<string, GroupAdminModel>>((resolve) => {
      this.queryData<GroupAdminModel>({model: 'groupAdmin', query: {gid: gid}}).then((res: IpcResponseInterface<GroupAdminModel>) => {
        if(res.status === 200) {
          const map = new Map();
          res.data.forEach(admin => {
            map.set(admin.userUid.toString(), admin);
          });
          resolve(map);
        }
      });
    });
  }

  /**
   * 获取好友Map
   */
  getCacheFriends(): Promise<Map<string, FriendModel>> {
    return new Promise<Map<string, FriendModel>>((resolve) => {
      this.queryData({model: 'friend', query: {}}).then((res: IpcResponseInterface<FriendModel>) => {
        const map = new Map();
        if(res.status === 200) {
          res.data.forEach(f => {
            map.set(f.friendUserUid.toString(), f);
          });
          resolve(map);
        } else {
          resolve(map);
        }
      });
    });
  }

  /**
   * 获取群Map
   */
  getCacheGroups(): Promise<Map<string, GroupModel>> {
    return new Promise<Map<string, GroupModel>>(resolve => {
      this.queryData({model: 'group', query: {}}).then((res: IpcResponseInterface<GroupModel>) => {
        const map = new Map();
        if(res.status === 200) {
          res.data.forEach(g => {
            map.set(g.gid, g);
          });
          resolve(map);
        } else {
          resolve(map);
        }
      });
    });
  }

  /**
   * 清空缓存
   */
  clearAllCache() {
    this.dropDB().then(() => {
      const localUserInfo = this.localUserService.localUserInfo;
      this.connectionDB(localUserInfo.userId.toString()).then(() => {
      });
    });
  }

  /**
   * 缓存个人信息
   */
  cacheMyInfo(userId: number = null): Promise<UserModel> {
    this.initDataKeys(userId);

    return new Promise((resolve, reject) => {
      const localUserInfo = this.localUserService.localUserInfo;
      this.restService.getUserBaseById(localUserInfo.userId.toString()).subscribe((res: NewHttpResponseInterface<UserModel>) => {
        if(res.status === 200) {
          const data = res.data;
          data.userLevel = JSON.stringify(data.userLevel);
          this.saveData<UserModel>({model: "user", data: data, update: {userUid: data.userUid}}).then(() => {
            this.cacheSource.next({myInfo: res.data});
            resolve(res.data);
          });
        }
      });
    });
  }

  /**
   * 获取个人信息
   */
  getMyInfo(): Promise<UserModel> {
    const localUserInfo = this.localUserService.localUserInfo;
    return new Promise((resolve, reject) => {
      this.queryData<UserModel>({model: 'user', query: {userUid: localUserInfo.userId}}).then((res: IpcResponseInterface<UserModel>) => {
        if(res.data.length) {
          resolve(res.data[0] as UserModel);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * 同步其他客户端更新的消息
   * @param alarmItem
   * @param remoteFP
   * @param page
   */
  private syncMessage(alarmItem: AlarmItemInterface, remoteFP: string, page: number = 0) {
    this.getChattingCache(alarmItem).then((data: Map<string, ChatmsgEntityModel>) => {
      let localLastMsgFP = "";
      if(data && data.size) {
        const list: ChatmsgEntityModel[] = new Array(...data.values());
        const localLastMsg: ChatmsgEntityModel[] = list.slice(-1);
        localLastMsgFP = localLastMsg[0].fingerPrintOfProtocal;
      }
      if(localLastMsgFP !== remoteFP) {
        if(alarmItem.metadata.chatType === 'friend') {
          this.historyMessageService.getFriendMessage(
            alarmItem,
            {start: localLastMsgFP, end: remoteFP},
            page,
          'end',
            100
          ).subscribe(res => {
            if(res.status === 200 && res.data) {
              const entityList = [];
              // let checkLocalLastMsg = false;
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
                  chatMsgEntity.uh = dataContent.uh;
                }
                // if(localLastMsgFP === chatMsgEntity.fingerPrintOfProtocal) {
                //   checkLocalLastMsg = true;
                // }
                chatMsgEntity.isOutgoing = true;
                if(dataContent.showMsg) {
                  entityList.unshift(chatMsgEntity);
                }
              });
              this.putChattingCache(alarmItem, entityList).then(() => {
                // if(checkLocalLastMsg === false && entityList.length > 0) {
                //   console.dir('friend friend friend friend')
                //   this.syncMessage(alarmItem, entityList[0].fingerPrintOfProtocal, page + 1);
                // }
                this.setChattingBadges(alarmItem, alarmItem.metadata.unread);
              });
            }
          });
        } else if(alarmItem.metadata.chatType === 'group') {
          this.historyMessageService.getGroupMessage(
            alarmItem,
            {start: localLastMsgFP, end: remoteFP},
            page,
            'end',
            100
          ).subscribe(res => {
            if(res.status === 200 && res.data) {
              const entityList = [];
              // let checkLocalLastMsg = false;
              res.data.list.forEach(msg => {
                const msgJson: ProtocalModel = JSON.parse(msg);
                let chatMsgEntity: ChatmsgEntityModel;
                const dataContent: ProtocalModelDataContent = JSON.parse(msgJson.dataContent);
                if(msgJson.from === this.localUserService.localUserInfo.userId.toString()) {
                  chatMsgEntity = this.messageEntityService.prepareSendedMessage(
                    dataContent.m, msgJson.recvTime, msgJson.fp, dataContent.ty
                  );
                } else {
                  chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
                    msgJson.from, dataContent.nickName, dataContent.m, msgJson.recvTime, dataContent.ty, msgJson.fp
                  );
                  chatMsgEntity.uh = dataContent.uh;
                }
                // 如果没拉取到最后一条，则继续拉去
                // if(localLastMsgFP === chatMsgEntity.fingerPrintOfProtocal) {
                //   checkLocalLastMsg = true;
                // }
                chatMsgEntity.isOutgoing = true;
                if(dataContent.showMsg) {
                  entityList.unshift(chatMsgEntity);
                }
              });
              this.putChattingCache(alarmItem, entityList).then((newCache) => {
                // if(checkLocalLastMsg === false && entityList.length > 0) {
                //   console.dir('group group group group')
                //   this.syncMessage(alarmItem, entityList[0].fingerPrintOfProtocal, page + 1);
                // }
                this.setChattingBadges(alarmItem, alarmItem.metadata.unread);
              });
            }
          });
        }
      }
    });
  }

  /**
   * 构建 AlarmItemInterface
   * @param dataId
   * @param chatType
   * @param text
   * @param msgType
   */
  public async generateAlarmItem(
    dataId: string, chatType: 'friend' | 'group', text: string = null, msgType: number = MsgType.TYPE_TEXT
  ): Promise<AlarmItemInterface> {
    const friends = await this.getCacheFriends().then(res => res);
    const groups = await this.getCacheGroups().then(res => res);
    if(!text) {
      await this.queryData<ChattingModel>({
        model: 'chatting', query: {dataId: dataId}
      }).then((cache: IpcResponseInterface<ChattingModel>)  => {
        if(cache.status === 200) {
          text = cache.data[0].msgContent;
        }
      });
    }

    return new Promise((resolve, reject) => {
      let title = "聊天";
      let avatar = this.avatarService.defaultLocalAvatar;
      if(chatType === 'friend') {
        if(friends.get(dataId)) {
          title = friends.get(dataId).nickname;
          avatar = friends.get(dataId).userAvatarFileName;
        }
      } else {
        if(groups.get(dataId)) {
          title = groups.get(dataId).gname;
          avatar = groups.get(dataId).avatar;
        }
      }
      const alarm =  {
        alarmItem: {
          alarmMessageType: chatType === 'friend' ? ChatModeType.CHAT_TYPE_FRIEND$CHAT : ChatModeType.CHAT_TYPE_GROUP$CHAT,
          dataId: dataId,
          date: new Date().getTime(),
          msgContent: this.messageService.parseMessageForShow(text, msgType),
          title: title,
          avatar: avatar,
        },
        metadata: {
          chatType: chatType
        }
      };

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
          this.setTop(m.friendId, type, m.top).then();
        });
        this.getTop().then(tops => {
          this.cacheSource.next({topMap: tops});
        });
        this.getMute().then(mutes => {
          this.cacheSource.next({muteMap: mutes});
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
      const data: Partial<MuteModel> = {
        dataId: dataId,
        mute: mute,
        updated_at: new Date().getTime(),
      };
      this.saveData<MuteModel>({model: "mute", data: data, update: {dataId: dataId}}).then(() => {
        const res = new Map([[dataId, mute]]);
        const url = _HTTP_SERVER_URL + "/api/user/setNoDisturb";
        const params = {
          userId: this.localUserService.localUserInfo.userId,
          noDisturbId: dataId,
          type: mute ? 1 : 0,
          userType: type === 'friend' ? 0 : 1,
        };
        this.httpService.postForm(url, params).subscribe();
        resolve(res);
        this.getMute().then(mutes => {
          this.cacheSource.next({muteMap: mutes});
        });
      });
    });
  }

  /**
   * 获取静音Map
   */
  getMute(): Promise<Map<string, boolean>> {
    return new Promise<Map<string, boolean>>((resolve) => {
      this.queryData<MuteModel>({model: "mute", query: null}).then((res) => {
        const map = new Map();
        if(res.status === 200) {
          res.data.forEach(mute => {
            map.set(mute.dataId, mute.mute);
          });
          resolve(map);
        }
        resolve(map);
      });
    });
  }

  /**
   * 设置顶置
   * @param dataId
   * @param type
   * @param top
   */
  setTop(dataId: string, type: string, top: boolean): Promise<Map<string, boolean>> {
    return new Promise((resolve, reject) => {
      const data: Partial<TopModel> = {
        dataId: dataId,
        top: top,
        updated_at: new Date().getSeconds(),
      };
      this.saveData<TopModel>({model: "top", data: data, update: {dataId: dataId}}).then(() => {
        const res = new Map([[dataId, top]]);
        const url = _HTTP_SERVER_URL + "/api/user/setTop";
        const params = {
          userId: this.localUserService.localUserInfo.userId,
          topId: dataId,
          type: top ? 1 : 0,
          userType: type === 'friend' ? 0 : 1,
        };
        this.httpService.postForm(url, params).subscribe();
        resolve(res);
        this.getTop().then(tops => {
          this.cacheSource.next({topMap: tops});
        });
      });
    });
  }

  /**
   * 获取顶置Map
   */
  getTop(): Promise<Map<string, boolean>> {
    return new Promise<Map<string, boolean>>((resolve) => {
      this.queryData<TopModel>({model: "top", query: null, orderBy: ["updated_at", "DESC"]}).then((res) => {
        const map = new Map();
        if(res.status === 200) {
          res.data.forEach(top => {
            map.set(top.dataId, top.top);
          });
          resolve(map);
        }
        resolve(map);
      });
    });
  }

  /**
   * 缓存群成员
   * @param gid
   */
  cacheGroupMembers(gid: string): Promise<Map<string, GroupMemberModel>> {
    return new Promise(resolve => {
      this.restService.submitGetGroupMembersListFromServer(gid).subscribe((res: NewHttpResponseInterface<{list: GroupMemberModel[]}>) => {
        if(res.status === 200) {
          this.deleteData<GroupMemberModel>({model: 'groupMember', query: {groupId: gid}}).then(() => {
            const groupMemberMap = new Map<string, GroupMemberModel>();
            res.data.list.forEach(member => {
              groupMemberMap.set(member.userUid.toString(), member);
              this.saveData<GroupMemberModel>({
                model: "groupMember", data: member, update: {groupId: gid, userUid: member.userUid}
              }).then();
            });
            this.cacheSource.next({groupMemberMap: groupMemberMap});
            resolve(groupMemberMap);
          });
        }
      });
    });
  }

  /**
   * 获取群成员Map
   * @param gid
   */
  getGroupMembers(gid: string): Promise<Map<string, GroupMemberModel>> {
    return new Promise<Map<string, GroupMemberModel>>((resolve) => {
      this.queryData<GroupMemberModel>({
        model: 'groupMember', query: {groupId: gid}
      }).then((res: IpcResponseInterface<GroupMemberModel>) => {
        if(res.status === 200) {
          const map = new Map();
          res.data.forEach(member => {
            map.set(member.userUid.toString(), member);
          });
          resolve(map);
        }
      });
    });
  }

  cacheBlackList() {
    this.restService.getMyBlackList().subscribe((res: NewHttpResponseInterface<BlackListModel[]>) => {
      if(res.status === 200) {
        const bl = new Map();
        if(res.data !== null) {
          res.data.forEach(item => {
            bl.set(item.userUid, item);
            this.saveData<BlackListModel>({model: 'blackList', data: item}).then();
          });
          this.cacheSource.next({blackListMap: bl});
        } else {
          this.cacheSource.next({blackListMap: bl});
        }
      }
    });
  }

  getBlackList(): Promise<Map<number, BlackListModel>> {
    return new Promise<Map<number, BlackListModel>>((resolve) => {
      this.queryData({model: 'blackList', query: {}}).then((res: IpcResponseInterface<BlackListModel>) => {
        const map = new Map();
        if(res.status === 200) {
          res.data.forEach(item => {
            map.set(item.userUid ,item);
          });
          resolve(map);
        } else {
          resolve(map);
        }
      });
    });
  }

  /**
   * 获取好友请求并缓存
   */
  cacheNewFriends() {
    this.restService.getNewFriend().subscribe((res: NewHttpResponseInterface<FriendRequestModel[]>) => {
      if(res.status === 200) {
        const map = new Map<string, FriendRequestModel>();
        res.data.forEach(item => {
          map.set(item.reqUserId.toString(), item);
          item.agree = null;
          this.saveData<FriendRequestModel>({model: 'friendRequest', data: item}).then();
          this.cacheSource.next({newFriendMap: map})
        });
      }
    });
  }

  /**
   * 更新好友请求状态
   * @param reqUserId
   * @param agree
   */
  updateNewFriendMap(reqUserId: number, agree: boolean): void {
    this.saveData<FriendRequestModel>({
      model: 'friendRequest', data: {agree: agree}, update: {reqUserId: reqUserId}
    }).then(() => {
      this.getNewFriendMap().then(res => {
        this.cacheSource.next({newFriendMap: res});
      });
    });
  }

  /**
   * 获取好友请求缓存
   */
  getNewFriendMap(): Promise<Map<string, FriendRequestModel>> {
    return new Promise<Map<string, FriendRequestModel>>((resolve) => {
      this.queryData<FriendRequestModel>({
        model: 'friendRequest', query: {}
      }).then((res: IpcResponseInterface<FriendRequestModel>) => {
        const map = new Map();
        res.data.forEach(item => {
          map.set(item.reqUserId, item);
        });
        resolve(map);
      });
    });
  }

  reset() {
    this.initDataKey = false;
  }

  putMsgEntityMap(msg: ChatmsgEntityModel) {
    this.chatMsgEntityMap.set(msg.fingerPrintOfProtocal, msg);
  }

  /**
   * 保存@消息
   * @param dataId
   * @param msg
   */
  putAtMessage(dataId: string, msg: ChatmsgEntityModel) {
    const data: Partial<AtMeModel> = {
      dataId: dataId,
      fingerPrintOfProtocal: msg.fingerPrintOfProtocal,
      date: msg.date
    };
    this.saveData<AtMeModel>({model: 'atMe', data: data, update: {fingerPrintOfProtocal: msg.fingerPrintOfProtocal}}).then(() => {
      this.cacheSource.next({atMe: true});
    });
  }

  /**
   * 清除指定会话@消息
   * @param dataId
   */
  clearAt(dataId: string) {
    this.deleteData<AtMeModel>({model: 'atMe', query: {dataId: dataId}}).then(() => {
      this.cacheSource.next({atMe: true});
    });
  }

  /**
   * 获取@消息
   * @param dataId
   */
  getAtMessage(dataId: string): Promise<AtMeModel[]> {
    return new Promise<AtMeModel[]>((resolve) => {
      this.queryData<AtMeModel>({model: 'atMe', query: {dataId: dataId}, orderBy: ['date', "ASC"]}).then((res) => {
        resolve(res.data);
      });
    });
  }

  cacheGroupSilence(clusterId: string): Promise<Map<string, SilenceUserModel>> {
    return new Promise<Map<string, SilenceUserModel>>((resolve) => {
      this.restService.getGroupSilenceById({clusterId: clusterId}).subscribe((res: NewHttpResponseInterface<SilenceUserModel[]>) => {
        this.groupSilenceMap = new Map();
        if(res.status === 200) {
          res.data.forEach((item) => {
            this.groupSilenceMap.set(item.userUid.toString(), item);
          });
          this.groupSilenceSource.next(this.groupSilenceMap);
          resolve(this.groupSilenceMap);
        }
      });
    });
  }

  getGroupSilence(): Map<string, SilenceUserModel> {
    return this.groupSilenceMap;
  }

}
