import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlarmsProviderService} from "@services/alarms-provider/alarms-provider.service";
import RBChatUtils from "@app/libs/rbchat-utils";
import {AlarmMessageType, ChatModeType, MsgType, RBChatConfig, UserProtocalsType} from "@app/config/rbchat-config";
import {LocalUserService} from "@services/local-user/local-user.service";
import {RestService} from "@services/rest/rest.service";
import {createCommonData2, formatDate} from "@app/libs/mobileimsdk-client-common";
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
import {ContextMenuModel, ContextMenuChattingModel} from "@app/models/context-menu.model";
import {AvatarService} from "@services/avatar/avatar.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {AlarmDataMap, CacheService} from "@services/cache/cache.service";
import {MessageRoamService} from "@services/message-roam/message-roam.service";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {MatDrawer} from "@angular/material/sidenav";
import {MiniUiService} from "@services/mini-ui/mini-ui.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, AfterViewInit {
  @ViewChild("chattingPanel") chattingPanel: MatDrawer;
  readonly Infinity = 9999999999;

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

  public alarmItemList: AlarmDataMap = new Map();
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
    private miniUiService: MiniUiService
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
    this.subscribeCommonSystemMessage();
    this.subscribeGroupMemberWasRemoved();
    this.subscribeGroupMemberQuit();
    this.subscribeSENSITIVEWordUpdate(); // 敏感词
  }

  ngOnInit(): void {
    this.cacheService.getMute().then((map) => {
      if(map) {
        this.muteMap = map;
      }
      this.cacheService.cacheUpdate$.subscribe(data => {
        if(data.muteMap) {
          this.muteMap = data.muteMap;
        }
      });
    });
    this.cacheService.getTop().then((map) => {
      if(map) {
        this.topMap = map;
      }
      this.topMapOfArray = new Array(...this.topMap.keys());
      this.cacheService.cacheUpdate$.subscribe(data => {
        if(data.topMap) {
          this.topMap = data.topMap;
          this.topMapOfArray = new Array(...this.topMap.keys());
        }
      });
    });

    this.cacheService.cacheSessionStatusList();

    this.cacheService.getChattingList().then(res => {
      res = res ? res : new Map();
      res.forEach(item => this.insertItem(item.alarmData));
      this.cacheService.syncChattingList(res).then(list => {
        list.forEach(item => this.insertItem(item));
      });
    });

    this.currentChattingChangeService.currentChatting$.subscribe((alarm: AlarmItemInterface) => {
      this.currentChat = alarm;
    });
    this.currentChat = this.currentChattingChangeService.currentChatting;
  }

  ngAfterViewInit() {
    this.listenMiniUI();
  }

  listenMiniUI() {
    this.chattingPanel.open().then();
    this.drawerMode = this.miniUiService.isMini ? 'over' : 'side';
    this.miniUiService.messageDrawer$.subscribe(open => {
      if(open) {
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
    if(this.alarmItemList.get(alarmData.alarmItem.dataId)) {
      const item = this.alarmItemList.get(alarmData.alarmItem.dataId);
      item.alarmData.alarmItem = alarmData.alarmItem;
    } else {
      this.alarmItemList.set(alarmData.alarmItem.dataId, {alarmData: alarmData});
    }
  }

  /**
   * 群管理员变更
   */
  subscribeGroupAdminChange() {
    this.messageDistributeService.UPDATE_GROUP_ADMIN$.subscribe((res: ProtocalModel) => {
      this.snackBarService.openMessage('群管理员发生变更');
    });
  }

  /**
   * 有人退群
   */
  subscribeGroupMemberQuit() {
    this.messageDistributeService.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER$.subscribe((res: ProtocalModel) => {
      this.snackBarService.openMessage('有人退群');
    });
  }

  /**
   * "你"被踢出群聊
   */
  subscribeGroupMemberWasRemoved() {
    this.messageDistributeService.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER$.subscribe((res: ProtocalModel) => {
      this.snackBarService.openMessage('被踢');
    });
  }

  /**
   * 通用通知消息
   */
  subscribeCommonSystemMessage() {
    this.messageDistributeService.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER$.subscribe((res: ProtocalModel) => {
      const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
      this.snackBarService.openMessage(dataContent.m);
    });
  }

  /**
   * 订阅会话列表更新
   * @private
   */
  private subscribeChattingListUpdate() {
    this.cacheService.cacheUpdate$.subscribe(cache => {
      console.dir("subscribe cache");
      this.cacheService.getChattingList().then(res => {
        if(res && res.size) {
          this.alarmItemList = res;
        }
      });
    });
  }

  /**
   * 消息已被对方收到的回调事件通知
   * @private
   */
  // private subscribeMessagesBeReceived() {
  //   this.imService.callback_messagesBeReceived = (fingerPrint) => {
  //     if (fingerPrint) {
  //       this.cacheService.getChattingCache(this.currentChat).then(data => {
  //         if(data[fingerPrint]) {
  //           const chat: ChatmsgEntityModel = data[fingerPrint];
  //           chat.isOutgoing = true;
  //           this.cacheService.putChattingCache(this.currentChat, chat).then(() => {
  //             this.cacheService.getChattingCache(this.currentChat).then(res => {
  //               if(!!res) {
  //                 this.chatMsgEntityList = Object.values(res);
  //               }
  //             });
  //           });
  //         }
  //       });
  //     }
  //   };
  // }

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
      // alert("群组" + dataContent.t);
      const ty = Number(dataContent.ty);
      switch (ty) {
        case MsgType.TYPE_AITE: // 处理@
          console.dir(dataContent);
          break;
      }
    });
  }

  /**
   * 敏感词更新
   * @private
   */
  private subscribeSENSITIVEWordUpdate() {
    this.messageDistributeService.SENSITIVE_WORD_UPDATE$.subscribe((res: ProtocalModel) => {
      // 需要获取敏感词并缓存
      alert("敏感词更新");
    });
  }

  /**
   * 切换聊天对象
   * @param alarm
   */
  switchChat(alarm: AlarmItemInterface) {
    if(!this.currentChat || this.currentChat.alarmItem.dataId !== alarm.alarmItem.dataId) {
      this.currentChat = alarm;
      this.currentChattingChangeService.switchCurrentChatting(this.currentChat).then(() => {
        // 缓存群管理员列表
        if (this.currentChat.metadata.chatType === 'group') {
          this.cacheService.cacheGroupAdmins(this.currentChat.alarmItem.dataId).then();
        }
      });
    } else {
      // 如果是当前会话，只清除badges
      this.cacheService.setChattingBadges(this.currentChat, 0);
    }
  }

  contextMenuForChatting(
    e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement, alarmItem: AlarmItemInterface
  ) {
    this.contextMenuChatting = this.contextMenuService.getContextMenuForChatting(alarmItem);
    menu.openMenu();
    span.style.position = "fixed";
    span.style.top = "0px";
    span.style.left = "0px";
    span.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
    return e.defaultPrevented;
  }

}
