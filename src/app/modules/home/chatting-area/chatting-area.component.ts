import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
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

@Component({
  selector: 'app-chatting-area',
  templateUrl: './chatting-area.component.html',
  styleUrls: ['./chatting-area.component.scss']
})
export class ChattingAreaComponent implements OnInit, AfterViewInit {
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
  public downArrowIcon = this.dom.bypassSecurityTrustResourceUrl(downArrowIcon);
  public downArrowActiveIcon = this.dom.bypassSecurityTrustResourceUrl(downArrowActiveIcon);
  // end icon

  public currentChatSubtitle: string = null;

  public localUserInfo: LocalUserinfoModel;

  // 是否正在搜索
  public searching = false;

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
    private serverForwardService: ServerForwardService
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
    this.subscribeQuote();

    // 清屏
    this.cacheService.cacheUpdate$.subscribe(cache => {
      if(this.currentChat && cache.alarmDataMap) {
        const data = cache.alarmDataMap.get(this.currentChat.alarmItem.dataId);
        if(data.message.size === 0) {
          this.cacheService.chatMsgEntityMap.clear();
        }
      }
    });
  }

  ngAfterViewInit() {
    if(this.currentChattingChangeService.currentChatting) {
      this.currentChat = this.currentChattingChangeService.currentChatting;
      this.cacheService.getChattingCache(this.currentChat).then(data => {
        if(!!data) {
          this.cacheService.chatMsgEntityMapTemp = data;
          this.loadMessage(true);
        }
      });
    }

    // 获取缓存
    this.currentChattingChangeService.currentChatting$.subscribe(currentChat => {
      this.searching = false;
      this.scrollToBottom();
      // === 为刷新聊天列表，只更新数据
      if (this.currentChat !== currentChat) {
        // 切换会话清空列表
        this.cacheService.chatMsgEntityMapTemp.clear();
        this.cacheService.chatMsgEntityMap.clear();

        this.currentChat = currentChat;
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
            this.currentChatSubtitle = [res.data.latestLoginAddres, res.data.registerIp].join(": ");
          } else {
            this.currentChatSubtitle = null;
          }
        });
      }
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
    let chatActive = false;
    if(type === 'send') {
      chatActive = this.currentChat.alarmItem.dataId.toString() === data.dataContent.t.toString();
    } else if(type === 'incept') {
      chatActive = this.currentChat.alarmItem.dataId.toString() === data.dataContent.f.toString();
    }
    if(!data.dataContent) {
      if(this.cacheService.chatMsgEntityMap.size > 0) {
        this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
        this.scrollToBottom();
      }
    } else {
      if(data.dataContent.cy === ChatModeType.CHAT_TYPE_FRIEND$CHAT) { // 单聊
        if(this.currentChat && chatActive) {
          this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
          this.scrollToBottom();
        }
      } else if(data.dataContent.cy === ChatModeType.CHAT_TYPE_GUEST$CHAT) { // 临时聊天/陌生人聊天
        if(this.currentChat && chatActive) {
          this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
          this.scrollToBottom();
        }
      } else if(data.dataContent.cy === ChatModeType.CHAT_TYPE_GROUP$CHAT) { // 是群
        if(this.currentChat && this.currentChat.alarmItem.dataId.toString() === data.dataContent.t.toString()) {
          this.cacheService.chatMsgEntityMap.set(data.chat.fingerPrintOfProtocal, data.chat);
          this.scrollToBottom();
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
      } else {
        const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
          res.from, dataContent.nickName, dataContent.m, (new Date()).getTime(), dataContent.ty, res.fp
        );
        // fromUid, nickName, msg, time, msgType, fp = null
        const chatType = Number(dataContent.cy) === ChatModeType.CHAT_TYPE_FRIEND$CHAT ? 'friend' : 'group';
        const dataId = chatType === 'friend' ? res.from : dataContent.t;
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


        // QoS: true
        // bridge: false
        // dataContent: "{"cy":0,"f":"400340","m":"p","m3":"android","t":"400070","ty":0}"
        // fp: "ee20eee0-6a12-430d-81ec-f7203a8566da"
        // from: "400340"
        // recvTime: 1630986114599
        // sm: 0
        // to: "400070"
        // type: 2
        // typeu: 3

      }
        // alert("单聊" + data.from);
        console.log('订阅单聊消息：', dataContent);

        //if (dataContent.ty == 120) {
        //    if (dataContent.m == "start_voice") {
        //        this.openEndDrawer('voice', true);
        //        this.appChattingVoice.openPanel();
        //    }
        //    else if (dataContent.m == "receive_voice") {
        //        this.appChattingVoice.hadReceiveVoice();
        //    }
        //    else if (dataContent.m == 'end_voice') {
        //        this.appChattingVoice.endVoiceCallback();
        //    }
        //}

        if (res.type == 2) {
            if (res.typeu == 3 && dataContent.ty == 21) {
                this.appChattingVoice.endVoiceCallback();
            }
        }
    });

      this.messageDistributeService.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A$.subscribe(res => {
          const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
          console.log('订阅单聊消息：（17）', res, dataContent);

          if (res.type == 2 && res.typeu == 17) {
              this.openEndDrawer('voice', true);
              this.appChattingVoice.openPanel(res, dataContent);
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
    });
  }

  /**
   * 由服务端转发
   * @private
   */
  private subscribeOfGroupChatMsgServerToB() {
    this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$.subscribe((res: ProtocalModel) => {
        const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);

        console.log('订阅群聊消息 ServerToB：', dataContent);
        if (dataContent.ty == 120) {
            if (dataContent.m == "start_voice") {
              this.openEndDrawer('voice', true);
                this.appChattingVoice.openPanel('','');
            }
            else if (dataContent.m == "receive_voice") {
                this.appChattingVoice.hadReceiveVoice();
            }
        }

      const func = this.serverForwardService.functions[dataContent.ty];
      if(func) {
        func(res);
      } else {
        const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
          dataContent.f, dataContent.nickName, dataContent.m, res.recvTime, dataContent.ty, res.fp
        );
        this.cacheService.putChattingCache(this.currentChat, chatMsgEntity).then(() => {
          this.pushMessageToPanel({chat: chatMsgEntity, dataContent: dataContent}, 'incept');
        });
      }
    });
  }


  updateDataForUI(fingerPrint: string) {
    this.cacheService.getChattingCache(this.currentChat).then(data => {
      if(data && data.get(fingerPrint)) {
        const chat: ChatmsgEntityModel = data.get(fingerPrint);
        chat.isOutgoing = true;
        this.cacheService.putChattingCache(this.currentChat, chat).then(() => {
          this.cacheService.chatMsgEntityMap.set(chat.fingerPrintOfProtocal, chat);
        });
      } else {
        let reTry = 10;
        const rt = setInterval(() => {
          if(reTry === 0) {
            clearInterval(rt);
          }
          if(data && data.get(fingerPrint)) {
            const chat = data.get(fingerPrint);
            chat.isOutgoing = true;
            this.cacheService.putChattingCache(this.currentChat, chat).then(() => {
              this.cacheService.chatMsgEntityMap.set(chat.fingerPrintOfProtocal, chat);
            });
            clearInterval(rt);
          }
          this.cacheService.getChattingCache(this.currentChat).then(reData => {
            if(reData && reData.get(fingerPrint)) {
              const chat: ChatmsgEntityModel = reData.get(fingerPrint);
              chat.isOutgoing = true;
              this.cacheService.putChattingCache(this.currentChat, chat).then(() => {
                this.cacheService.chatMsgEntityMap.set(chat.fingerPrintOfProtocal, chat);
                clearInterval(rt);
              });
            }
          });

          reTry = reTry -1;
        }, 1000);
      }
    });
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
    const sb = () => {
      this.chattingContainer.nativeElement.scrollTo({
        top: this.chattingContainer.nativeElement.scrollHeight,
        behavior: behavior
      });
    };
    setTimeout(() => {
      this.chattingAreaOnScroll();
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
    // const container = this.chattingContainer.nativeElement;
    const container = document.getElementById("chatting-panel");
    if(container.onscroll === null) {
      container.addEventListener('scroll', () => {
        const bottom = container.scrollHeight - container.offsetHeight - container.scrollTop;
        this.showDownArrow = bottom > 200;

        if(container.scrollTop === 0 && this.loadingMessage === false) {
          this.loadMessage();
        }
      });
    }
  }

  /**
   * 从缓存或者漫游接口获取消息
   * @param goBottom
   * @param lastMessage
   * @private
   */
  private loadMessage(goBottom: boolean = false) {
    if(this.loadingMessage) {
      return false;
    } {
      this.loadingMessage = true;
      const container = this.chattingContainer.nativeElement;
      if(this.cacheService.chatMsgEntityMapTemp.size > 0) {
        setTimeout(() => {
          // 从缓存获取消息
          this.loadingMessage = false;
          const last = new Array(...this.cacheService.chatMsgEntityMapTemp.entries()).reverse().splice(0, 15);
          const appendAfter = new Map();
          last.forEach(keyvalue => {
            this.cacheService.chatMsgEntityMapTemp.delete(keyvalue[0]);
            appendAfter.set(keyvalue[0], keyvalue[1]);
          });
          this.cacheService.chatMsgEntityMap = new Map([...appendAfter, ...this.cacheService.chatMsgEntityMap]);

          setTimeout(() => {
            document.getElementById(last.splice(-1)[0][0]).scrollIntoView();
          });


          if(goBottom) {
            this.scrollToBottom("auto");
          }
          console.dir("拉取缓存消息");
        }, 500);
      } else if(this.cacheService.chatMsgEntityMap.size > 0) {
        // 从漫游接口获取数据
        const list: ChatmsgEntityModel[] = new Array(...this.cacheService.chatMsgEntityMap.values());
        const localLastMsg: ChatmsgEntityModel[] = list.slice(0, 1);
        const localFirstMsgFP = localLastMsg[0].fingerPrintOfProtocal;

        this.historyMessageService.getFriendMessage(
          this.currentChat, {start: localFirstMsgFP}, 'top', 30
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
            setTimeout(() => {
              document.getElementById(localFirstMsgFP).scrollIntoView();
            });
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

}
