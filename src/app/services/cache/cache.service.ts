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
import LastMessageModel from "@app/models/last-message.model";
import BlackMeListModel from "@app/models/black-me-list.model";

export type AlarmDataMap = Map<string, {alarmData: AlarmItemInterface; message?: Map<string, ChatmsgEntityModel>}>;

interface CacheItem {
  alarmDataMap: AlarmDataMap; // 会话信息
  friendMap: Map<string, FriendModel>; // 好友信息
  groupMap: Map<string, GroupModel>; // 我的群组
  groupAdminMap: Map<string, Map<string, GroupAdminModel>>; // 群组管理员
  groupMemberMap: Map<string, GroupMemberModel>; // 群组成员
  myInfo: UserModel; // 当前用户信息
  muteMap: Map<string, boolean>; // 静音的会话
  topMap: Map<string, boolean>; // 置顶的会话
  blackListMap: Map<string, BlackListModel>; // 黑名单
  blackMeListMap: Map<string, BlackMeListModel>; // 拉黑我的人
  newFriendMap: Map<string, FriendRequestModel>; // 新好友请求
  atMe: boolean; // @我的消息
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

  // input draft
  public draftMap: Map<string, string> = new Map<string, string>();

  public sensitiveList: string[] = [];

  constructor(
    private messageRoamService: MessageRoamService,
    private messageEntityService: MessageEntityService,
    private rosterProviderService: RosterProviderService,
    private restService: RestService,
    private localUserService: LocalUserService,
    private historyMessageService: HistoryMessageService,
    private httpService: HttpService,
    private soundService: SoundService,
    private avatarService: AvatarService,
  ) {
    super();
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
      let lastFp = '';
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
            lastFp = lastItem.fingerPrintOfProtocal;
          }
        } else {
          messages  = messages as ChatmsgEntityModel;
          cache.set(messages.fingerPrintOfProtocal, messages);
          alarmData.alarmItem.msgContent = messages.text;
          lastTime = messages.date;
          lastFp = messages.fingerPrintOfProtocal;
        }
      }
      const chatting: Partial<ChattingModel> = {
        ...alarmData.alarmItem,
        ...alarmData.metadata,
      };
      chatting.date = lastTime || alarmData.alarmItem.date;
      chatting.lastFp = lastFp || alarmData.alarmItem.lastFp || "";

      this.saveDataSync<ChattingModel>({model: "chatting", data: chatting, update: {dataId: chatting.dataId}}).then(() => {
        if(cache.size === 0) {
          if (subscription) {
            this.getChattingList().then(list => {
              this.cacheSource.next({alarmDataMap: list});
            });
          }
          resolve(true);
        }
      });

      cache.forEach((msg) => {
        msg.dataId = chatting.dataId;
        this.saveDataSync<ChatmsgEntityModel>({
          model: "chatmsgEntity", data: msg, update: {fingerPrintOfProtocal: msg.fingerPrintOfProtocal}
        }).then(() => {
          if (subscription) {
            this.getChattingList().then(list => {
              this.cacheSource.next({alarmDataMap: list});
            });
          }
          resolve(true);
        });
      });
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
      this.getChattingList().then(list => {
        if(list.get(dataId)) {
          this.deleteData<ChattingModel>({model: "chatting", query: {dataId: dataId}}).then(() => {
            const lastFp = list.get(dataId).alarmData.alarmItem.lastFp;
            this.saveData<LastMessageModel>({
              model: 'lastMessage',
              data: {
               dataId: dataId, fp: lastFp
              },
              update: {dataId: dataId}
            });
            list.delete(dataId);
            this.cacheSource.next({alarmDataMap: list});
            resolve(true);
          });
        }
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
    let friends: Map<string, FriendModel>;
    let groups: Map<string, GroupModel>;
    const lastMessage: Map<string, string> = new Map();
    await this.cacheFriends().then();
    await this.cacheGroups().then();
    await this.getCacheFriends().then(res => { friends = res; });
    await this.getCacheGroups().then(res => { groups = res; });
    await this.queryData<LastMessageModel>({model: 'lastMessage', query: null}).then((res: IpcResponseInterface<LastMessageModel>) => {
      res.data.forEach(t => {
        lastMessage.set(t.dataId, t.fp);
      });
    });

    return new Promise((resolve, reject) => {
      this.getAllLastMessage().then((res: Map<string, RoamLastMsgModel>) =>{
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
            title = friends.get(dataID).remark?friends.get(dataID).remark:friends.get(dataID).nickname;
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
              msgContent: MessageService.parseMessageForShow(dataContent.m, dataContent.ty),
              title: title,
              avatar: avatar,
              lastFp: protocalModel.fp
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
            // 同步消息
            this.syncMessage(alarmItem, protocalModel.fp);
          } else if (lastMessage.get(alarmItem.alarmItem.dataId) !== protocalModel.fp) { // 检查是否是删除的会话
            newMap.set(alarmItem.alarmItem.dataId, alarmItem);
            // 同步消息
            this.syncMessage(alarmItem, protocalModel.fp);
          }
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
  cacheFriends(): Promise<boolean> {
    return new Promise((resolve) => {
      this.rosterProviderService.refreshRosterAsync().subscribe((res: NewHttpResponseInterface<any>) => {
        // 服务端返回的是一维RosterElementEntity对象数组
        if(res.status === 200) {
          const friendList: FriendModel[] = res.data;
          if (friendList.length > 0) {
            const data = new Map<string, FriendModel>();
            friendList.forEach(f => {
              data.set(f.friendUserUid.toString(), f);
              this.saveData<FriendModel>({model: 'friend', data: f, update: {friendUserUid: f.friendUserUid}});
            });
            this.cacheSource.next({friendMap: data});
          }
          resolve(true);
        }
      });
    });
  }

  /**
   * 获取并缓存群Map
   */
  cacheGroups(): Promise<boolean> {
    return new Promise(resolve => {
      this.restService.getUserJoinGroup().subscribe((res: NewHttpResponseInterface<GroupModel[]>) => {
        if(res.status === 200) {
          const groupMap = new Map<string, GroupModel>();
          res.data.forEach(g => {
            if(g) {
              groupMap.set(g.gid, g);
              this.saveData<GroupModel>({model: 'group', data: g, update: {gid: g.gid}});
            }
          });
          this.cacheSource.next({groupMap: groupMap});
          resolve(true);
        }
      });
    });
  }

  /**
   * 获取并缓存群管理员Map
   */
  cacheGroupAdmins(gid: string): Promise<Map<string, Map<string, GroupAdminModel>>> {
    return new Promise(resolve => {
      this.restService.getGroupAdminList(gid).subscribe((res: NewHttpResponseInterface<GroupAdminModel[]>) => {
        if(res.status === 200) {
          const groupAdminMap = new Map<string, GroupAdminModel>();
          res.data.forEach(admin => {
            groupAdminMap.set(admin.userUid.toString(), admin);
            admin.gid = gid;
            this.saveData<GroupAdminModel>({
              model: "groupAdmin", data: admin, update: {gid: gid, userUid: admin.userUid}
            });
          });
          const newData = new Map<string, Map<string, GroupAdminModel>>();
          this.cacheSource.next({groupAdminMap: newData});
          resolve(newData);
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
    this.clearDB().then(() => {});
  }

  /**
   * 缓存个人信息
   */
  cacheMyInfo(userId: number = null): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const localUserInfo = this.localUserService.localUserInfo;
      this.restService.getUserBaseById(localUserInfo.userId.toString()).subscribe((res: NewHttpResponseInterface<UserModel>) => {
        if(res.status === 200) {
          const data = res.data;
          data.userLevel = JSON.stringify(data.userLevel);
          this.saveDataSync<UserModel>({model: "user", data: data, update: {userUid: data.userUid}}).then(() => {
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
          title = friends.get(dataId).remark ? friends.get(dataId).remark:friends.get(dataId).nickname;
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
          msgContent: MessageService.parseMessageForShow(text, msgType),
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
      this.saveDataSync<MuteModel>({model: "mute", data: data, update: {dataId: dataId}}).then(() => {
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
      this.saveDataSync<TopModel>({model: "top", data: data, update: {dataId: dataId}}).then(() => {
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
          const groupMemberMap = new Map<string, GroupMemberModel>();
          res.data.list.forEach(member => {
            groupMemberMap.set(member.userUid.toString(), member);
            this.saveData<GroupMemberModel>({
              model: "groupMember", data: member, update: {groupId: gid, userUid: member.userUid}
            });
          });
          this.cacheSource.next({groupMemberMap: groupMemberMap});
          resolve(groupMemberMap);
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
    // 缓存我的黑名单
    this.restService.getMyBlackList().subscribe((res: NewHttpResponseInterface<BlackListModel[]>) => {
      if(res.status === 200) {
        const bl = new Map();
        // 先清除原有的记录,否则数据会重复
        this.deleteData<BlackListModel>({model: 'blackList', query: null}).then(()=>{
          if(res.data !== null) {
            let count = 0;
            res.data.forEach(item => {
              count ++;
              bl.set(item.userUid, item);
              this.saveDataSync<BlackListModel>({model: 'blackList', data: item}).then(()=>{
                if (count === res.data.length) {
                  this.cacheSource.next({blackListMap: bl});
                }
              });
            });

          } else {
            this.cacheSource.next({blackListMap: bl});
          }
        });
      }
    });
    // 缓存拉黑我的人
    this.restService.getBlackMeList().subscribe((res: NewHttpResponseInterface<BlackMeListModel[]>) => {
      if(res.status === 200) {
        const blMe = new Map();
        // 先清除原有的记录,否则数据会重复
        this.deleteData<BlackMeListModel>({model: 'blackMeList', query: {}}).then(()=>{
          if(res.data !== null) {
            let count = 0;
            res.data.forEach(item => {
              count ++;
              blMe.set(item.userUid, item);
              this.saveDataSync<BlackMeListModel>({model: 'blackMeList', data: item}).then(()=>{
                if (count === res.data.length) {
                  this.cacheSource.next({blackMeListMap: blMe});
                }
              });
            });

          } else {
            this.cacheSource.next({blackMeListMap: blMe});
          }
        });
      }
    });
  }

  /**
   * 缓存我的敏感词
   */
  sensitiveWordList() {
    // 缓存我的黑名单
    this.restService.getSensitiveWordList().subscribe((res: NewHttpResponseInterface<string[]>) => {
      if(res.status === 200) {
        this.sensitiveList = res.data;
        console.log("敏感词:", this.sensitiveList);
      }
    });
  }

  getBlackList(): Promise<Map<string, BlackListModel>> {
    return new Promise<Map<string, BlackListModel>>((resolve) => {
      this.queryData({model: 'blackList', query: {}}).then((res: IpcResponseInterface<BlackListModel>) => {
        const map = new Map();
        if(res.status === 200) {
          res.data.forEach(item => {
            map.set(item.userUid.toString() ,item);
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
      if (res.status === 200) {
        const map = new Map<string, FriendRequestModel>();
        res.data.forEach(item => {
          // 先从本地缓存中查出来数据，如果有历史记录，进行更新，
          this.queryData<FriendRequestModel>({
            model: 'friendRequest', query: {reqUserId: item.reqUserId}
          }).then((cacheRes: IpcResponseInterface<FriendRequestModel>) => {
            // 如果是在本地没有记录，才进行插入操作
            if (cacheRes.data.length === 0) {
              map.set(item.reqUserId.toString(), item);
              item.agree = null;
              this.saveDataSync<FriendRequestModel>({model: 'friendRequest', data: item}).then(() => {
                this.cacheSource.next({newFriendMap: map});
              });
            } else {
              // 否则，更新缓存
              cacheRes.data.forEach(cacheItem => {
                this.saveDataSync<FriendRequestModel>({
                  model: 'friendRequest', data: {agree: null}, update: {reqUserId: cacheItem.reqUserId}
                }).then(() => {
                  this.getNewFriendMap().then(saveRes => {
                    this.cacheSource.next({newFriendMap: saveRes});
                  });
                });
              });
            }
          });
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
    this.saveDataSync<FriendRequestModel>({
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
    this.saveDataSync<AtMeModel>({model: 'atMe', data: data, update: {fingerPrintOfProtocal: msg.fingerPrintOfProtocal}}).then(() => {
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

  /**
   * 获取拉黑我的人员列表
   */
  getBlackMeListCache(): Promise<Map<string, BlackMeListModel>>  {
    return new Promise((resolve) => {
      this.queryData({model: 'blackMeList', query: null}).then((res: IpcResponseInterface<BlackMeListModel>) => {
        const map = new Map();
        if(res.status === 200) {
          res.data.forEach(item => {
            map.set(item.userUid.toString() ,item);
          });
          resolve(map);
        } else {
          resolve(map);
        }
      });
    });
  }

  /**
   * 更新好友的在线状态
   * @param friendId
   * @param onlineStatus
   */
  updateFriendOnlineStatus(friendId: string, onlineStatus: boolean) {
    // 然后更新好友的在线状态信息
    this.saveDataSync<FriendModel>({
      model: 'friend', data: {onlineStatus: onlineStatus}, update: {friendUserUid: Number(friendId)}
    }).then(() => {
      this.cacheSource.next({});
    });
  }

  /**
   * 更新好友的备注
   * @param friendUserUid
   * @param remark
   */
  upFriendRemark(friendUserUid: number, remark: string) {
    this.saveDataSync<FriendModel>({
      model: 'friend', data: {remark: remark}, update: {friendUserUid: Number(friendUserUid)}
    }).then(()=>{
      this.queryData({model: 'friend', query: null}).then((res: IpcResponseInterface<FriendModel>) => {
        const map = new Map();
        if(res.status === 200) {
          res.data.forEach(f => {
            map.set(f.friendUserUid.toString(), f);
          });
        }
        this.cacheSource.next({friendMap: map});
      });
    });
    this.saveDataSync<ChattingModel>({
      model: 'chatting', data: {title: remark}, update: {dataId: friendUserUid.toString()}
    }).then(()=>{
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
        this.cacheSource.next({alarmDataMap: map});
      });
    });
  }

  saveSystemMessage(dataId: number, content: string, timestamp: number) {
    const chatMsgEntity: ChatmsgEntityModel = this.messageEntityService.prepareRecievedMessage(
      dataId.toString(), "", content, timestamp, 0, ""
    );
    chatMsgEntity.dataId = dataId.toString();
    chatMsgEntity.msgType = 999;
    this.saveDataSync<ChatmsgEntityModel>({
      model: "chatmsgEntity", data: chatMsgEntity, update: null
    }).then(() => {
      this.getChattingList().then(list => {
        this.cacheSource.next({alarmDataMap: list});
      });
    });
  }
}
