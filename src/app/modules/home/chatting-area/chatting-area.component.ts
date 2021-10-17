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
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
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

@Component({
  selector: 'app-chatting-area',
  templateUrl: './chatting-area.component.html',
  styleUrls: ['./chatting-area.component.scss'],
})
export class ChattingAreaComponent implements OnInit, AfterViewInit, AfterContentInit,OnDestroy {
  @ViewChild("chattingContainer") chattingContainer: ElementRef;
  @ViewChild('appChattingVoice') appChattingVoice: ChattingVoiceComponent;
  @ViewChild('chattingAreaDrawer') private chattingAreaDrawer: MatDrawer;
  @ViewChild('virtualScrollViewport') virtualScrollViewport: CdkVirtualScrollViewport;

  public currentChat: AlarmItemInterface;

  public blacked:boolean = false;

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

  public localUserInfo: LocalUserinfoModel;

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
    };

  // @我的消息
  public atMsg: AtMeModel;

  public mySilence: SilenceUserModel;

  public isAdmin: boolean = false;
  public isOwner: boolean = false;

  public currentSubscription: Subscription;
  public itemSize: number = 0;
  //发言时间间隔
  public talkIntervalSwitch: boolean = false;
  public talkInterval: number = 0;
  public timeInterval = null;

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

    // 选择消息
    this.elementService.selectMessage$.subscribe((directive) => {
      this.selectMessage = directive;
    });

    // 获取拉黑我的人列表
    this.cacheService.cacheUpdate$.subscribe(cache => {
      if(cache && cache.blackMeListMap && this.currentChat) {
        this.blacked = false;
        console.log("拉黑我的人:",cache.blackMeListMap);
        cache.blackMeListMap.forEach(item => {
          if (item.userUid.toString() == this.currentChat.alarmItem.dataId) {
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
    this.cacheService.cacheUpdate$.subscribe(cache => {
      if(this.currentChat && cache.alarmDataMap) {
        const data = cache.alarmDataMap.get(this.currentChat.alarmItem.dataId);
        if(data && data.message && data.message.size === 0) {
          this.cacheService.chatMsgEntityMap.clear();
          this.cacheService.chatMsgEntityList = [];
        } else {
          // this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
        }

          if (this.currentChat.alarmItem.chatType === 'group') {
              /*获取群基本信息*/
              this.restService.getGroupBaseById(this.currentChat.alarmItem.dataId).subscribe(res => {
                  if (res.status === 200 && res.data) {
                      this.groupData.gnotice = res.data.gnotice == null ? '' : res.data.gnotice;
                      this.groupData.gtopContent = res.data.gtopContent == null ? '' : res.data.gtopContent;
                      console.log('group data: ', this.groupData);

                      let gnotice_length = this.groupData.gnotice.length;
                      let gtopContent_length = this.groupData.gtopContent.length;
                      this.groupData.gnotice_class = 'animate-' + parseInt(((gnotice_length >= 150 ? 150 : gnotice_length) / 50).toString());
                      this.groupData.gtopContent_class = 'animate-' + parseInt(((gtopContent_length >= 150 ? 150 : gtopContent_length) / 50).toString());

                  this.groupData.gnotice_visible = true;
                  this.groupData.gtopContent_visible = res.data.topContentSwitch===1?true:false;

                  this.groupData.gtalkIntervalSwitch=res.data.talkIntervalSwitch===1?true:false;
                  this.groupData.gtalkInterval=res.data.talkInterval;
                }

              });
          } else {
              this.groupData = {
                  gnotice: '',
                  gtopContent: '',
                  gnotice_visible: true,
                  gtopContent_visible: true,
                  gnotice_class: '',
                  gtopContent_class: '',
                  gtalkIntervalSwitch: false,
                  gtalkInterval: 3,
              };
          }
      }

      if(cache.atMe) {
        this.showAtSheet();
      }
    });

    this.cacheService.groupSilence$.subscribe((map) => {
      this.mySilence = map.get(this.localUserService.localUserInfo.userId.toString());
      this.inputAreaService.disableToTime(this.mySilence.banTime);
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
    this.currentSubscription =  this.currentChattingChangeService.currentChatting$.subscribe(currentChat => {
      this.searching = false;
      this.blacked = false;
      // === 为刷新聊天列表，只更新数据
      this.loadTabData();
      if (currentChat && this.currentChat !== currentChat) {
        this.currentChat = currentChat;
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
        this.restService.getUserBaseById(this.currentChat.alarmItem.dataId).subscribe(res => {
          if (res.data !== null) {
            this.currentChatSubtitle = [res.data.latestLoginAddres, res.data.latestLoginIp].join(": ");
          } else {
            this.currentChatSubtitle = null;
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

  checkBlackStatus() {
    this.cacheService.getBlackMeListCache().then(cache=>{
      let isBlack = false;
      if(cache && this.currentChat) {
        console.log("拉黑我的好友:",cache);
        cache.forEach(item => {
          if (item.userUid.toString() == this.currentChat.alarmItem.dataId) {
            isBlack = true;
          }
        });
      };
      console.log("是否被好友" + this.currentChat.alarmItem.dataId + "拉黑", isBlack);
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
        this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
        // this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
        this.scrollToBottom();
      }
    } else {
      if(data.dataContent.cy === ChatModeType.CHAT_TYPE_FRIEND$CHAT) { // 单聊
        if(this.currentChat && chatActive) {
          this.virtualScrollViewport.scrollTo({
            bottom: 0,
          });
          this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
          // this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
          this.scrollToBottom();
        }
      } else if(data.dataContent.cy === ChatModeType.CHAT_TYPE_GUEST$CHAT) { // 临时聊天/陌生人聊天
        if(this.currentChat && chatActive) {
          this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
          // this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
          this.scrollToBottom();
        }
      } else if(data.dataContent.cy === ChatModeType.CHAT_TYPE_GROUP$CHAT) { // 是群
        if(this.currentChat && this.currentChat.alarmItem.dataId.toString() === data.dataContent.t.toString()) {
          this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
          // this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
          this.scrollToBottom();
        }

        //重置发言间隔时间
        console.log("sssssssssss");
        console.log(this.groupData);
        this.talkIntervalSwitch=this.groupData.gtalkIntervalSwitch;
        clearInterval(this.timeInterval);
        if(this.groupData.gtalkIntervalSwitch)
        {
          this.checkAdminAndOwner();
          console.dir(this.isAdmin);
          console.dir(this.isOwner);

          if(!this.isOwner && !this.isAdmin){
            this.talkIntervalSwitch=this.groupData.gtalkIntervalSwitch;
            this.talkInterval=this.groupData.gtalkInterval;

            this.inputAreaService.disableToTime(new Date().getTime() / 1000 + this.talkInterval);
            this.timeInterval=setInterval(() => {
              console.log(this.talkInterval);
              if(this.talkInterval<=0){
                this.zone.run(() => {
                  this.talkIntervalSwitch=false;
                  this.changeDetectorRef.detectChanges();
                });
                clearInterval(this.timeInterval);
              }
              else{
                this.zone.run(() => {
                  this.talkInterval--;
                  this.changeDetectorRef.detectChanges();
                });
              }
            },1000);
          }
        }
      }
    }
    // chatMsg.fingerPrintOfProtocal
  }

  private subscribeQuote() {
    this.quoteMessageService.message$.subscribe((msg) => {
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
    this.messageDistributeService.MT03_OF_CHATTING_MESSAGE$.subscribe((res: ProtocalModel) => {
      const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
      const func = this.serverForwardService.functions[dataContent.ty];
      if(func) {
        func(res);
      } else if (dataContent.ty == 120) {
        if (dataContent.m == "start_voice") {
          this.openEndDrawer('voice', true);
          this.appChattingVoice.openPanel('','');
        }
        else if (dataContent.m == "receive_voice") {
          this.appChattingVoice.hadReceiveVoice();
        }
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
            if(this.localUserService.localUserInfo.userId !== dataContent.f) {
              this.cacheService.setChattingBadges(alarm, 1);
            }
          });
        });
      }

        if (res.type == 2) {
            if (res.typeu == 3 && dataContent.ty == 21) {
                this.appChattingVoice.endVoiceCallback();
            }
        }
    });

    this.messageDistributeService.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A$.subscribe(res => {
        const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
        console.log('订阅单聊消息：（17）', res, dataContent, this.currentChat);

        if (res.type == 2 && res.typeu == 17) {
            if (this.currentChat == undefined || parseInt(res.from) != parseInt(this.currentChat.alarmItem.dataId)) {
                this.cacheService.generateAlarmItem(res.from, 'friend', null, MsgType.TYPE_VOICE_CALL).then(alarm => {
                    this.cacheService.putChattingCache(alarm).then(() => {
                        this.currentChattingChangeService.switchCurrentChatting(alarm).then(() => {
                            console.log("聊天会话切换完成...");
                            this.openEndDrawer('voice', true);
                            this.appChattingVoice.openPanel(res, dataContent);
                        });
                    });
                });
            }
            else {
                this.openEndDrawer('voice', true);
                this.appChattingVoice.openPanel(res, dataContent);
            }
        }
    });
  }

  /**
   * 群聊/世界频道聊天消息：由发送人A发给服务端
   * @private
   */
  private subscribeOfGroupChatMsgToServer() {
    this.messageDistributeService.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER$.subscribe((res: ProtocalModel) => {
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
    this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$.subscribe((res: ProtocalModel) => {
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
              if(this.localUserService.localUserInfo.userId !== dataContent.f) {
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
      this.cacheService.chatMsgEntityMap.set(fingerPrint, chat);
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
  scrollToBottom(behavior: "auto" | "smooth" = "smooth") {
    this.itemSize = 0;
    if(this.virtualScrollViewport) {
      const sb = () => {
        this.virtualScrollViewport.scrollTo({
          bottom: 0,
          behavior: behavior,
        });
      };
      setTimeout(() => {
        this.itemSize = 50;
      }, 100);

      this.chattingAreaOnScroll();
      if(this.chattingContainer) {
        setTimeout(() => {
          sb();
        }, 10);
      }
    } else {
      setTimeout(() => {
        this.scrollToBottom(behavior);
      }, 100);
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
    } else {
      const index = this.selectMessageList.indexOf(chat);
      delete this.selectMessageList[index];
      this.selectMessageList = this.selectMessageList.filter(v => v);
    }

    return false;
  }

  /**
   * 取消所选
   */
  cancelSelectMessage() {
    this.selectMessage = false;
    this.selectMessageList = [];
  }

  /**
   * 转发所选
   */
  transmitSelectMessage() {
    if(this.selectMessageList.length > 0) {
      this.dialogService.openDialog(TransmitMessageComponent, {data: this.selectMessageList, width: '314px'}).then((ok) => {
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
    this.virtualScrollViewport.scrolledIndexChange.subscribe((index) => {
      if(index === 0) {
        this.loadMessage();
      }
      this.showDownArrow = this.virtualScrollViewport.measureScrollOffset('bottom') > 300;
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
        let topOffset = 0;
        if(this.virtualScrollViewport) {
          topOffset = this.virtualScrollViewport.measureScrollOffset("bottom");
        }
        this.cacheService.chatMsgEntityMap = new Map([...appendAfter, ...this.cacheService.chatMsgEntityMap]);
        // this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);

        if(last.length > 0) {
          // this.virtualScrollViewport.scrollToIndex(toIndex + 2, "smooth");
          setTimeout(() => {
            this.virtualScrollViewport.scrollTo({
              bottom: topOffset
            });
          }, 100);
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
            let topOffset = 0;
            if(this.virtualScrollViewport) {
              topOffset = this.virtualScrollViewport.measureScrollOffset("bottom");
            }
            this.cacheService.chatMsgEntityMap = new Map([...msgMap, ...this.cacheService.chatMsgEntityMap]);
            // this.cacheService.chatMsgEntityList = new Array(...this.cacheService.chatMsgEntityMap).flatMap(t => t[1]);
            setTimeout(() => {
              this.virtualScrollViewport.scrollTo({
                bottom: topOffset
              });
            }, 100);
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
    if(ty === MsgType.TYPE_AITE) {
      this.cacheService.putAtMessage(dataId, chatMsgEntity);
    }
  }

    loadTabData() {
        console.log('显示消息组件数据打印：', this.currentChat);

        this.group_tab_data = {
            visible: false,
            list: []
        };

      //如果是群聊，加载群页签数据
      if (this.currentChat && this.currentChat.alarmItem.chatType === 'group') {
          this.restService.getGroupBaseById(this.currentChat.alarmItem.dataId).subscribe((group_data: NewHttpResponseInterface<GroupModel>) => {
              if (group_data.data.tabSwitch === 1) {
                  /*获取群页签列表*/
                  this.restService.getUserGroupTab(this.currentChat.alarmItem.dataId).subscribe(
                      (tab_data: NewHttpResponseInterface<GroupTabModel[]>
                      ) => {
                          this.group_tab_data = {
                              visible: true,
                              list: tab_data.data
                          };
                      });
              }
              this.groupData.gtopContent_visible = group_data.data.topContentSwitch===1?true:false;

              this.groupData.gtalkIntervalSwitch=group_data.data.talkIntervalSwitch===1?true:false;
              this.groupData.gtalkInterval=group_data.data.talkInterval;
          });
      }
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
    if(this.currentChat) {
      this.cacheService.getAtMessage(this.currentChat.alarmItem.dataId).then((at) => {
        if(at.length > 0) {
          this.atMsg = at[0];
        } else {
          this.atMsg = null;
        }
      });
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
          this.virtualScrollViewport.scrollToIndex(index + 2, 'smooth');
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
    this.messageDistributeService.GROUP_SILENCE$.subscribe(() => {
      if(this.currentChat) {
        this.cacheService.cacheGroupSilence(this.currentChat.alarmItem.dataId).then();
      }
    });
    this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$.subscribe((res) => {
      const dataContent: ProtocalModelDataContent[] = JSON.parse(res.dataContent);
      if(dataContent.length) {
        const data = dataContent[0];
        if(data.ty === MsgType.TYPE_NOTALK) {
          const msg = JSON.parse(data.m);
          this.cacheService.generateAlarmItem(data.t, 'group').then(alarm => {
            alarm.metadata.allSilence = msg.isBanned;
            if(this.currentChat) {
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
    this.currentSubscription.unsubscribe();
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
        title:'群组上屏',
        txt:this.groupData.gtopContent,
      }
    }
    this.dialogService.openDialog(GroupNoticeComponent, { data: data,width: '314px',panelClass: "padding-less-dialog" }).then((res: any) => {
      if (res.ok === false) {
        return;
      }
    });
  }
}
