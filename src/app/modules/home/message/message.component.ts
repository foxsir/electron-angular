import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {AlarmsProviderService} from "@services/alarms-provider/alarms-provider.service";
import {MsgType} from "@app/config/rbchat-config";
import {LocalUserService} from "@services/local-user/local-user.service";
import {RestService} from "@services/rest/rest.service";
import {formatDate} from "@app/libs/mobileimsdk-client-common";
import {GroupChattingCacheService} from "@services/group-chatting-cache/group-chatting-cache.service";
import {SingleChattingCacheService} from "@services/single-chatting-cache/single-chatting-cache.service";
import {MessageEntityService} from "@services/message-entity/message-entity.service";

// import icon
import closeCircleIcon from "@app/assets/icons/close-circle.svg";
import closeCircleActiveIcon from "@app/assets/icons/close-circle-active.svg";
import settingIcon from "@app/assets/icons/setting.svg";
import settingActiveIcon from "@app/assets/icons/setting-active.svg";
import searchIcon from "@app/assets/icons/search.svg";
import searchActiveIcon from "@app/assets/icons/search-active.svg";
import voiceIcon from "@app/assets/icons/voice.svg";
import voiceActiveIcon from "@app/assets/icons/voice-active.svg";
import closePromptIcon from "@app/assets/icons/close-prompt.svg";
// import icon end
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {MatMenuTrigger} from "@angular/material/menu";
import {ImService} from "@services/im/im.service";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {MessageService} from "@services/message/message.service";
import {GroupsProviderService} from "@services/groups-provider/groups-provider.service";
import {TempMessageService} from "@services/temp-message/temp-message.service";
import {GroupMessageService} from "@services/group-message/group-message.service";
import {RosterProviderService} from "@services/roster-provider/roster-provider.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {ProtocalModel, ProtocalModelDataContent} from "@app/models/protocal.model";
import {MessageDistributeService} from "@services/message-distribute/message-distribute.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ContextMenuService} from "@services/context-menu/context-menu.service";
import {ContextMenuChattingModel, ContextMenuModel} from "@app/models/context-menu.model";
import {AvatarService} from "@services/avatar/avatar.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {AlarmDataMap, CacheService} from "@services/cache/cache.service";
import {MessageRoamService} from "@services/message-roam/message-roam.service";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {MatDrawer} from "@angular/material/sidenav";
import {MiniUiService} from "@services/mini-ui/mini-ui.service";
import {GroupModel} from "@app/models/group.model";
import FriendModel from "@app/models/friend.model";
import {Subscription} from "rxjs";
import GroupCommonMessageModel from "@app/models/group-common-message.model";
import TopModel from "@app/models/top.model";
import BlackListModel from "@app/models/black-list.model";
import BlackMeListModel from "@app/models/black-me-list.model";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("chattingPanel") chattingPanel: MatDrawer;
  readonly Infinity = 9999999999;
  @Output() sendMessage = new EventEmitter<{chat: ChatmsgEntityModel; dataContent: ProtocalModelDataContent}>();
  public drawerMode: 'side' | 'over' = 'side';
  public isMiniUI: boolean = false;

  // icon
  public closeCircleIcon = this.dom.bypassSecurityTrustResourceUrl(closeCircleIcon);
  public closeCircleActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeCircleActiveIcon);
  public settingIcon = this.dom.bypassSecurityTrustResourceUrl(settingIcon);
  public settingActiveIcon = this.dom.bypassSecurityTrustResourceUrl(settingActiveIcon);
  public searchIcon = this.dom.bypassSecurityTrustResourceUrl(searchIcon);
  public searchActiveIcon = this.dom.bypassSecurityTrustResourceUrl(searchActiveIcon);
  public voiceIcon = this.dom.bypassSecurityTrustResourceUrl(voiceIcon);
  public voiceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(voiceActiveIcon);
  public closePromptIcon = this.dom.bypassSecurityTrustResourceUrl(closePromptIcon);
  // end icon

  public alarmItemMap: AlarmDataMap = new Map();
  public chatMsgEntityList: ChatmsgEntityModel[];
  public currentChat: AlarmItemInterface;
  public currentChatAvatar: SafeResourceUrl;
  // public currentChatSubtitle: string = null;
  public formatDate = formatDate;
  public localUserInfo: LocalUserinfoModel;

  // 右键菜单
  public contextMenu: ContextMenuModel[] = [];
  public contextMenuChatting: ContextMenuChattingModel[] = [];

  // 是否正在搜索
  public searching = false;

  private currentUrl = '';

  // 引用回复消息
  // public quoteMessage: ChatmsgEntityModel = null;

  // // 显示创建群聊组件
  // public showCreateGroup: boolean = false;
  // // 显示添加好友组件
  // public showSearchFriend: boolean = false;

  public muteMap: Map<string, boolean> = new Map();
  public topMap: Map<string, boolean> = new Map();
  public topMapOfArray: string[] = [];

  public atMap: Map<string, number> = new Map();

  public currentSubscription: Subscription;

  constructor(
    private alarmsProviderService: AlarmsProviderService,
    private groupsProviderService: GroupsProviderService,
    private localUserService: LocalUserService,
    private restService: RestService,
    private messageEntityService: MessageEntityService,
    private messageService: MessageService,
    private groupMessageService: GroupMessageService,
    private tempMessageService: TempMessageService,
    private rosterProviderService: RosterProviderService,
    private groupChattingCacheService: GroupChattingCacheService,
    private singleChattingCacheService: SingleChattingCacheService,
    private imService: ImService,
    private snackBarService: SnackBarService,
    private messageDistributeService: MessageDistributeService,
    private dom: DomSanitizer,
    private contextMenuService: ContextMenuService,
    private avatarService: AvatarService,
    private cacheService: CacheService,
    private messageRoamService: MessageRoamService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private miniUiService: MiniUiService,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.localUserInfo = this.localUserService.localUserInfo;

    // 由服务端转发的消息
    this.subscribeOfGroupChatMsgServerToB();
    // 群聊/世界频道聊天消息：由发送人A发给服务端
    this.subscribeOfGroupChatMsgToServer();
    // 普通一对一聊天消息
    this.subscribeChattingMessage();
    // this.subscribeMessagesBeReceived();
    // this.subscribeQuote();
    this.subscribeChattingListUpdate();

    this.subscribeGroupAdminChange();

    this.subscribeGroupMemberWasRemoved();
    // 解散群
    this.subscribeDissolveGroup();
    // 被删除的通知
    this.subscribeDeleteFriend();
    // 订阅群的通知消息等
    this.subscribeGroupSystemMessage();
    // 订阅群的基本信息
    this.subscribeGroupInfoChange();
    // 订阅好友请求相关通知
    this.subscribeFriendRequest();
  }

  ngOnInit(): void {
    this.cacheService.getMute().then((map) => {
      if (map) {
        this.muteMap = map;
      }
    });
    this.cacheService.getTop().then((map) => {
      if (map) {
        this.topMap = map;
      }
      this.topMapOfArray = new Array(...this.topMap.keys());
    });

    this.cacheService.cacheSessionStatusList();

    this.cacheService.getChattingList().then(res => {
      if (res) {
        const aMap = new Map();
        res.forEach(item => aMap.set(item.alarmData.alarmItem.dataId, {alarmData: item.alarmData}));
        this.alarmItemMap = aMap;
        this.getAtMeMessage();
        console.log('聊天会话：', res);
      }
      this.cacheService.syncChattingList(res).then(list => {
      });
    });

    this.currentSubscription = this.currentChattingChangeService.currentChatting$.subscribe((alarm: AlarmItemInterface) => {
      // console.log("在message组件发送已读消息");
      // this.currentChat = alarm;
      // if (alarm) {
      //   // 发送已读
      //   this.messageService.alreadyRead(this.currentChat.alarmItem.dataId, this.currentChat.metadata.chatType);
      // }
    });
    this.currentChat = this.currentChattingChangeService.currentChatting;
  }

  ngAfterViewInit() {
    setTimeout(() => this.listenMiniUI());
  }


  listenMiniUI() {
    this.chattingPanel.open().then();
    this.drawerMode = this.miniUiService.isMini ? 'over' : 'side';
    this.miniUiService.messageDrawer$.subscribe(open => {
      if (open) {
        this.chattingPanel.open().then();
      } else {
        this.chattingPanel.close().then();
      }
    });
    this.miniUiService.mini$.subscribe((mini) => {
      this.isMiniUI = mini;
      this.drawerMode = mini ? 'over' : 'side';
    });
  }

  insertItem(alarmData: AlarmItemInterface) {
    if (this.alarmItemMap.get(alarmData.alarmItem.dataId)) {
      const item = this.alarmItemMap.get(alarmData.alarmItem.dataId);
      item.alarmData.alarmItem = alarmData.alarmItem;
    } else {
      this.alarmItemMap.set(alarmData.alarmItem.dataId, {alarmData: alarmData});
    }
  }

  /**
   * 群的基本信息变更
   */
  subscribeGroupInfoChange() {
    this.messageDistributeService.GROUP_INFO_UPDATE$.subscribe((protocol: ProtocalModel) => {
      const dataContent: any = JSON.parse(protocol.dataContent);
      const gid: string = dataContent.groupId;
      this.cacheService.getCacheGroups().then();
      this.cacheService.cacheGroupModel(gid);

      // this.cacheService.cacheGroupModel(gid).then();
    });
  }

  /**
   * 群管理员变更
   */
  subscribeGroupAdminChange() {
    this.messageDistributeService.UPDATE_GROUP_ADMIN$.subscribe((protocol: ProtocalModel) => {
      const dataContent: any = JSON.parse(protocol.dataContent);
      const gid: string = dataContent.groupId;
      this.cacheService.getCacheGroupAdmins(gid).then();
      this.cacheService.cacheGroupAdmins(gid).then();
    });
  }

  /**
   * 群被解散后收到的消息
   */
  subscribeDissolveGroup() {
    this.messageDistributeService.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVER$.subscribe((res: ProtocalModel) => {
      console.log("收到群被解散的指令:" + res);
      // 拿到群id
      const dataContent: any = JSON.parse(res.dataContent);
      const groupId: string = dataContent.t;
      // 进行删除会话和删除聊天记录的操作
      // 删除会话
      this.cacheService.deleteChattingCache(groupId).then(() => {
      });
      // 清空历史消息 先通过群id找到这个会话
      this.cacheService.generateAlarmItem(groupId, 'group').then(chat => {
        this.cacheService.clearChattingCache(chat).then(() => {
        });
      });
      this.cacheService.deleteData<GroupModel>({model: 'group', query: {gid: groupId}}).then();
      // 删除聊天界面
      if (this.currentChat && this.currentChat.alarmItem.dataId == groupId) {
        this.currentChattingChangeService.switchCurrentChatting(null).then();
      }

      this.ngOnInit();
    });
  }

  /**
   * 有人退群
   */
  subscribeGroupMemberQuit() {
    this.messageDistributeService.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER$.subscribe((protocol: ProtocalModel) => {

    });
  }

  /**
   * "你"被踢出群聊
   */
  subscribeGroupMemberWasRemoved() {
    this.messageDistributeService.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER$.subscribe((res: ProtocalModel) => {
      // 解析消息体，拿到群信息
      const groupMsg: GroupCommonMessageModel = JSON.parse(res.dataContent);
      this.snackBarService.systemNotification(groupMsg.m);
      // 删除会话信息等
      const groupId = groupMsg.t;
      // 删除会话
      this.cacheService.deleteChattingCache(groupId).then(() => {
      });
      // 清空历史消息 先通过群id找到这个会话
      this.cacheService.generateAlarmItem(groupId, 'group').then(chat => {
        this.cacheService.clearChattingCache(chat).then(() => {
        });
      });
      this.cacheService.deleteData<GroupModel>({model: 'group', query: {gid: groupId}}).then();
      // 删除聊天界面
      if (this.currentChat && this.currentChat.alarmItem.dataId == groupId) {
        this.currentChattingChangeService.switchCurrentChatting(null).then();
      }
    });
  }

  /**
   * 订阅会话列表更新
   * @private
   */
  private subscribeChattingListUpdate() {
    this.cacheService.cacheUpdate$.subscribe(cache => {
      this.zone.run(() => {
        if (cache.muteMap) {
          this.muteMap = cache.muteMap;
        } else if (cache.alarmDataMap) {
          this.alarmItemMap = cache.alarmDataMap;
        } else if (cache.topMap) {
          this.topMap = cache.topMap;
        } else if (cache.atMe) {
          this.getAtMeMessage();
        }
        this.changeDetectorRef.detectChanges();
      });
    });
  }

  /**
   * 普通一对一聊天消息的报文头（聊天消息可能是：文本、图片、语音留言、礼物等）
   * @private
   */
  private subscribeChattingMessage() {
    this.messageDistributeService.MT03_OF_CHATTING_MESSAGE$.subscribe((res: ProtocalModel) => {
      const dataContent: any = JSON.parse(res.dataContent);
      // alert("单聊" + data.from);
      // this.cacheService.generateAlarmItem(res).then(alarm => {
      //   this.cacheService.setChattingBadges(alarm, 1);
      // });

      // const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
      //   res.from, dataContent.nickName, dataContent.m, (new Date()).getTime(), dataContent.ty, res.fp
      // );
      // // fromUid, nickName, msg, time, msgType, fp = null
      // chatMsgEntity.isOutgoing = true;
      // this.cacheService.putChattingCache(this.currentChat, chatMsgEntity).then(() => {
      //   this.pushMessageToPanel(chatMsgEntity);
      // });
    });
  }

  /**
   * 群聊/世界频道聊天消息：由发送人A发给服务端
   * @private
   */
  private subscribeOfGroupChatMsgToServer() {
    this.messageDistributeService.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER$.subscribe((res: ProtocalModel) => {
      // const dataContent: any = JSON.parse(res.dataContent);
      // const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
      //   res.from, dataContent.nickName, dataContent.m, (new Date()).getTime(), dataContent.ty, res.fp
      // );
      // fromUid, nickName, msg, time, msgType, fp = null
      // this.pushMessageToPanel(chatMsgEntity);
    });
  }

  /**
   * 由服务端转发的消息
   * @private
   */
  private subscribeOfGroupChatMsgServerToB() {
    this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$.subscribe((res: ProtocalModel) => {
      const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
      const ty = Number(dataContent.ty);
      switch (ty) {
        case MsgType.TYPE_AITE: // 处理@
          console.dir(dataContent);
          break;
      }
    });
  }

  public subscribeDeleteFriend() {
    this.messageDistributeService.DELETE_FRIEND$.subscribe((res: ProtocalModel) => {
      // 拿到好友id
      const dataContent: any = JSON.parse(res.dataContent);
      const friendId: string = dataContent.userId;
      console.log("收到被好友删除的指令,好友id:" + friendId);
      // 先找的这个会话
      this.cacheService.generateAlarmItem(friendId, 'friend').then(chat => {
        // 删除所有的聊天记录
        this.cacheService.clearChattingCache(chat).then(() => {
        });
        // 删除会话
        this.cacheService.deleteChattingCache(friendId).then(() => {
        });
        // 删除聊天界面
        console.log("当前会话是:", this.currentChat);
        if (this.currentChat && this.currentChat.alarmItem.dataId == friendId) {
          this.currentChattingChangeService.switchCurrentChatting(null).then();
        }
        // 从我好友里里删除
        this.cacheService.deleteData<FriendModel>({
          model: 'friend',
          query: {friendUserUid: Number(friendId)}
        }).then(() => {
          // 更新好友缓存
          this.cacheService.cacheFriends().then();
        });
        // 删除置顶
        this.cacheService.deleteData<TopModel>({model: 'top', query: {dataId: friendId}}).then();
        // 从我的黑名单里删除
        this.cacheService.deleteData<BlackListModel>({model: 'blackList', query: {userUid: Number(friendId)}}).then();
        // 从拉黑我的人里删除
        this.cacheService.deleteData<BlackMeListModel>({
          model: 'blackMeList',
          query: {userUid: Number(friendId)}
        }).then();
      });
    });
  }


  /**
   * 订阅群相关的系统消息
   * @private
   */
  private subscribeGroupSystemMessage() {
    // 处理创建群/被邀请入群的指令
    this.messageDistributeService.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVER$.subscribe((protocol: ProtocalModel) => {
      const content = JSON.parse(protocol.dataContent);
      let text: string;
      if (content.g_owner_user_uid.toString() === this.localUserService.localUserInfo.userId.toString()) {
        text = "你已经成功创建群聊";
      } else {
        text = "你已经被邀请入群";
      }
      this.cacheService.saveSystemMessage(content.g_id, text, protocol.sm, protocol.fp);
      // 生成一个新的会话
      const alarmData: AlarmItemInterface = {
        alarmItem: {
          alarmMessageType: 0,
          dataId: content.g_id,
          date: protocol.sm,
          msgContent: "",
          title: content.g_name,
          avatar: content.avatar,
        },
        metadata: {
          chatType: 'group'
        }
      };
      this.cacheService.cacheGroups().then();
      this.cacheService.putChattingCache(alarmData).then(() => {
        this.currentChattingChangeService.switchCurrentChatting(alarmData).then(() => {
        });
      });

    });
    // 处理通用的群系统指令
    this.messageDistributeService.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER$.subscribe((protocol: ProtocalModel) => {
      const dataContent: any = JSON.parse(protocol.dataContent);
      const text: string = dataContent.m;
      this.snackBarService.openMessage(text);
      this.cacheService.saveSystemMessage(dataContent.t, text, protocol.sm, protocol.fp);
    });
    // 处理群名被更改的指令
    this.messageDistributeService.MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVER$.subscribe((protocol: ProtocalModel) => {
      const dataContent: any = JSON.parse(protocol.dataContent);
      const text: string = dataContent.notificationContent;
      this.snackBarService.openMessage(text);
      this.cacheService.saveSystemMessage(dataContent.gid, text, protocol.sm, protocol.fp);
    });
    // 处理有人退群/被踢的逻辑
    this.messageDistributeService.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER$.subscribe((protocol: ProtocalModel) => {
      const dataContent: any = JSON.parse(protocol.dataContent);
      const text: string = dataContent.m;
      this.snackBarService.openMessage(text);
      this.cacheService.saveSystemMessage(dataContent.t, text, protocol.sm, protocol.fp);
    });
  }


  /**
   * 订阅好友请求相关的通知
   * @private
   */
  private subscribeFriendRequest() {
    // 添加好友后，收到服务器返回的错误信息
    this.messageDistributeService.MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$A$.subscribe((protocol: ProtocalModel) => {
      const dataContent: any = protocol.dataContent;
      this.snackBarService.systemNotification(dataContent);
    });
    // 好友请求被同意
    this.messageDistributeService.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENT$.subscribe((protocol: ProtocalModel) => {
      const dataContent: any = JSON.parse(protocol.dataContent);
      const beRequestUser: string = dataContent.beRequestUser;
      const token: string = dataContent.token;
      const friendInfo: FriendModel = dataContent.friendInfo;
      this.cacheService.cacheFriends().then(() => {
        // 缓存后,清除掉好友请求
        this.cacheService.updateNewFriendMap(friendInfo.friendUserUid, true);
        setTimeout(() => {
          this.cacheService.cacheFriends().then();
        }, 1000);
      });
      if (beRequestUser == this.localUserService.localUserInfo.userId.toString()) {
        this.snackBarService.openMessage("你已经和" + friendInfo.nickname + "成为好友了");
        if (token && token == this.localUserService.localUserInfo.token) {
          // 在这里发送消息,生成新的会话
          // 然后发送一条消息
          const alarm: AlarmItemInterface = {
            alarmItem: {
              alarmMessageType: 0, // 0单聊 1临时聊天/陌生人聊天 2群聊
              dataId: friendInfo.friendUserUid.toString(),
              date: new Date().getTime(),
              msgContent: "",
              title: friendInfo.remark?friendInfo.remark:friendInfo.nickname,
              avatar: friendInfo.userAvatarFileName,
            },
            // 聊天元数据
            metadata: {
              chatType: "friend", // "friend" | "group"
            },
          };
          this.cacheService.putChattingCache(alarm).then(() => {
            this.currentChattingChangeService.switchCurrentChatting(alarm).then().then(()=> {
              this.messageService.sendMessage(MsgType.TYPE_TEXT,friendInfo.friendUserUid,"我们已经是好友了,开始聊天吧！").then(res => {
                if(res.success === true) {
                  // 自已发出的消息，也要显示在相应的UI界面上
                  const message = res.msgBody.m;
                  //111 新增指纹码 he 消息类型msgType
                  const chatMsgEntity: ChatmsgEntityModel = this.messageEntityService.prepareSendedMessage(
                    message, new Date().getTime(), res.fingerPrint, MsgType.TYPE_TEXT
                  );
                  chatMsgEntity.uh = this.localUserService.localUserInfo.userAvatarFileName;
                  this.sendMessage.emit({chat: chatMsgEntity, dataContent: res.msgBody});
                }
              });
            });
          });
        }
      } else {
        this.snackBarService.openMessage(friendInfo.nickname + "同意了你的好友请求");
      }
    });
    // 好友请求已经同意
    this.messageDistributeService.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENT$.subscribe((protocol: ProtocalModel) => {
      const dataContent: any = JSON.parse(protocol.dataContent);
      const friendInfo: FriendModel = dataContent.friendInfo;
      this.cacheService.updateNewFriendMap(friendInfo.friendUserUid, true);
      this.cacheService.cacheFriends().then();
    });
    // 好友请求被拒绝
    this.messageDistributeService.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULT$.subscribe((protocol: ProtocalModel) => {
      const dataContent: any = JSON.parse(protocol.dataContent);
      const beRequestUser: string = dataContent.beRequestUser;
      const friendInfo: FriendModel = dataContent.friendInfo;
      this.cacheService.cacheFriends().then(() => {
        // 缓存后,清除掉好友请求
        this.cacheService.updateNewFriendMap(friendInfo.friendUserUid, false);
        setTimeout(() => {
          this.cacheService.cacheFriends().then();
        }, 1000);
      });
      this.snackBarService.openMessage(friendInfo.nickname + "拒绝了你的好友请求");
    });

    // 监听好友请求
    this.messageDistributeService.MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$B$.subscribe(() => {
      this.cacheService.cacheNewFriends();
    });

  }


  /**
   * 切换聊天对象
   * @param alarm
   */
  switchChat(alarm: AlarmItemInterface) {
    // 如果是第一次进入会话
    if (!this.currentChat) {
      this.currentChat = alarm;
      this.currentChattingChangeService.switchCurrentChatting(this.currentChat).then(() => {
        // 缓存群管理员列表
        if (this.currentChat.metadata.chatType === 'group') {
          this.cacheService.cacheGroupAdmins(this.currentChat.alarmItem.dataId).then();
          this.cacheService.cacheGroupMembers(this.currentChat.alarmItem.dataId).then();
        }
      });
    } else {
      // 离开之前的会话时,也要发送已读消息
      console.log("离开上次会话时发送已读消息", this.currentChat);
      this.messageService.alreadyRead(this.currentChat.alarmItem.dataId, this.currentChat.metadata.chatType);
      if (this.currentChat.alarmItem.dataId !== alarm.alarmItem.dataId) {
        this.currentChat = alarm;
        this.currentChattingChangeService.switchCurrentChatting(this.currentChat).then(() => {
          // 缓存群管理员列表
          if (this.currentChat.metadata.chatType === 'group') {
            this.cacheService.cacheGroupAdmins(this.currentChat.alarmItem.dataId).then();
            this.cacheService.cacheGroupMembers(this.currentChat.alarmItem.dataId).then();
          }
        });
      } else {
        // 如果是当前会话，只清除badges
        this.cacheService.setChattingBadges(this.currentChat, 0);
      }
    }
    // 最后发送新会话的已读消息
    console.log("进入新会话时发送已读消息", this.currentChat);
    this.messageService.alreadyRead(this.currentChat.alarmItem.dataId, this.currentChat.metadata.chatType);
  }

  async contextMenuForChatting(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement, alarmItem: AlarmItemInterface) {
    this.contextMenuChatting = await this.contextMenuService.getContextMenuForChatting(alarmItem);
    menu.openMenu();
    span.style.position = "fixed";
    span.style.top = "0px";
    span.style.left = "0px";
    span.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
    return e.defaultPrevented;
  }

  getAtMeMessage() {
    this.alarmItemMap.forEach(chatting => {
      const dataId = chatting.alarmData.alarmItem.dataId;
      this.cacheService.getAtMessage(dataId).then(ats => {
        this.atMap.set(dataId, ats.length);
      });
    });
  }

  keepOrder() {
    return 1;
  }

  ngOnDestroy() {
    this.currentSubscription.unsubscribe();
  }


}
