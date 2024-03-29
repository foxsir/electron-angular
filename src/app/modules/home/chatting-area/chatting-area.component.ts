import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  Input, NgZone, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {AvatarService} from "@services/avatar/avatar.service";

import {formatDate} from "@app/libs/mobileimsdk-client-common";

import settingIcon from "@app/assets/icons/setting.svg";
import settingActiveIcon from "@app/assets/icons/setting-active.svg";
import searchIcon from "@app/assets/icons/search.svg";
import searchActiveIcon from "@app/assets/icons/search-active.svg";
import voiceIcon from "@app/assets/icons/voice.svg";
import voiceActiveIcon from "@app/assets/icons/voice-active.svg";
import closeCircleIcon from "@app/assets/icons/close-circle.svg";
import closeCircleActiveIcon from "@app/assets/icons/close-circle-active.svg";
import downArrowIcon from "@app/assets/icons/keyboard_arrow_down.svg";
import downArrowActiveIcon from "@app/assets/icons/keyboard_arrow_down-active.svg";

import gNoticeTip from "@app/assets/icons/gnotice-tip.svg";
import gNoticeDelete from "@app/assets/icons/gnotice-delete.svg";
import gTopContentTip from "@app/assets/icons/gtopcontent-tip.svg";
import gTopContentDelete from "@app/assets/icons/gtopcontent-delete.svg";

import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import {MatMenuTrigger} from "@angular/material/menu";
import {ContextMenuAvatarModel, ContextMenuModel} from "@app/models/context-menu.model";
import {ContextMenuService} from "@services/context-menu/context-menu.service";
import {ProtocalModel, ProtocalModelDataContent} from "@app/models/protocal.model";
import {MessageDistributeService} from "@services/message-distribute/message-distribute.service";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import {CacheService} from "@services/cache/cache.service";
import {ImService} from "@services/im/im.service";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {RestService} from "@services/rest/rest.service";
import {MatDrawer} from "@angular/material/sidenav";
import {ElementService} from "@services/element/element.service";
import { MatCheckbox } from "@angular/material/checkbox";
import {DialogService} from "@services/dialog/dialog.service";
import { TransmitMessageComponent } from "@modules/user-dialogs/transmit-message/transmit-message.component";
import { ChattingVoiceComponent } from '../chatting-voice/chatting-voice.component';
import FileMetaInterface from "@app/interfaces/file-meta.interface";
import {ChatModeType, MsgType} from "@app/config/rbchat-config";
import {HistoryMessageService} from "@services/history-message/history-message.service";
import {ServerForwardService} from "@services/server-forward/server-forward.service";
import {SoundService} from "@services/sound/sound.service";
import {MessageService} from "@services/message/message.service";
import CommonTools from "@app/common/common.tools";
import DirectoryType from "@services/file/config/DirectoryType";
import {GroupMemberModel} from "@app/models/group-member.model";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {GroupModel} from "@app/models/group.model";
import GroupTabModel from "@app/models/group-tab.model";
import AtMeModel from "@app/models/at-me.model";
import SilenceUserModel from "@app/models/silence-user.model";
import GroupInfoModel from "@app/models/group-info.model";
import {convertNodeSourceSpanToLoc} from "@angular-eslint/template-parser/dist/convert-source-span-to-loc";
import {Subscription} from "rxjs";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {GroupInfoDialogComponent} from "@modules/user-dialogs/group-info-dialog/group-info-dialog.component";
import {GroupNoticeComponent} from "@modules/user-dialogs/group-notice/group-notice.component";
import {InputAreaService} from "@services/input-area/input-area.service";
import ChattingModel from "@app/models/chatting.model";
import {VirtualScrollComponent} from "@app/factorys/virtual-scroll";
import SubscribeManage from "@app/common/subscribe-manage";

@Component({
  selector: 'app-chatting-area',
  templateUrl: './chatting-area.component.html',
  styleUrls: ['./chatting-area.component.scss'],
})
export class ChattingAreaComponent implements OnInit, AfterViewInit, AfterContentInit,OnDestroy {
  @ViewChild("chattingContainer") chattingContainer: ElementRef;
  @ViewChild('appChattingVoice') appChattingVoice: ChattingVoiceComponent;
  @ViewChild('chattingAreaDrawer') private chattingAreaDrawer: MatDrawer;
  @ViewChild('virtualScroll') virtualScroll: VirtualScrollComponent;

  public currentChat: AlarmItemInterface;

  public blacked: boolean = false;

  public formatDate = formatDate;

  public drawerContent = {
    setting: false,
    voice: false,
  };

  // icon
  public closeCircleIcon = this.dom.bypassSecurityTrustResourceUrl(closeCircleIcon);
  public closeCircleActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeCircleActiveIcon);
  public settingIcon = this.dom.bypassSecurityTrustResourceUrl(settingIcon);
  public settingActiveIcon = this.dom.bypassSecurityTrustResourceUrl(settingActiveIcon);
  public searchIcon = this.dom.bypassSecurityTrustResourceUrl(searchIcon);
  public searchActiveIcon = this.dom.bypassSecurityTrustResourceUrl(searchActiveIcon);
  public voiceIcon = this.dom.bypassSecurityTrustResourceUrl(voiceIcon);
  public voiceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(voiceActiveIcon);
  public downArrowIcon = this.dom.bypassSecurityTrustResourceUrl(downArrowIcon);
  public downArrowActiveIcon = this.dom.bypassSecurityTrustResourceUrl(downArrowActiveIcon);

  public gNoticeTip = this.dom.bypassSecurityTrustResourceUrl(gNoticeTip);
  public gNoticeDelete = this.dom.bypassSecurityTrustResourceUrl(gNoticeDelete);
  public gTopContentTip = this.dom.bypassSecurityTrustResourceUrl(gTopContentTip);
  public gTopContentDelete = this.dom.bypassSecurityTrustResourceUrl(gTopContentDelete);
  // end icon

  public currentChatSubtitle: string = null;
  public currentChatStat:boolean = false;

  public localUserInfo: LocalUserinfoModel;

  public friendOnLineStat: boolean = false;

  // 是否正在搜索
  public searching = false;

  //  显示group tabs
  public showGroupTabs = false;

  // 引用回复消息
  public quoteMessage: ChatmsgEntityModel = null;
  public quoteMessageText: {
    text: string;
    file?: Partial<FileMetaInterface>;
    type: string;
  } = null;

  // 右键菜单
  public contextMenu: ContextMenuModel[] = [];
  public contextMenuAvatar: ContextMenuAvatarModel[] = [];

  // 选择消息
  public selectMessage: boolean = false;
  public selectMessageList: ChatmsgEntityModel[] = [];
  public selectCheckboxList: MatCheckbox[] = [];

  public showDownArrow: boolean = false;
  public loadingMessage: boolean = false;

  public groupMembers: Map<string, GroupMemberModel> = new Map();

  // 需要显示的tab链接
  public tabLink: string;
  public group_tab_data: {visible: boolean; list: GroupTabModel[]} = {
    visible: false,
    list: []
  };
  public groupData = {
    gnotice: '',
    gtopContent: '',
    gnotice_visible: true,
    gtopContent_visible: true,
    gnotice_class: '',
    gtopContent_class: '',
    gtalkIntervalSwitch: false,
    gtalkInterval: 3,
    gmemberCount:0,
  };

  // @我的消息
  public atMsg: AtMeModel;

  public mySilence: SilenceUserModel;

  public isAdmin: boolean = false;
  public isOwner: boolean = false;

  //发言时间间隔
  public talkIntervalSwitch: boolean = false;
  // public talkInterval: number = 0;
  public talkIntervalMap: Map<string, number> = new Map();
  public timeInterval = null;

  // 是否已经监听过聊天区域滚动
  private listenChattingAreaOnScroll = false;

  constructor(
    public cacheService: CacheService, // 模版中要用
    private avatarService: AvatarService,
    private dom: DomSanitizer,
    private localUserService: LocalUserService,
    private contextMenuService: ContextMenuService,
    private quoteMessageService: QuoteMessageService,
    private messageDistributeService: MessageDistributeService,
    private messageEntityService: MessageEntityService,
    private imService: ImService,
    private restService: RestService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private elementService: ElementService,
    private dialogService: DialogService,
    private historyMessageService: HistoryMessageService,
    private serverForwardService: ServerForwardService,
    private messageService: MessageService,
    private snackBarService: SnackBarService,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private inputAreaService: InputAreaService,
  ) {
    this.localUserInfo = this.localUserService.localUserInfo;

    this.subscribeMessagesBeReceived();
    this.subscribeOfGroupChatMsgToServer();
    this.subscribeOfGroupChatMsgServerToB();
    this.subscribeChattingMessage();
    this.subscribeGroupSilence();

    // 订阅踢人时删除消息的通知
    this.subscribeDeleteGroupMessage();
    // 订阅删除单聊消息的通知
    this.subscribeDeleteFriendMessage();

    // 选择消息
    SubscribeManage.run(this.elementService.selectMessage$,(directive) => {
      this.selectMessage = directive;
    });

    // 获取拉黑我的人列表
    SubscribeManage.run(this.cacheService.cacheUpdate$, cache => {
      if(cache && cache.blackMeListMap && this.currentChat) {
        this.blacked = false;
        console.log("拉黑我的人:",cache.blackMeListMap);
        cache.blackMeListMap.forEach(item => {
          if (item.userUid.toString() === this.currentChat.alarmItem.dataId) {
            this.blacked = true;
            this.snackBarService.openMessage("你已被对方拉入黑名单");
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.subscribeQuote();

    // 清屏
    SubscribeManage.run(this.cacheService.cacheUpdate$, cache => {
      if(this.currentChat && cache.alarmDataMap) {
        const data = cache.alarmDataMap.get(this.currentChat.alarmItem.dataId);
        if(data && data.message && data.message.size === 0) {
          this.cacheService.chatMsgEntityMap.clear();
          this.cacheService.chatMsgEntityList = [];
        } else {
          // this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
        }

        // 先清空
        this.groupData = {
          gnotice: '',
          gtopContent: '',
          gnotice_visible: true,
          gtopContent_visible: true,
          gnotice_class: '',
          gtopContent_class: '',
          gtalkIntervalSwitch: false,
          gtalkInterval: 3,
          gmemberCount:0
        };

        if (this.currentChat.alarmItem.chatType === 'group') {
          this.loadGroupData();
        }
        if(this.currentChat.alarmItem.chatType === 'friend'){
          this.getFriendOnlineStat();
          SubscribeManage.run(this.cacheService.cacheUpdate$, (cache) => {
            if(cache.friendMap) {
              this.getFriendOnlineStat();
            }
          });
        }
      }

      if(cache.atMe) {
        this.showAtSheet();
      }
    });

    SubscribeManage.run(this.cacheService.groupSilence$, (map) => {
      this.mySilence = map.get(this.localUserService.localUserInfo.userId.toString());
      if(this.mySilence && this.mySilence.banTime) {
        this.inputAreaService.disableToTime(this.mySilence.banTime);
      } else {
        this.inputAreaService.enable();
      }
    });
  }

  ngAfterViewInit() {
  }

  ngAfterContentInit() {
    if(this.currentChattingChangeService.currentChatting) {
      this.currentChat = this.currentChattingChangeService.currentChatting;
      this.showAtSheet();
      this.loadTabData();
      this.getSilenceUsers();
      this.getGroupMembers();

      this.cacheService.getChattingCache(this.currentChat).then(data => {
        if(!!data) {
          this.cacheService.chatMsgEntityMapTemp = data;
          this.loadMessage(true);
        }
      });
    }

    // 获取缓存
    SubscribeManage.run(this.currentChattingChangeService.currentChatting$, currentChat => {
      this.searching = false;
      this.blacked = false;
      // === 为刷新聊天列表，只更新数据
      if (currentChat && this.currentChat !== currentChat) {
        this.currentChat = currentChat;
        this.loadTabData();
        this.showAtSheet();
        this.getSilenceUsers();
        this.getGroupMembers();
        this.scrollToBottom();
        this.checkBlackStatus();
        // 切换会话清空列表
        this.cacheService.chatMsgEntityMapTemp.clear();
        this.cacheService.chatMsgEntityMap.clear();
        this.openEndDrawer('setting', false);
        this.cacheService.getChattingCache(this.currentChat).then(data => {
          if(!!data) {
            this.cacheService.chatMsgEntityMapTemp = data;
            this.loadingMessage = false;
            this.loadMessage(true);
          }
        });
      } else {
        this.currentChat = currentChat;
      }
    });

  }

  /**
   * 获取群成员
   */
  getGroupMembers() {
    if(this.currentChat.metadata.chatType === 'group') {
      this.cacheService.getGroupMembers(this.currentChat.alarmItem.dataId).then(ms => {
        this.groupMembers = ms;
      });
    }
  }

  /** 单聊获取对方在线状态 **/
  getFriendOnlineStat(){
    this.cacheService.getCacheFriends().then(cache => {
      const f = cache.get(this.currentChat.alarmItem.dataId);
      if(f){
        this.friendOnLineStat = f.onlineStatus;
      }else{
        this.friendOnLineStat = false;
      }
      console.dir(this.friendOnLineStat)
      this.restService.getUserBaseById(this.currentChat.alarmItem.dataId).subscribe(res => {
        this.currentChatStat = this.friendOnLineStat?true:false;
        if (res.data !== null) {
          this.currentChatSubtitle = [res.data.latestLoginAddres, res.data.latestLoginIp].join(": ");
        } else {
          this.currentChatSubtitle = null;
        }
      });
    });
  }

  /**
   * 检查好友的拉黑状态
   */
  checkBlackStatus() {
    this.cacheService.getBlackMeListCache().then(cache=>{
      let isBlack = false;
      if(cache && this.currentChat && this.currentChat.metadata.chatType === 'friend') {
        console.log("拉黑我的好友:",cache);
        cache.forEach(item => {
          if (item.userUid.toString() == this.currentChat.alarmItem.dataId) {
            isBlack = true;
          }
        });
      };
      if(isBlack) {
        this.snackBarService.openMessage("您已经被对方拉入黑名单");
      }
      this.blacked = isBlack;
    });
  }


  /**
   * keep keyvalue order
   * @param a
   * @param b
   */
  asIsOrder(a, b) {
    return 1;
  }

  pushMessageToPanel(data: {chat: ChatmsgEntityModel; dataContent: ProtocalModelDataContent}, type: 'send' | 'incept' = 'send') {
    const isSide = this.currentChat.alarmItem.dataId.toString() === data.dataContent.f.toString();
    const isSelf = this.currentChat.alarmItem.dataId.toString() === data.dataContent.t.toString();
    const chatActive: boolean = isSelf || isSide;
    // this.messageService.alreadyRead(this.currentChat.alarmItem.dataId, this.currentChat.metadata.chatType);
    if(!data.dataContent) {
      if(this.cacheService.chatMsgEntityMap.size > 0) {
        this.cacheService.putMsgEntityMap(data.chat);
        // this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
        // this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
        this.scrollToBottom();
      }
    } else {
      if(data.dataContent.cy === ChatModeType.CHAT_TYPE_FRIEND$CHAT) { // 单聊
        if(this.currentChat && chatActive) {
          // this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
          // this.cacheService.chatMsgEntityList.push(data.chat); // = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
          this.cacheService.putMsgEntityMap(data.chat);
          this.scrollToBottom();
        }
      } else if(data.dataContent.cy === ChatModeType.CHAT_TYPE_GUEST$CHAT) { // 临时聊天/陌生人聊天
        if(this.currentChat && chatActive) {
          // this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
          // this.cacheService.chatMsgEntityList.push(data.chat); // = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
          this.cacheService.putMsgEntityMap(data.chat);
          this.scrollToBottom();
        }
      } else if(data.dataContent.cy === ChatModeType.CHAT_TYPE_GROUP$CHAT) { // 是群
        if(this.currentChat && this.currentChat.alarmItem.dataId.toString() === data.dataContent.t.toString()) {
          // this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
          // this.cacheService.chatMsgEntityList.push(data.chat); // = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
          this.cacheService.putMsgEntityMap(data.chat);
          this.scrollToBottom();
        }
        if(this.groupData.gtalkInterval === 1){
          this.setTalkInterval(Number(data.chat.uid));
        }
      }
    }
  }

  setTalkInterval(chatUid = 0) {
    // 重置发言间隔时间
    clearInterval(this.timeInterval);
    this.inputAreaService.enable();
    if(this.groupData.gtalkIntervalSwitch && this.currentChat.metadata.chatType === 'group')
    {
      this.checkAdminAndOwner();
      // 只有是自己发消息时才设置发言间隔
      let duration = this.talkIntervalMap.get(this.currentChat.alarmItem.dataId) || 0;
      if(!this.isOwner && !this.isAdmin && chatUid.toString() === this.localUserInfo.userId.toString() || chatUid === 0){

        this.talkIntervalSwitch=this.groupData.gtalkIntervalSwitch;
        if (duration > 0) {
          this.inputAreaService.disableToTime(CommonTools.getTime() + duration);
        } else if(chatUid !== 0) {
          this.inputAreaService.disableToTime(CommonTools.getTime() + this.groupData.gtalkInterval);
          this.talkIntervalMap.set(this.currentChat.alarmItem.dataId, this.groupData.gtalkInterval);
          duration = this.groupData.gtalkInterval;
        }

        console.dir('setTalkInterval');

        this.timeInterval=setInterval(() => {
          console.log(this.talkIntervalMap);
          if(duration <= 0){
            this.zone.run(() => {
              this.talkIntervalSwitch=false;
              this.changeDetectorRef.detectChanges();
            });
            clearInterval(this.timeInterval);
          }
          else{
            this.zone.run(() => {
              duration = duration - 1;
              this.talkIntervalMap.set(this.currentChat.alarmItem.dataId, duration);
              this.changeDetectorRef.detectChanges();
            });
          }
        },1000);
      }
    }
  }

  private subscribeQuote() {
    SubscribeManage.run(this.quoteMessageService.message$, (msg) => {
      // msg 不能为空
      this.quoteMessage = msg;
      if(msg) {
        // 文本，图片，视频，语音
        // if(this.quoteMessage.msgType === MsgType.TYPE_TEXT) {
        //   this.quoteMessageText = this.quoteMessage.text;
        // }
        switch (this.quoteMessage.msgType) {
          case MsgType.TYPE_TEXT:
            this.quoteMessageText = {text: this.quoteMessage.text, type: 'text'};
            break;
          case MsgType.TYPE_IMAGE:
            this.quoteMessageText = {
              text: '图片',
              file: {
                ossFilePath: this.quoteMessage.text
              },
              type: 'image'
            };
            break;
          case MsgType.TYPE_SHORTVIDEO:
            console.dir(this.quoteMessage.text);
            this.quoteMessageText = {
              text: '视频',
              file: JSON.parse(this.quoteMessage.text),
              type: 'video'
            };
            break;
          case MsgType.TYPE_VOICE:
            console.dir(this.quoteMessage.text);
            this.quoteMessageText = {text: '语音', type: 'voice'};
            break;
          case MsgType.TYPE_CONTACT:
            console.dir(this.quoteMessage.text);
            this.quoteMessageText = {text: '名片', type: 'contact'};
            break;
        }
      } else {
        this.quoteMessageText = null;
      }
    });
  }

  clearSubscribeQuote() {
    this.quoteMessageService.setQuoteMessage(null);
  }

  /**
   * 普通一对一聊天消息的报文头（聊天消息可能是：文本、图片、语音留言、礼物等）
   * @private
   */
  private subscribeChattingMessage() {
    SubscribeManage.run(this.messageDistributeService.MT03_OF_CHATTING_MESSAGE$, (res: ProtocalModel) => {
      const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
      const func = this.serverForwardService.functions[dataContent.ty];
      if(func) {
        func(res);
      } else if (dataContent.ty == 120) {
        // if (dataContent.m == "start_voice") {
        //   this.openEndDrawer('voice', true);
        //   this.appChattingVoice.openPanel('','');
        // }
        // else if (dataContent.m == "receive_voice") {
        //   this.appChattingVoice.hadReceiveVoice();
        // }
      } else {
        const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
          res.from, dataContent.nickName, dataContent.m, (new Date()).getTime(), dataContent.ty, res.fp
        );
        chatMsgEntity.uh = dataContent.uh;
        // fromUid, nickName, msg, time, msgType, fp = null
        const chatType = Number(dataContent.cy) === ChatModeType.CHAT_TYPE_FRIEND$CHAT ? 'friend' : 'group';
        let dataId = chatType === 'friend' ? res.from : dataContent.f;

        // 如果消息来自自己，则为不同终端同步消息
        if(dataId.toString() === this.localUserService.localUserInfo.userId.toString()) {
          dataId = res.to;
        }

        this.cacheService.generateAlarmItem(dataId.toString(), chatType, dataContent.m, dataContent.ty).then(alarm => {
          chatMsgEntity.xu_isRead_type = true;
          chatMsgEntity.isOutgoing = true;
          this.cacheService.putChattingCache(alarm, chatMsgEntity, true).then(() => {
            if(this.currentChat && this.currentChat.alarmItem.dataId === alarm.alarmItem.dataId) {
              this.pushMessageToPanel({chat: chatMsgEntity, dataContent: dataContent}, 'incept');
            }
            if(this.localUserService.localUserInfo.userId.toString() !== dataContent.f.toString()) {
              this.cacheService.setChattingBadges(alarm, 1);
            }
          });
        });
      }

      // 禁用掉语音通话
      // if (res.type == 2) {
      //   if (res.typeu == 3 && dataContent.ty == 21) {
      //     this.appChattingVoice.endVoiceCallback();
      //   }
      // }
    });

    SubscribeManage.run(this.messageDistributeService.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A$, res => {
      const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
      console.log('订阅单聊消息：（17）', res, dataContent, this.currentChat);

      if (res.type == 2 && res.typeu == 17) {
        if (this.currentChat == undefined || parseInt(res.from) != parseInt(this.currentChat.alarmItem.dataId)) {
          this.cacheService.generateAlarmItem(res.from, 'friend', null, MsgType.TYPE_VOICE_CALL).then(alarm => {
            // this.cacheService.putChattingCache(alarm).then(() => {
            //   // 禁用掉语音通话
            //   this.currentChattingChangeService.switchCurrentChatting(alarm).then(() => {
            //       console.log("聊天会话切换完成...");
            //       this.openEndDrawer('voice', true);
            //       this.appChattingVoice.openPanel(res, dataContent);
            //   });
            // });
          });
        }
        else {
          // 禁用掉语音通话
          // this.openEndDrawer('voice', true);
          // this.appChattingVoice.openPanel(res, dataContent);
        }
      }
    });
  }

  /**
   * 群聊/世界频道聊天消息：由发送人A发给服务端
   * @private
   */
  private subscribeOfGroupChatMsgToServer() {
    SubscribeManage.run(this.messageDistributeService.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER$, (res: ProtocalModel) => {
      const dataContent: any = JSON.parse(res.dataContent);

      console.log('订阅群聊消息 ToServer：', dataContent);

      const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
        res.from, dataContent.nickName, dataContent.m, (new Date()).getTime(), dataContent.ty, res.fp
      );
      chatMsgEntity.uh = dataContent.uh;
    });
  }

  /**
   * 由服务端转发
   * @private
   */
  private subscribeOfGroupChatMsgServerToB() {
    SubscribeManage.run(this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$, (res: ProtocalModel) => {
      let dataContentList: ProtocalModelDataContent[] | ProtocalModelDataContent = JSON.parse(res.dataContent);
      if(dataContentList.hasOwnProperty("length")) {
        dataContentList = dataContentList as ProtocalModelDataContent[];
      } else {
        dataContentList = [dataContentList as ProtocalModelDataContent];
      }
      dataContentList.forEach(dataContent => {
        const func = this.serverForwardService.functions[dataContent.ty];
        if(func) {
          func(res);
        } else {
          const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
            dataContent.f, dataContent.nickName, dataContent.m, res.recvTime, dataContent.ty, res.fp
          );
          // 设置 发消息的用户id
          chatMsgEntity.memberId = Number(dataContent.f);

          chatMsgEntity.uh = dataContent.uh;
          const chatType = Number(dataContent.cy) === ChatModeType.CHAT_TYPE_FRIEND$CHAT ? 'friend' : 'group';
          const dataId = chatType === 'friend' ? res.to : dataContent.t;
          this.saveAtMsg(dataContent.ty, dataId, chatMsgEntity);
          this.cacheService.generateAlarmItem(dataId, chatType, dataContent.m, dataContent.ty).then(alarm => {
            chatMsgEntity.xu_isRead_type = true;
            chatMsgEntity.isOutgoing = true;
            this.cacheService.putChattingCache(alarm, chatMsgEntity).then(() => {
              if(this.currentChat && this.currentChat.alarmItem.dataId === alarm.alarmItem.dataId) {
                this.pushMessageToPanel({chat: chatMsgEntity, dataContent: dataContent}, 'incept');
              }
              if(this.localUserService.localUserInfo.userId.toString() !== dataContent.f.toString()) {
                this.cacheService.setChattingBadges(alarm, 1);
              }
            });
          });
        }
      });
    });
  }

  /**
   * 收到QoS回执，修改isOutgoing并保存到database
   * @param fingerPrint
   */
  updateDataForUI(fingerPrint: string) {
    const chat = this.cacheService.chatMsgEntityMap.get(fingerPrint);
    if(chat) {
      chat.isOutgoing = true;
      // this.cacheService.chatMsgEntityMap.set(fingerPrint, chat);
      this.cacheService.putMsgEntityMap(chat);
      const data = {model: 'chatmsgEntity', data: {isOutgoing: true}, update: {fingerPrintOfProtocal: fingerPrint}};
      return this.cacheService.saveData<ChatmsgEntityModel>(data);
    }
  }

  /**
   * 消息已被对方收到的回调事件通知
   * @private
   */
  private subscribeMessagesBeReceived() {
    this.imService.callback_messagesBeReceived = this.updateDataForUI.bind(this);
  }

  /**
   * 消息列表滚动底部
   * @param behavior
   */
  scrollToBottom(behavior: "auto" | "smooth" = "auto") {
    if(this.virtualScroll) {
      if(this.listenChattingAreaOnScroll === false) {
        this.chattingAreaOnScroll();
        this.listenChattingAreaOnScroll = true;
      }
      setTimeout(() => {
        this.virtualScroll.scrollToBottom(behavior);
      }, 10);
    }
  }

  /**
   * 消息右键
   * @param e
   * @param menu
   * @param span
   * @param chat
   */
  async contextMenuForMessage(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement, chat: ChatmsgEntityModel) {
    this.contextMenu = await this.contextMenuService.getContextMenuForMessage(chat);
    if(this.contextMenu.length > 0) {
      menu.openMenu();
      span.style.position = "absolute";
      span.style.top = "0px";
      span.style.left = "0px";
      span.style.transform = `translate3d(${e.offsetX}px, ${e.offsetY}px, 0px)`;
      return e.defaultPrevented;
    }
  }

  /**
   * 头像右键
   * @param e
   * @param menu
   * @param span
   * @param chat
   */
  async contextMenuForAvatar(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement, chat: ChatmsgEntityModel) {
    this.contextMenuAvatar = await this.contextMenuService.getContextMenuForAvatar(this.currentChat, chat);
    if(this.contextMenuAvatar.length > 0) {
      menu.openMenu();
      span.style.position = "absolute";
      span.style.top = "0px";
      span.style.left = "0px";
      span.style.transform = `translate3d(${e.offsetX}px, ${e.offsetY}px, 0px)`;
      return e.defaultPrevented;
    }
  }

  /**
   * 收集选择的消息
   * @param chat
   * @param msgCheckbox
   */
  collectMessage(chat: ChatmsgEntityModel, msgCheckbox: MatCheckbox) {
    msgCheckbox.checked = !msgCheckbox.checked;

    if(msgCheckbox.checked) {
      this.selectMessageList.push(chat);
      this.selectCheckboxList.push(msgCheckbox);
    } else {
      const index = this.selectMessageList.indexOf(chat);
      delete this.selectMessageList[index];
      delete this.selectCheckboxList[index];
      this.selectMessageList = this.selectMessageList.filter(v => v);
      this.selectCheckboxList = this.selectCheckboxList.filter(v => v);
    }

    return false;
  }

  /**
   * 取消所选
   */
  cancelSelectMessage() {
    this.selectMessage = false;
    this.selectCheckboxList.forEach(item => {
      item.checked = false;
    })
    this.selectMessageList = [];
  }

  /**
   * 转发所选
   */
  transmitSelectMessage() {
    if(this.selectMessageList.length > 0) {
      this.dialogService.openDialog(TransmitMessageComponent, {data: this.selectMessageList, width: '314px',panelClass: "padding-less-dialog"}).then((ok) => {
        if(ok) {
          this.cancelSelectMessage();
        }
      });
    }
  }

  /**
   * 删除所选
   */
  deleteSelectMessage() {
    this.dialogService.confirm({
      title: ["删除", this.selectMessageList.length, "条消息"].join("")
    }).then(ok => {
      if(ok) {
        this.cacheService.deleteMessageCache(this.currentChattingChangeService.currentChatting, this.selectMessageList).then(res => {
          // 刷新聊天数据
          this.selectMessageList.forEach(chat => {
            this.cacheService.chatMsgEntityMap.delete(chat.fingerPrintOfProtocal);
          });
          this.cancelSelectMessage();
        });
      }
    });
  }

  openEndDrawer(target: string, open: boolean) {
    for (const key in this.drawerContent) {
      if(this.drawerContent.hasOwnProperty(key)) {
        this.drawerContent[key] = key === target;
      }
    }
    if(open) {
      this.chattingAreaDrawer.open().then();
    } else {
      this.chattingAreaDrawer.close().then();
    }
  }

  /**
   * 监听聊天区域滚动
   */
  chattingAreaOnScroll() {
    this.virtualScroll.subscribeToTop(() => {
      this.loadMessage();
    });
    this.virtualScroll.scrolledChange(() => {
      this.showDownArrow = this.virtualScroll.offsetBottom > 300;
    });
  }

  /**
   * 从缓存或者漫游接口获取消息
   * @param goBottom
   * @param lastMessage
   * @private
   */
  private loadMessage(goBottom: boolean = false) {
    const loadNumber = 30;
    if(this.loadingMessage) {
      return false;
    } {
      this.loadingMessage = true;
      if(this.cacheService.chatMsgEntityMapTemp.size > 0) {
        // 从缓存获取消息
        this.loadingMessage = false;
        const last = new Array(...this.cacheService.chatMsgEntityMapTemp.entries()).reverse().splice(0, loadNumber);
        const appendAfter = new Map();
        last.reverse().forEach(keyvalue => {
          this.cacheService.chatMsgEntityMapTemp.delete(keyvalue[0]);
          appendAfter.set(keyvalue[0], keyvalue[1]);
        });
        this.cacheService.chatMsgEntityMap = new Map([...appendAfter, ...this.cacheService.chatMsgEntityMap]);
        this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);

        if(last.length > 0 && this.virtualScroll) {
          this.virtualScroll.scrollToBottom('auto');
        }

        if(goBottom) {
          this.scrollToBottom("auto");
        }
        console.dir("拉取缓存消息");
        console.dir(this.cacheService.chatMsgEntityMap.size);
      } else if(this.cacheService.chatMsgEntityMap.size > 0) {
        // 从漫游接口获取数据
        const list: ChatmsgEntityModel[] = new Array(...this.cacheService.chatMsgEntityMap.values());
        const localLastMsg: ChatmsgEntityModel[] = list.slice(0, 1);
        const localFirstMsgFP = localLastMsg[0].fingerPrintOfProtocal;

        this.historyMessageService.getFriendMessage(
          this.currentChat, {start: localFirstMsgFP}, 0, 'top', loadNumber
        ).subscribe(res => {
          if(res.status === 200 && res.data.list.length) {
            const msgMap: Map<string, ChatmsgEntityModel> = new Map();
            res.data.list.forEach(msg => {
              const msgJson = JSON.parse(msg);
              const dataContent = JSON.parse(msgJson.dataContent);
              const chatMsgEntity = this.messageEntityService.prepareSendedMessage(
                dataContent.m, msgJson.recvTime, msgJson.fp, dataContent.ty
              );
              chatMsgEntity.isOutgoing = true;
              chatMsgEntity.xu_isRead_type = true;
              // 排除 start 消息
              if(localFirstMsgFP !== chatMsgEntity.fingerPrintOfProtocal) {
                msgMap.set(chatMsgEntity.fingerPrintOfProtocal, chatMsgEntity);
              }
            });
            this.loadingMessage = false;
            this.cacheService.chatMsgEntityMap = new Map([...msgMap, ...this.cacheService.chatMsgEntityMap]);
            this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
            if(goBottom) {
              this.scrollToBottom("auto");
            }
            // 将拉去到的消息放入缓存
            const msgList: ChatmsgEntityModel[] = [];
            msgMap.forEach(item => {
              msgList.push(item);
            });
            this.cacheService.putChattingCache(this.currentChat, msgList).then(() => {
              console.dir("将拉去到的消息放入缓存");
            });
          } else {
            this.loadingMessage = false;
          }
          console.dir("拉取漫游消息");
        });
      } else {
        this.loadingMessage = false;
      }
    }
  }

  saveAtMsg(ty: number, dataId: string, chatMsgEntity: ChatmsgEntityModel) {
    //如果发送者与接收者相同，对本人不做@标记
    if(chatMsgEntity.memberId.toString() === this.localUserInfo.userId.toString()) return;
    if(ty === MsgType.TYPE_AITE) {
      this.cacheService.putAtMessage(dataId, chatMsgEntity);
    }
  }

  /*获取群页签列表*/
  loadTabData() {
    console.log('显示消息组件数据打印：', this.currentChat);

    this.group_tab_data = {
      visible: false,
      list: []
    };

    this.restService.getUserGroupTab(this.currentChat.alarmItem.dataId).subscribe(
      (tab_data: NewHttpResponseInterface<GroupTabModel[]>
      ) => {
        this.group_tab_data = {
          visible: true,
          list: []
        };
        tab_data.data.forEach(d => {
          if(d.status === 1){
            this.group_tab_data.list.push(d);
          }
        });
      });

  }

  loadGroupData(){
    this.restService.getGroupBaseById(this.currentChat.alarmItem.dataId).subscribe((group_data: NewHttpResponseInterface<GroupModel>) => {
      if (group_data.status === 200 && group_data.data && group_data.data.tabSwitch === 1) {
        this.loadTabData();
      }else{
        this.group_tab_data = {
          visible: true,
          list: []
        };
      }

      this.groupData.gnotice = "";
      if(group_data.status === 200 && group_data.data) {
        this.groupData.gnotice = group_data.data.gnotice == null ? '' : group_data.data.gnotice;
        this.groupData.gtopContent = group_data.data.gtopContent == null ? '' : group_data.data.gtopContent;
        this.groupData.gtopContent_visible = group_data.data.topContentSwitch===1?true:false;
        this.groupData.gmemberCount=group_data.data.gmemberCount;
        this.currentChatSubtitle = "人数："+ this.groupData.gmemberCount.toString()+"人"
      }
      this.groupData.gnotice_visible = true;


      let gnotice_length = this.groupData.gnotice.length;
      let gtopContent_length = this.groupData.gtopContent.length;
      this.groupData.gnotice_class = 'animate-' + parseInt(((gnotice_length >= 150 ? 150 : gnotice_length) / 50).toString());
      this.groupData.gtopContent_class = 'animate-' + parseInt(((gtopContent_length >= 150 ? 150 : gtopContent_length) / 50).toString());

      this.groupData.gtalkIntervalSwitch=group_data.data.talkIntervalSwitch===1?true:false;
      this.groupData.gtalkInterval=group_data.data.talkInterval;
      //this.setTalkInterval();
    });
  }
  /**
   * 临时缓存禁言Map
   */
  getSilenceUsers() {
    if (this.currentChat && this.currentChat.metadata.chatType === 'group') {
      this.restService.getGroupBaseById(this.currentChat.alarmItem.dataId).subscribe((res: NewHttpResponseInterface<GroupModel>) => {
        if(res.status === 200) {
          this.currentChat.metadata.allSilence = res.data.gmute === 1;
          this.checkAdminAndOwner();
        }
      });
      this.cacheService.cacheGroupSilence(this.currentChat.alarmItem.dataId).then();
    }
  }

  /**
   * 显示at提示
   */
  showAtSheet() {
    if(this.currentChat && this.currentChat.metadata.chatType === 'group' ) {
      this.cacheService.getAtMessage(this.currentChat.alarmItem.dataId).then((at) => {
        if(at.length > 0) {
          this.atMsg = at[0];
        } else {
          this.atMsg = null;
        }
      });
    } else {
      this.atMsg = null;
    }
  }

  /**
   * 定位到@，并清除@消息
   */
  gotoAt() {
    if(this.cacheService.chatMsgEntityMap.get(this.atMsg.fingerPrintOfProtocal)) {
      let index = -1;
      this.cacheService.chatMsgEntityList.forEach(msg => {
        index += 1;
        if(msg.fingerPrintOfProtocal === this.atMsg.fingerPrintOfProtocal) {
          this.virtualScroll.scrollToItemForID(msg.fingerPrintOfProtocal);
          this.cacheService.clearAt(this.currentChat.alarmItem.dataId);
          this.atMsg = null;
        }
      });
    } else {
      this.loadMessage(false);
      this.gotoAt();
    }
  }

  /**
   * 订阅服务端发来的禁言消息
   */
  subscribeGroupSilence() {
    SubscribeManage.run(this.messageDistributeService.GROUP_SILENCE$, () => {
      if(this.currentChat) {
        this.cacheService.cacheGroupSilence(this.currentChat.alarmItem.dataId).then();
      }
    });
    SubscribeManage.run(this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$, (res) => {
      const dataContent: ProtocalModelDataContent[] = JSON.parse(res.dataContent);
      if(dataContent.length) {
        const data = dataContent[0];
        if(data.ty === MsgType.TYPE_NOTALK) {
          const msg = JSON.parse(data.m);
          this.cacheService.generateAlarmItem(data.t, 'group').then(alarm => {
            alarm.metadata.allSilence = msg.isBanned;
            // 判断禁言的是否时当前会话
            if(this.currentChat && this.currentChat.alarmItem.dataId === data.t.toString()) {
              this.checkAdminAndOwner();
              this.currentChat.metadata.allSilence = msg.isBanned; // 修改当前会话
            }
            this.cacheService.putChattingCache(alarm).then(() => {
              console.log("save group allSilence", msg.isBanned);
            });
          });
        }
      }
    });
  }

  /**
   * 结束禁言倒计时
   * @param event
   */
  silenceDone(event: boolean) {
    this.mySilence = null;
    this.cacheService.cacheGroupSilence(this.currentChat.alarmItem.dataId).then();
  }

  checkAdminAndOwner() {
    if(this.currentChat) {
      const info = this.localUserService.localUserInfo;
      this.cacheService.getCacheGroupAdmins(this.currentChat.alarmItem.dataId).then(admins => {
        if(admins.get(info.userId.toString())) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      });

      this.cacheService.getCacheGroups().then(groups => {
        const group = groups.get(this.currentChat.alarmItem.dataId);
        if(group) {
          this.isOwner = group.gownerUserUid.toString() === info.userId.toString();
        } else {
          this.isOwner = false;
        }
      });
    }
  }
  ngOnDestroy() {
  }

  /* 弹窗群消息和群上屏     */
  showTopWIn(choose_type) {
    var data;
    if (choose_type === 'notice') {
      data={
        title:'群组公告',
        txt:this.groupData.gnotice,
      }
    }
    else if (choose_type === 'topContent') {
      data={
        title:'群组上屏消息',
        txt:this.groupData.gtopContent,
      }
    }
    this.dialogService.openDialog(GroupNoticeComponent, { data: data,width: '314px',panelClass: "padding-less-dialog" }).then();
  }

  /**
   * 订阅踢人时,让其他群成员删除消息的指令
   * @private
   */
  private subscribeDeleteGroupMessage() {
    SubscribeManage.run(this.messageDistributeService.DELETE_FRIEND_FOR_TIRENSource$,(res: ProtocalModel) => {
      const dataContent: any = JSON.parse(res.dataContent);
      const groupId: string = dataContent.groupId;
      const memberIdList:number[] = dataContent.userIds;
      if(memberIdList.length == 0) {
        return;
      }
      this.cacheService.deleteGroupChattingCache(groupId, memberIdList);
    });
  }

  /**
   * 订阅删除单聊消息的通知
   * @private
   */
  private subscribeDeleteFriendMessage() {
    SubscribeManage.run(this.messageDistributeService.DELETE_CHAT_MESSAGESource$,(res: ProtocalModel) => {
      const dataContent: any = JSON.parse(res.dataContent);
      const dataId: string = dataContent.uuid;
      const chatType: string = dataContent.chatType;
      const msgIdList:string[] = dataContent.msgIdList;
      if(msgIdList.length == 0) {
        return;
      }
      this.cacheService.deleteMessageCacheByFP(dataId, msgIdList);
    });
  }
}
