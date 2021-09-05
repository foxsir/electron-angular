import {AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
import {MsgType} from "@app/config/rbchat-config";

@Component({
  selector: 'app-chatting-area',
  templateUrl: './chatting-area.component.html',
  styleUrls: ['./chatting-area.component.scss']
})
export class ChattingAreaComponent implements OnInit {
  @ViewChild("chattingContainer") chattingContainer: ElementRef;
  @ViewChild('appChattingVoice') appChattingVoice: ChattingVoiceComponent;
  @ViewChild('chattingAreaDrawer') private chattingAreaDrawer: MatDrawer;

  public currentChat: AlarmItemInterface;

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
  // end icon

  public currentChatSubtitle: string = null;
  public chatMsgEntityList: ChatmsgEntityModel[];

  public localUserInfo: LocalUserinfoModel;

  // 是否正在搜索
  public searching = false;

  // 引用回复消息
  public quoteMessage: ChatmsgEntityModel = null;
  public quoteMessageText: FileMetaInterface = null;

  // 右键菜单
  public contextMenu: ContextMenuModel[] = [];
  public contextMenuAvatar: ContextMenuAvatarModel[] = [];

  // 选择消息
  public selectMessage: boolean = false;
  public selectMessageList: ChatmsgEntityModel[] = [];

  constructor(
    private avatarService: AvatarService,
    private dom: DomSanitizer,
    private localUserService: LocalUserService,
    private contextMenuService: ContextMenuService,
    private quoteMessageService: QuoteMessageService,
    private messageDistributeService: MessageDistributeService,
    private messageEntityService: MessageEntityService,
    private cacheService: CacheService,
    private imService: ImService,
    private restService: RestService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private elementService: ElementService,
    private dialogService: DialogService,
  ) {
    this.localUserInfo = this.localUserService.localUserInfo;

    this.subscribeMessagesBeReceived();
    this.subscribeOfGroupChatMsgToServer();
    this.subscribeOfGroupChatMsgServerToB();
    this.subscribeChattingMessage();

    // 选择消息
    this.elementService.selectMessage$.subscribe((directive) => {
      this.selectMessage = directive;
    });
  }

  ngOnInit(): void {
    this.currentChattingChangeService.currentChatting$.subscribe(alarm => {
      this.searching = false;
      this.scrollToBottom();
    });

    this.subscribeQuote();

    if(this.currentChattingChangeService.currentChatting) {
      this.currentChat = this.currentChattingChangeService.currentChatting;
      this.cacheService.getChattingCache(this.currentChat).then(data => {
        if(!!data) {
          this.chatMsgEntityList = Object.values(data);
          this.scrollToBottom('auto');
        }
      });
    }

    // 获取缓存
    this.currentChattingChangeService.currentChatting$.subscribe(currentChat => {
      // === 为刷新聊天列表，只更新数据
      if (this.currentChat === currentChat) {
        this.cacheService.getChattingCache(this.currentChat).then(data => {
          if(!!data) {
            this.chatMsgEntityList = Object.values(data);
          }
        });
      } else {
        this.currentChat = currentChat;
        this.openEndDrawer('setting', false);
        this.cacheService.getChattingCache(this.currentChat).then(data => {
          if(!!data) {
            this.chatMsgEntityList = Object.values(data);
            this.scrollToBottom('auto');
          }
        });
        this.restService.getUserBaseById(this.currentChat.alarmItem.dataId).subscribe(res => {
          if (res.data !== null) {
            this.currentChatSubtitle = [res.data.latestLoginAddres, res.data.registerIp].join(": ");
          } else {
            this.currentChatSubtitle = null;
          }
        });
      }
    });
  }

  pushMessageToPanel(data: {chat: ChatmsgEntityModel; dataContent: ProtocalModelDataContent}, type: 'send' | 'incept' = 'send') {
    let chatActive = false;
    if(type === 'send') {
      chatActive = this.currentChat.alarmItem.dataId.toString() === data.dataContent.t.toString();
    } else if(type === 'incept') {
      chatActive = this.currentChat.alarmItem.dataId.toString() === data.dataContent.f.toString();
    }
    if(!data.dataContent) {
      if(this.chatMsgEntityList) {
        this.chatMsgEntityList.push(data.chat);
        this.scrollToBottom();
      }
    } else {
      if(data.dataContent.cy.toString() === '0') { // 单聊
        if(this.currentChat && chatActive) {
          if(this.chatMsgEntityList) {
            this.chatMsgEntityList.push(data.chat);
            this.scrollToBottom();
          }
        }
      } else if(data.dataContent.cy.toString() === '1') { // 临时聊天/陌生人聊天
        if(this.currentChat && chatActive) {
          if(this.chatMsgEntityList) {
            this.chatMsgEntityList.push(data.chat);
            this.scrollToBottom();
          }
        }
      } else if(data.dataContent.cy.toString() === '2') { // 是群
        if(this.currentChat && this.currentChat.alarmItem.dataId.toString() === data.dataContent.t.toString()) {
          if(this.chatMsgEntityList) {
            this.chatMsgEntityList.push(data.chat);
            this.scrollToBottom();
          }
        }
      }
    }
    // chatMsg.fingerPrintOfProtocal
  }

  private subscribeQuote() {
    this.quoteMessageService.message$.subscribe((msg) => {
      // msg 不能为空
      if(msg) {
        this.quoteMessage = msg;
        // 文本，图片，视频，语音
        if(this.quoteMessage.msgType !== MsgType.TYPE_TEXT) {
          this.quoteMessageText = JSON.parse(this.quoteMessage.text);
        }
        this.scrollToBottom();
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
      const dataContent: any = JSON.parse(res.dataContent);
        // alert("单聊" + data.from);
        console.log('订阅单聊消息：', dataContent);

        if (dataContent.ty == 120) {
            if (dataContent.m == "start_voice") {
                this.openEndDrawer('voice', true);
                this.appChattingVoice.openPanel();
            }
            else if (dataContent.m == "receive_voice") {
                this.appChattingVoice.hadReceiveVoice();
            }
        }

        const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
            res.from, dataContent.nickName, dataContent.m, (new Date()).getTime(), dataContent.ty, res.fp
        );
      // fromUid, nickName, msg, time, msgType, fp = null
      chatMsgEntity.isOutgoing = true;
      this.cacheService.putChattingCache(this.currentChat, chatMsgEntity).then(() => {
        this.pushMessageToPanel({chat: chatMsgEntity, dataContent: dataContent}, 'incept');
      });
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
      // fromUid, nickName, msg, time, msgType, fp = null
      // this.pushMessageToPanel({chat: chatMsgEntity, dataContent: dataContent});
    });
  }

  /**
   * 由服务端转发
   * @private
   */
  private subscribeOfGroupChatMsgServerToB() {
    this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$.subscribe((res: ProtocalModel) => {
        const dataContent: any = JSON.parse(res.dataContent);

        console.log('订阅群聊消息 ServerToB：', dataContent);
        if (dataContent.ty == 120) {
            if (dataContent.m == "start_voice") {
              this.openEndDrawer('voice', true);
                this.appChattingVoice.openPanel();
            }
            else if (dataContent.m == "receive_voice") {
                this.appChattingVoice.hadReceiveVoice();
            }
        }

      // alert("群组" + dataContent.t);
      // this.massageBadges[dataContent.t.trim()] = 99;
      const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
        dataContent.f, dataContent.nickName, dataContent.m, res.recvTime, dataContent.ty, res.fp
      );
      this.cacheService.putChattingCache(this.currentChat, chatMsgEntity).then(() => {
        this.pushMessageToPanel({chat: chatMsgEntity, dataContent: dataContent}, 'incept');
      });
    });
  }

  /**
   * 消息已被对方收到的回调事件通知
   * @private
   */
  private subscribeMessagesBeReceived() {
    this.imService.callback_messagesBeReceived = (fingerPrint) => {
      if (fingerPrint) {
        this.cacheService.getChattingCache(this.currentChat).then(data => {
          if(data && data[fingerPrint]) {
            const chat: ChatmsgEntityModel = data[fingerPrint];
            chat.isOutgoing = true;
            this.cacheService.putChattingCache(this.currentChat, chat).then(() => {
              this.cacheService.getChattingCache(this.currentChat).then(res => {
                if(!!res) {
                  this.chatMsgEntityList = Object.values(res);
                }
              });
            });
          }
        });
      }
    };
  }

  /**
   * 消息列表滚动底部
   * @param behavior
   */
  scrollToBottom(behavior: "auto" | "smooth" = "smooth") {
    const sb = () => {
      this.chattingContainer.nativeElement.scrollTo({
        top: this.chattingContainer.nativeElement.scrollHeight,
        behavior: behavior
      });
    };
    setTimeout(() => {
      if(this.chattingContainer) {
        const images = this.chattingContainer.nativeElement.querySelectorAll("img");
        images.forEach(img => {
          img.onload = () => {
            setTimeout(() => sb());
          };
        });
        sb();
      }
    });
  }

  /**
   * 消息右键
   * @param e
   * @param menu
   * @param span
   * @param chat
   */
  contextMenuForMessage(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement, chat: ChatmsgEntityModel) {
    this.contextMenu = this.contextMenuService.getContextMenuForMessage(chat);
    if(this.contextMenu.length > 0) {
      menu.openMenu();
      span.style.position = "fixed";
      span.style.top = "0px";
      span.style.left = "0px";
      span.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
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
      span.style.position = "fixed";
      span.style.top = "0px";
      span.style.left = "0px";
      span.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
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
        this.cacheService.deleteChattingCache(this.currentChattingChangeService.currentChatting, this.selectMessageList).then(res => {
          // 刷新聊天数据
          this.cancelSelectMessage();
          this.currentChattingChangeService.switchCurrentChatting(this.currentChattingChangeService.currentChatting);
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

}
