import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import HttpPresponseModel from "@app/interfaces/http-response.interface";
import ChattingModel from "@app/models/chatting.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ContextMenuService} from "@services/context-menu/context-menu.service";
import {ContextMenuModel, ContextMenuChattingModel} from "@app/models/context-menu.model";
import {AvatarService} from "@services/avatar/avatar.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CacheService} from "@services/cache/cache.service";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";
import {MessageRoamService} from "@services/message-roam/message-roam.service";
import {NavigationEnd, Router} from "@angular/router";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  // @ViewChild("chattingContainer") chattingContainer: ElementRef;

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

  public alarmItemList: AlarmItemInterface[] = [];
  public chatMsgEntityList: ChatmsgEntityModel[];
  public currentChat: AlarmItemInterface;
  public currentChatAvatar: SafeResourceUrl;
  // public currentChatSubtitle: string = null;
  public formatDate = formatDate;
  public localUserInfo: LocalUserinfoModel;

  // 新消息提醒
  public massageBadges = {};

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
    private router: Router,
    private contextMenuService: ContextMenuService,
    private avatarService: AvatarService,
    private cacheService: CacheService,
    private quoteMessageService: QuoteMessageService,
    private messageRoamService: MessageRoamService,
    private currentChattingChangeService: CurrentChattingChangeService,
  ) {
    this.localUserInfo = this.localUserService.localUserInfo;

    this.subscribeOfGroupChatMsgServerToB();
    this.subscribeOfGroupChatMsgToServer();
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
    // 监听url变换，满足条件时重置UI
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if(e.url === "/home/message") {
          this.resetUI();
        }
      }
    });

    this.cacheService.getChattingList().then(res => {
      if(res) {
        Object.values(res).forEach(item => {
          this.insertItem(item.alarmData);
        });
      }
      this.cacheService.SyncChattingList(res || {}).then(list => {
        list.forEach(item => this.insertItem(item));
      });
    });

    this.currentChattingChangeService.currentChatting$.subscribe((alarm: AlarmItemInterface) => {
      this.currentChat = alarm;
    });
  }

  /**
   * 群管理员变更
   */
  subscribeGroupAdminChange() {
    this.messageDistributeService.UPDATE_GROUP_ADMIN$.subscribe((res: ProtocalModel) => {
      this.snackBarService.openSnackBar('群管理员发生变更');
    });
  }

  /**
   * 有人退群
   */
  subscribeGroupMemberQuit() {
    this.messageDistributeService.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER$.subscribe((res: ProtocalModel) => {
      this.snackBarService.openSnackBar('有人退群');
    });
  }

  /**
   * "你"被踢出群聊
   */
  subscribeGroupMemberWasRemoved() {
    this.messageDistributeService.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER$.subscribe((res: ProtocalModel) => {
      this.snackBarService.openSnackBar('被踢');
    });
  }

  /**
   * 通用通知消息
   */
  subscribeCommonSystemMessage() {
    this.messageDistributeService.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER$.subscribe((res: ProtocalModel) => {
      const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
      this.snackBarService.openSnackBar(dataContent.m);
    });
  }

  /**
   * 订阅会话列表更新
   * @private
   */
  private subscribeChattingListUpdate() {
    this.cacheService.cacheUpdate$.subscribe(cache => {
      console.dir("subscribe cache");
      if (cache.alarmData) {
        const alarmDataList: AlarmItemInterface[] = [];
        Object.values(cache.alarmData).forEach((alarm: {alarmData: AlarmItemInterface}) => {
          alarmDataList.push(alarm.alarmData);
        });
        this.alarmItemList = alarmDataList;
      }
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
      this.massageBadges[res.from.trim()] = 4;

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
   * 由服务端转发
   * @private
   */
  private subscribeOfGroupChatMsgServerToB() {
    this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$.subscribe((res: ProtocalModel) => {
      const dataContent: any = JSON.parse(res.dataContent);
      // alert("群组" + dataContent.t);
      console.dir(dataContent.ty === 15);
      this.massageBadges[dataContent.t.trim()] = 99;
    });
  }

  /**
   * 敏感词更新
   * @private
   */
  private subscribeSENSITIVEWordUpdate() {
    this.messageDistributeService.SENSITIVE_WORD_UPDATE$.subscribe((res: ProtocalModel) => {
      // 需要获取敏感词并缓存
    });
  }

  // private subscribeQuote() {
  //   this.quoteMessageService.message$.subscribe((meg) => {
  //     this.quoteMessage = meg;
  //     this.scrollToBottom();
  //   });
  // }

  clearSubscribeQuote() {
    this.quoteMessageService.setQuoteMessage(null);
  }

  // showChattingList(list: []) {
  //   list.forEach(row => {
  //     const chatUserUid = row[0];
  //     const chatUserNickname = row[1];
  //
  //     // 聊天消息类型，见MsgBodyRoot类中的定义
  //     // 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/constant-values.html#com.x52im.rainbowchat.im.dto.MsgBodyRoot.CHAT_TYPE_GROUP$CHAT
  //     const msgType = row[2];
  //     const msgContent = row[3];
  //     const msgTimestamp = row[5]; // 消息时间（java时间戳）
  //
  //     const isFriend = Number(row[7]); // 此聊天对象是否是“我”的好友，本字段值为：0或1
  //
  //     const chatType = Number(row[8]); // 2表示群聊，否则是单聊（See ChatModeType）
  //     const gid = row[9]; // 群id（群聊消息时有意义）
  //     const gname = row[10]; // 群名称（群聊消息时有意义）
  //
  //     const istop = row[12];//111 置顶
  //
  //     // const isonLine = row[12];//111 置顶
  //
  //
  //     let alarmData: ChattingModel = null;
  //
  //     // 群聊消息
  //     if (chatType === ChatModeType.CHAT_TYPE_GROUP$CHAT) {
  //       // 群聊消息的发出者uid
  //       const srcUid = row[6];
  //       // true表示是我自已发出的群聊消息
  //       const isMe = (srcUid === this.localUserService.getUid());
  //
  //       // 我自已发出的消息，在首页“消息”里显示时，不需要显示昵称了（就像微信一样）;
  //       //111 新增了 57
  //       if (Number(msgType) !== 57) {
  //         alarmData = this.alarmsProviderService.createAGroupChatMsgAlarm(msgType, msgContent, gname, gid,
  //           isMe ? null : chatUserNickname, RBChatUtils.isStringEmpty(msgTimestamp) ?
  //             RBChatUtils.getCurrentUTCTimestamp() : msgTimestamp,);
  //         //111 插入置顶
  //         alarmData.istop = istop;
  //
  //         const alarmItem: AlarmItemInterface = {
  //           alarmItem: alarmData,
  //           metadata: {msgType: chatType}
  //         };
  //         this.insertItem(alarmItem);
  //       }
  //     } else { // 单聊消息
  //       // 是“我”的好友
  //       if (isFriend === 1) {
  //         alarmData = this.alarmsProviderService.createChatMessageAlarm(
  //           msgType, msgContent, chatUserNickname, chatUserUid, RBChatUtils
  //             .isStringEmpty(msgTimestamp) ? RBChatUtils.getCurrentUTCTimestamp() :
  //             msgTimestamp);
  //       } else {
  //         // 陌生人
  //         alarmData = this.alarmsProviderService.createATempChatMsgAlarm(
  //           msgType, msgContent, chatUserNickname, chatUserUid, RBChatUtils
  //             .isStringEmpty(msgTimestamp) ? RBChatUtils.getCurrentUTCTimestamp() :
  //             msgTimestamp);
  //       }
  //       //111 插入置顶
  //       alarmData.istop = istop;
  //       const alarmItem: AlarmItemInterface = {
  //         alarmItem: alarmData,
  //         metadata: {msgType: chatType}
  //       };
  //       this.insertItem(alarmItem);
  //     }
  //   });
  // }

  insertItem(alarmData: AlarmItemInterface) {
    Object.assign(this.massageBadges, {[alarmData.alarmItem.dataId.trim()]: 0});

    if (Object.is(Boolean(alarmData.alarmItem.istop), true)) {
      this.alarmItemList = [alarmData, ...this.alarmItemList];
    } else {
      this.alarmItemList = [ ...this.alarmItemList, alarmData];
    }
  }

  // pushMessageToPanel(chat: ChatmsgEntityModel) {
  //   if(this.chatMsgEntityList) {
  //     this.chatMsgEntityList.push(chat);
  //     this.scrollToBottom();
  //   }
  //   // chatMsg.fingerPrintOfProtocal
  // }

  /**
   * 切换聊天对象
   * @param alarm
   */
  switchChat(alarm: AlarmItemInterface) {
    // 检查本地缓存是否是最新，如果不是需要更新漫游消息，放在之后做
    // this.cacheService.checkCacheIsNewest(alarm);

    this.resetUI();
    this.currentChat = alarm;
    this.currentChattingChangeService.switchCurrentChatting(this.currentChat);
    return this.router.navigate(['/home/message']).then(() => {
      // 缓存群管理员列表
      if (this.currentChat.metadata.chatType === 'group') {
        this.cacheService.cacheGroupAdmins(this.currentChat.alarmItem.dataId);
      }
    });

    // // 获取缓存
    // this.cacheService.getChattingCache(this.currentChat).then(data => {
    //   if(!!data) {
    //     this.chatMsgEntityList = Object.values(data);
    //   }
    // });

    // this.avatarService.getAvatar(alarm.alarmItem.dataId).then(url => {
    //   this.currentChatAvatar = this.dom.bypassSecurityTrustResourceUrl(url);
    // });
    //
    // this.restService.getUserBaseById(alarm.alarmItem.dataId).subscribe(res => {
    //   if (res.data !== null) {
    //     this.currentChatSubtitle = [res.data.latestLoginAddres, res.data.registerIp].join(": ");
    //   } else {
    //     this.currentChatSubtitle = null;
    //   }
    // });
    // this.chatMsgEntityList = [];
    // this.loadChattingHistoryFromServer(this.currentChat);
    // this.scrollToBottom('auto');
  }

  resetUI() {
    // this.showCreateGroup = false;
    // this.showSearchFriend = false;
  }

  // loadChattingHistoryFromServer(currentChat) {
  //   const isGroupChatting = currentChat.currentChat === AlarmMessageType.groupChatMessage;
  //   const beyongDataId = currentChat.dataId;
  //
  //   // 要加载的聊天记录的开始时间
  //   let startTime = null;
  //   // 要加载的聊天记录的结束时间
  //   let endTime = null;
  //   const QUERY_DATE_PATTERN = 'yyyy-MM-dd hh:mm:ss';
  //
  //   // 【计算聊天记录的开始时间查询条件】：当前默认定义为加载15天内的聊天
  //   // 记录（见RBChatConfig.CHATTING_HISTORY_LOAD_TIME_INTERVAL常量定义）
  //   const dtForStart = new Date();
  //   dtForStart.setDate(dtForStart.getDate() - RBChatConfig.CHATTING_HISTORY_LOAD_TIME_INTERVAL);
  //   startTime = formatDate(dtForStart, QUERY_DATE_PATTERN);
  //
  //   // 【计算聊天记录的结束时间查询条件】：如果当前缓存中已存在聊天消息数据，则取此时间作为加载的结束时间，
  //   // 这么做的原因，是防止当本地用户登陆后，已载离线聊天数据之后，首次点进聊天界面时，会重复加载历史，
  //   // 聊天记录的问题（因为之前加载的离线消息，早已进入了服务端的聊天记录中，本次如果不加这个查询截止
  //   // 时间，则数据当然就会被重复加载罗！）
  //   const firstChatMsgEntity = (isGroupChatting ? this.groupChattingCacheService.getChatCacheFirst(beyongDataId) :
  //     this.singleChattingCacheService.getChatCacheFirst(beyongDataId)); // 取出当天聊天缓存数据中的第一条消息对象
  //   if (firstChatMsgEntity) {
  //     const firstMsgTimestamp = firstChatMsgEntity.date; // 取出该条缓存消息的时间戳
  //     if (firstMsgTimestamp) {
  //       const dtForEnd = new Date();
  //       // 之所以将此时间主动减去1000毫秒，是因为服务端的SQL查询"BETWEEN AND"的右边界问题会导
  //       // 致该第一条消息还是会重，主动减1秒则下方formatDate(..)转时分秒格式后，就能保证不存在
  //       // 边界导致的查询重复（因为直接少了1秒啊）
  //       dtForEnd.setTime(firstMsgTimestamp - 1000);
  //       endTime = formatDate(dtForEnd, QUERY_DATE_PATTERN); // 将时间戳转了字符串日期格式（便于提前服务端接口使用）
  //     }
  //   }
  //
  //   this.restService.queryChattingHistoryFromServer(
  //     //111 新增
  //     isGroupChatting, beyongDataId, this.localUserService.getObj().userId, beyongDataId, "1",
  //     startTime, endTime
  //   ).subscribe(res => {
  //
  //     const dataList: [] = JSON.parse(res.returnValue);
  //
  //     dataList.forEach(row => {
  //       const srcUid = row[0];
  //       const destUid = row[1];
  //       const chat_type = row[2];
  //       const msg_type = row[3];
  //       const msgContent = row[4];
  //       const msgTime2Timestamp = row[5];
  //       const fingerPrint = row[6];
  //
  //       // true表示此行数据是群聊息，否则是单聊的
  //       const returnIsGroupChatting = (chat_type === ChatModeType.CHAT_TYPE_GROUP$CHAT);
  //       // true表示是“我”发出的消息，否则是“我”收到的消息（即对方发给“我”的）
  //       // var isOutgoing = (srcUid == IMSDK.getLoginInfo().loginUserId);
  //       //111 这是在加上登录web 标识后取值错误，换内存取
  //       const isOutgoing = (Number(srcUid) === Number(this.localUserService.getObj().userId));
  //
  //       // 消息发送者的uid
  //       const beyongUid = returnIsGroupChatting ? srcUid : (isOutgoing ? destUid :
  //         srcUid);
  //       // 群组id（只在群聊消息时才有意义）
  //       const gid = returnIsGroupChatting ? destUid : null;
  //
  //       //console.error('>>>>>> srcUid='+srcUid+', IMSDK.getLoginInfo().loginUserId='+IMSDK.getLoginInfo().loginUserId
  //       //    +", isOutgoing?"+isOutgoing+", beyongUid="+beyongUid);
  //
  //       //## Bug FIX: 检查该fingerPrint的消息是否已存在于缓存中，如存在则不需要添加，否则就重
  //       //##            复了，此为解决209170914日开会指出的存在聊天消息首次从历史加载时会重复的问题
  //       if (fingerPrint) {
  //         if (returnIsGroupChatting) {
  //           if (this.groupChattingCacheService.containsFingerPrintInChatCache(gid,
  //             fingerPrint)) {
  //             // RBChatUtils.logToConsole('[前端-GET-【接口1008-26-8】' + TAG +
  //             //   '群聊天记录获取接口返回值解析后] - 来自dataId=' + beyongDataId + '的fp=' +
  //             //   fingerPrint +
  //             //   '的消息已存在于缓存中，不需要重复添加，继续循环的下一轮【!!】！');
  //           }
  //         } else {
  //           if (this.singleChattingCacheService.containsFingerPrintInChatCache(beyongUid,
  //             fingerPrint)) {
  //             // RBChatUtils.logToConsole('[前端-GET-【接口1008-26-8】' + TAG +
  //             //   '单聊天记录获取接口返回值解析后] - 来自dataId=' + beyongDataId + '的fp=' +
  //             //   fingerPrint +
  //             //   '的消息已存在于缓存中，不需要重复添加，继续循环的下一轮【!!】！');
  //           }
  //         }
  //       }
  //       //## Bug FIX END
  //
  //       let chatMsgEntity: ChatmsgEntityModel;
  //       if (isOutgoing) {
  //         chatMsgEntity = this.messageEntityService.prepareSendedMessage(msgContent,
  //           msgTime2Timestamp ? msgTime2Timestamp : 0, fingerPrint, msg_type);
  //       } else {
  //         chatMsgEntity = this.messageEntityService.prepareRecievedMessage(beyongUid,
  //           beyongUid // TODO: 显示昵称？（从好友列表？从首页“消息”的item上取？
  //           , msgContent, msgTime2Timestamp ? msgTime2Timestamp : 0, msg_type);
  //       }
  //
  //       //111 这个是新增 为了存对方发消息的消息的指纹 下面是对方的昵称  增加了已读类型
  //       chatMsgEntity.fingerPrintOfProtocal = fingerPrint;
  //       chatMsgEntity.name = row[7];
  //       chatMsgEntity.xu_isRead_type = row[3];  //增加了已读类型
  //       // 放入数组
  //       if (chatMsgEntity.xu_isRead_type !== "57") {
  //         // chatHistoryDatas.push(chatMsgEntity);
  //         // console.dir(chatMsgEntity.uid);
  //         this.chatMsgEntityList.unshift(chatMsgEntity);
  //         // console.dir(chatMsgEntity);
  //       }
  //     });
  //
  //     // 消息容器滚动到底部
  //     this.scrollToBottom("auto");
  //   });
  // }

  // scrollToBottom(behavior: "auto" | "smooth" = "smooth") {
  //   setTimeout(() => {
  //     this.chattingContainer.nativeElement.lastElementChild?.scrollIntoView({
  //       behavior: behavior, block: "start"
  //     });
  //   }, 500);
  // }

  // contextMenuForMessage(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement, chat: ChatmsgEntityModel) {
  //   this.contextMenu = this.contextMenuService.getContextMenuForMessage(chat);
  //   menu.openMenu();
  //   span.style.position = "fixed";
  //   span.style.top = "0px";
  //   span.style.left = "0px";
  //   span.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
  //   return e.defaultPrevented;
  // }

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

  // createGroup() {
  //   this.showCreateGroup = true;
  //   return this.router.navigate(['/home/message/create-group']);
  // }
  //
  // searchFriend() {
  //   this.showSearchFriend = true;
  //   return this.router.navigate(['/home/message/search-friend']);
  // }

}
