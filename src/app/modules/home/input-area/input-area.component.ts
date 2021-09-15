import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import attachmentIcon from "@app/assets/icons/attachment.svg";
import attachmentActiveIcon from "@app/assets/icons/attachment-active.svg";
import emojiIcon from "@app/assets/icons/emoji.svg";
import emojiActiveIcon from "@app/assets/icons/emoji-active.svg";
import sendIcon from "@app/assets/icons/send.svg";
import sendActiveIcon from "@app/assets/icons/send-active.svg";
import {DomSanitizer} from "@angular/platform-browser";
import {ImService} from "@services/im/im.service";
import {MessageService} from "@services/message/message.service";
import {MsgType} from "@app/config/rbchat-config";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {RosterProviderService} from "@services/roster-provider/roster-provider.service";
import {AlarmsProviderService} from "@services/alarms-provider/alarms-provider.service";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import {Router} from "@angular/router";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import CommonTools from "@app/common/common.tools";
import {FileService} from "@services/file/file.service";
import {CacheService} from "@services/cache/cache.service";
import {UploadedFile} from "@app/factorys/upload/upload-file/upload-file.component";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";
import {ProtocalModelDataContent} from "@app/models/protocal.model";
import EmojiMap from "@app/factorys/message/message-text/EmojiMap";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatButton} from "@angular/material/button";
import {Base64} from "js-base64";
import {RestService} from "@services/rest/rest.service";
import HttpResponseInterface from "@app/interfaces/http-response.interface";
import {GroupMemberModel} from "@app/models/group-member.model";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {ElementService} from "@services/element/element.service";
import {DialogService} from "@services/dialog/dialog.service";
import {SelectFriendContactComponent} from "@modules/user-dialogs/select-friend-contact/select-friend-contact.component";
import {LocalUserService} from "@services/local-user/local-user.service";
import {ForwardMessageService} from "@services/forward-message/forward-message.service";
import { RedPocketComponent } from "@modules/user-dialogs/red-pocket/red-pocket.component";
import {RedPacketInterface} from "@app/interfaces/red-packet.interface";

@Component({
  selector: 'app-input-area',
  templateUrl: './input-area.component.html',
  styleUrls: ['./input-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAreaComponent implements OnInit, AfterViewInit {
  @Input() currentChat: AlarmItemInterface;
  @Output() sendMessage = new EventEmitter<{chat: ChatmsgEntityModel; dataContent: ProtocalModelDataContent}>();
  @ViewChild("textarea") textarea: ElementRef;
  @ViewChild("openEmojiToggle") openEmojiToggle: MatButton;
  @ViewChild("createPlanMenuTrigger") menuTrigger: MatMenuTrigger;
  @ViewChild("matMenuTriggerSpan") matMenuTriggerSpan: ElementRef;
  @ViewChild("atMenu") atMenu: MatMenu;

  private reversalEmojis = InputAreaComponent.reversalEmojiMap();
  emojiItems = InputAreaComponent.getEmojiMap();

  public attachmentIcon = this.dom.bypassSecurityTrustResourceUrl(attachmentIcon);
  public attachmentActiveIcon = this.dom.bypassSecurityTrustResourceUrl(attachmentActiveIcon);
  public emojiIcon = this.dom.bypassSecurityTrustResourceUrl(emojiIcon);
  public emojiActiveIcon = this.dom.bypassSecurityTrustResourceUrl(emojiActiveIcon);
  public sendIcon = this.dom.bypassSecurityTrustResourceUrl(sendIcon);
  public sendActiveIcon = this.dom.bypassSecurityTrustResourceUrl(sendActiveIcon);

  public messageText: string = '';
  public messageTextPlaceholder: string = '请输入信息';
  public showPlaceholder: boolean = true;

  private sendChatMap = {};
  // 引用回复消息
  public quoteMessage: ChatmsgEntityModel = null;

  public memberMap: Map<number, GroupMemberModel> = new Map();

  private atTargetMember: string[] = [];

  private tempList = [];

  /**
   * false = 发送中，true 可以发送
   * @private
   */
  private sendStatus: boolean = true;

  constructor(
    private router: Router,
    private dom: DomSanitizer,
    private imService: ImService,
    private messageService: MessageService,
    private rosterProviderService: RosterProviderService,
    private alarmsProviderService: AlarmsProviderService,
    private messageEntityService: MessageEntityService,
    private fileService: FileService,
    private cacheService: CacheService,
    private quoteMessageService: QuoteMessageService,
    private restService: RestService,
    private snackBarService: SnackBarService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private elementService: ElementService,
    private dialogService: DialogService,
    private localUserService: LocalUserService,
    private forwardMessageService: ForwardMessageService,
  ) { }

  ngOnInit(): void {
    // 订阅回复消息
    this.quoteMessageService.message$.subscribe((meg) => {
      this.quoteMessage = meg;
    });

    this.chattingChange();
    this.subscribeAtMember();

      let ipcRender = window['ipcRenderer'];
      ipcRender.on('screenshot-finished', function () {
          console.log('screenshot finished, input-area.component.');
      });
  }

  ngAfterViewInit() {
    this.subscribeForwardMessage();
  }

  private subscribeForwardMessage() {
    if(this.forwardMessageService.message) {
      return this.doSend(this.forwardMessageService.message.text, this.forwardMessageService.message.msgType,true);
    }
    this.forwardMessageService.forward$.subscribe((msg) => {
      return this.doSend(this.forwardMessageService.message.text, this.forwardMessageService.message.msgType,true);
    });
  }

  private subscribeAtMember() {
    this.elementService.atMember$.subscribe((friendId) => {
      const member: GroupMemberModel[] = [];
      this.memberMap.forEach(m => {
        if(m.user_uid.toString() === friendId.toString()) {
          member.push(m);
        }
      });
      if(member.length === 1) {
        this.appendAtMark(member.pop(), true);
      } else {
        this.snackBarService.openMessage("用户已经不是群成员");
      }
    });
  }

  /**
   * 获取群成员暂存
   */
  private chattingChange() {
    this.getGroupMembers(this.currentChat);
    this.currentChattingChangeService.currentChatting$.subscribe((currentChat) => {
      this.getGroupMembers(currentChat);
      this.messageText = "";
    });
  }

  getGroupMembers(currentChat: AlarmItemInterface) {
    if(currentChat.metadata.chatType === "group") {
      const gid = currentChat.alarmItem.dataId;
      this.cacheService.cacheGroupMembers(gid).then(cache => {
        this.memberMap = cache;
      });
    }
  }

  getImageInfo(file: any) {
    CommonTools.getBlobUrlFromFile(file).then(blob => {
      this.sendChatMap[file.uid] = this.messageEntityService.createChatMsgEntity_TO_IMAGE(
        blob, 0, CommonTools.fingerPrint(), 0
      );
      // 尚未发出
      this.sendChatMap[file.uid].isOutgoing = false;
      this.sendMessage.emit({
        chat: this.sendChatMap[file.uid],
        dataContent: this.getDefaultDataContent(MsgType.TYPE_IMAGE)
      });
    });
  }

  getFileInfo(file: any) {
    CommonTools.getBlobUrlFromFile(file).then(blob => {
      this.sendChatMap[file.uid] = this.messageEntityService.createChatMsgEntity_TO_FILE('',
        blob, 0, CommonTools.fingerPrint(), 0
      );
      // 尚未发出
      this.sendChatMap[file.uid].isOutgoing = false;
      this.sendMessage.emit({
        chat: this.sendChatMap[file.uid],
        dataContent: this.getDefaultDataContent(MsgType.TYPE_FILE)
      });
    });
  }

  /**
   * 上传图片
   * @param uploadedFile
   */
  imageUploaded(uploadedFile: UploadedFile) {
    const msg = this.sendChatMap[uploadedFile.file.uid];
    const messageText = msg.text = uploadedFile.url.href;
    return this.doSend(messageText, MsgType.TYPE_IMAGE,false, msg);
  }

  /**
   * 上传文件
   * @param uploadedFile
   */
  fileUploaded(uploadedFile: UploadedFile) {
    const msg = this.sendChatMap[uploadedFile.file.uid];
    const messageText = msg.text = uploadedFile.url.href;

    const message = {
      fileName: uploadedFile.file.name,
      ossFilePath: uploadedFile.url.href,
      fileMd5 : CommonTools.md5([uploadedFile.file.name, uploadedFile.file.lastModified].join("-")),
      fileLength: uploadedFile.file.size
    };
    return this.doSend(JSON.stringify(message), MsgType.TYPE_FILE, false, msg);
  }

  /**
   * 发送消息
   * @param messageText
   * @param messageType
   * @param emitToUI
   * @param replaceEntity
   */
  doSend(
    messageText: string = this.messageText,
    messageType: number = MsgType.TYPE_TEXT,
    emitToUI: boolean = true,
    replaceEntity: ChatmsgEntityModel = null
  ) {
    // sendStatus
    if (!messageText || messageText.trim().length === 0) {
      return;
    }
    if (!this.imService.isLogined()) {
      return this.imService.checkLogined();
    }
    if(this.quoteMessage !== null) {
      // 先获取消息类型
      messageText = JSON.stringify({
        msgType: messageType, msgContent: messageText
      });

      // 重新设置回复类型
      messageType = MsgType.TYPE_QUOTE;
    }
    messageText = this.parseReplyMessage(messageText);

    this.clearTextArea();

    if(this.currentChat.metadata.chatType === 'friend') {
      this.sendFriendMessage(messageType, messageText, emitToUI, replaceEntity);
    } else if (this.currentChat.metadata.chatType === 'group') {
      this.sendGroupMessage(messageType, messageText, emitToUI, replaceEntity);
    }

    return false;
  }

  /**
   * 发送单聊消息
   * @param messageType
   * @param messageText
   * @param emitToUI
   * @param replaceEntity
   */
  private sendFriendMessage(
    messageType: number, messageText: string,
    emitToUI: boolean = true,
    replaceEntity: ChatmsgEntityModel = null
  ) {
    this.messageService.sendMessage(messageType, this.currentChat.alarmItem.dataId, messageText).then(res => {
      if(res.success === true) {
        const friendUid = this.currentChat.alarmItem.dataId;
        const ree = this.rosterProviderService.getFriendInfoByUid(friendUid);

        // 自已发出的消息，也要显示在相应的UI界面上
        const message = res.msgBody.m;
        // const alarmMessageDTO = this.alarmsProviderService.createChatMsgAlarmForLocal(
        //   res.msgBody.ty, message, "ree.nickname", friendUid
        // );
        // alert(JSON.stringify(alarmMessageDTO));

        //111 新增指纹码 he 消息类型msgType
        // debugger
        const chatMsgEntity = this.messageEntityService.prepareSendedMessage(
          message, 0, res.fingerPrint, messageType
        );
        if (replaceEntity) {
          replaceEntity.fingerPrintOfProtocal = chatMsgEntity.fingerPrintOfProtocal;
        }
        chatMsgEntity.isOutgoing = false;


        this.tempList.push({
          chatMsgEntity: chatMsgEntity,
          emitToUI: emitToUI,
          msgBody: res.msgBody
        });
        this.pushCache();

        // this.cacheService.putChattingCache(this.currentChat, chatMsgEntity).then(() => {
        //   if(emitToUI) {
        //     this.sendMessage.emit({chat: chatMsgEntity, dataContent: res.msgBody});
        //   }
        //   // this.clearTextArea();
        // });
      }
    });
  }

  /**
   * 将消息房里列表然后逐条放入缓存
   * @private
   */
  private pushCache() {
    const data = this.tempList.shift();
    this.cacheService.putChattingCache(this.currentChat, data.chatMsgEntity).then(() => {
      this.cacheService.getChattingCache(this.currentChat).then((res) => {
        if(res.get(data.chatMsgEntity.fingerPrintOfProtocal)) {
          if(data.emitToUI) {
            this.sendMessage.emit({chat: data.chatMsgEntity, dataContent: data.msgBody});
          }
          if(this.tempList.length > 0) {
            this.pushCache();
          }
        }
      });
    });
  }

  /**
   * 发送群消息
   * @param messageType
   * @param messageText
   * @param emitToUI
   * @param replaceEntity
   */
  private sendGroupMessage(
    messageType: number, messageText: string,
    emitToUI: boolean = true,
    replaceEntity: ChatmsgEntityModel = null
  ) {
    // this.messageService.atGroupMember(this.currentChat, messageText, this.atTargetMember).then();
    this.messageService.sendGroupMessage(messageType, this.currentChat.alarmItem.dataId, messageText).then(res => {
      if(res.success === true) {
        const friendUid = this.currentChat.alarmItem.dataId;
        const ree = this.rosterProviderService.getFriendInfoByUid(friendUid);

        // 自已发出的消息，也要显示在相应的UI界面上
        const message = res.msgBody.m;
        const alarmMessageDTO = this.alarmsProviderService.createChatMsgAlarmForLocal(
          res.msgBody.ty, message, "ree.nickname", friendUid
        );

        //111 新增指纹码 he 消息类型msgType
        // debugger
        const chatMsgEntity = this.messageEntityService.prepareSendedMessage(
          message, 0, res.fingerPrint, messageType
        );
        if (replaceEntity) {
          replaceEntity.fingerPrintOfProtocal = chatMsgEntity.fingerPrintOfProtocal;
        }
        chatMsgEntity.isOutgoing = false;

        this.tempList.push({
          chatMsgEntity: chatMsgEntity,
          emitToUI: emitToUI,
          msgBody: res.msgBody
        });
        this.pushCache();
        // this.cacheService.putChattingCache(this.currentChat, chatMsgEntity).then(() => {
        //   if(emitToUI) {
        //     this.sendMessage.emit({chat: chatMsgEntity, dataContent: res.msgBody});
        //   }
        // });
      }
    });
  }

  /**
   * 解析回复消息
   * @param messageText
   */
  parseReplyMessage(messageText: string): string {
    if (this.quoteMessage !== null) {
      const replyMsg = {
        duration: 0,
        fileLength: 0,
        fileName: "",
        msg: messageText,
        msgType: this.quoteMessage.msgType,
        reply: this.quoteMessage.text,
        userName: "普通管理员",
      };
      return JSON.stringify(replyMsg);
    } else {
      return messageText;
    }
  }

  /**
   * 清空输入框
   */
  clearTextArea() {
    this.messageText = "";
    this.textarea.nativeElement.innerHTML = "";
    this.quoteMessageService.setQuoteMessage(null);
  }

  private static getEmojiMap(): Set<{ key: string; value: string }> {
    const set = new Set<{ key: string; value: string }>();
    for (const emojiMapKey in EmojiMap) {
      if (EmojiMap[emojiMapKey]) {
        set.add({
          key: emojiMapKey,
          value: EmojiMap[emojiMapKey]
        });
      }
    }

    return set;
  }

  /**
   * EmojiMap key value 互换
   * @private
   */
  private static reversalEmojiMap() {
    const array = [];
    for (const emojiMapKey in EmojiMap) {
      if (EmojiMap[emojiMapKey]) {
        array.push([EmojiMap[emojiMapKey], emojiMapKey]);
      }
    }

    return new Map(array);
  }

  /**
   * 解析输入内容
   */
  getTextareaContent(): string {
    const textArray = [];
    this.atTargetMember = [];
    this.textarea.nativeElement.childNodes.forEach(node => {
      if(node.tagName === "IMG") {
        if(node.className === 'at-mark-for-input') {
          textArray.push("@" + node.getAttribute("user-nickname"));
          this.atTargetMember.push(node.getAttribute("user-id"));
        } else {
          textArray.push(" " +this.reversalEmojis.get(node.src.split('/').pop())+ " ");
        }
      } else {
        textArray.push(node.nodeValue);
      }
    });

    return textArray.join("").trim();
  }

  /**
   * 触发@
   * @private
   */
  private toggleAt() {
    this.textarea.nativeElement.blur();
    this.matMenuTriggerSpan.nativeElement.style.marginLeft = this.calcMenuPosition();
    this.menuTrigger.openMenu();
  }

  /**
   * 计算menu偏移位置
   */
  calcMenuPosition(): string {
    const selection = window.getSelection();
    const iterator = this.textarea.nativeElement.childNodes.entries();
    let check = true;
    const tempDiv = document.createElement("div");
    tempDiv.style.width = 'fit-content';
    tempDiv.style.visibility = 'hidden';
    while (check) {
      const pre: HTMLElement | undefined = iterator.next().value[1];
      if(!pre) {
        check = false;
      }
      if(pre === selection.anchorNode) {
        const nodeValue = pre.nodeValue;
        const sp = document.createElement("span");
        sp.innerHTML = nodeValue.substring(0, selection.anchorOffset);
        tempDiv.append(sp);
        check = false;
      } else {
        if(pre) {
          const sp = document.createElement("span");
          sp.innerHTML = pre.nodeValue || pre.outerHTML
          tempDiv.append(sp);
        }
      }
    }
    document.body.append(tempDiv);
    let position = tempDiv.clientWidth;
    // 多行文本处理
    if(this.textarea.nativeElement.clientWidth < tempDiv.clientWidth) {
      position = this.textarea.nativeElement.clientWidth % tempDiv.clientWidth;
    }
    tempDiv.remove();
    return position + "px";
  }

  /**
   * 插入@标签
   * @param member
   * @param rightKey
   */
  public appendAtMark(member: GroupMemberModel, rightKey: boolean = false) {
    this.textarea.nativeElement.focus();
    if(rightKey === false) {
      document.execCommand("delete");
    }
    document.execCommand("insertHTML", false, this.getATMark(member).outerHTML + " ");
    this.showPlaceholder = false;
    this.textarea.nativeElement.blur();
    this.menuTrigger.closeMenu();
  }

  /**
   * 监听keydown
   * @param event
   */
  textareaKeydown(event: KeyboardEvent) {
    if(this.currentChat.metadata.chatType === 'group') {
      if(event.key === '@') {
        setTimeout(() => this.textareaChange());
        setTimeout(() => this.toggleAt());
      }
    }
  }

  /**
   * 监听输入框内容变化
   */
  textareaChange() {
    this.messageText = this.getTextareaContent();
    this.showPlaceholder = this.messageText.length === 0;
  }

  /**
   * 插入表情
   * @param emoji
   */
  insertEmoji(emoji: { key: string; value: string }) {
    this.textarea.nativeElement.focus();
    document.execCommand("insertImage", false, ['assets/emojis', emoji.value].join("/"));
    this.openEmojiToggle._elementRef.nativeElement.click();
    this.textarea.nativeElement.focus();

    this.textareaChange();
  }

  /**
   * 生成@name图片标签
   * @param member
   */
  private getATMark(member: GroupMemberModel): HTMLImageElement {
    const sp = document.createElement('span');
    const text = `@${member.nickname}`;
    sp.innerText = text;
    sp.style.visibility = 'hidden';
    sp.style.fontSize = '14px';
    document.body.append(sp);
    const width = sp.offsetWidth;
    sp.remove();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg">
      <text font-size="14px" fill="#0091ff" transform="translate(0 12)">${text}</text>
    </svg>`;
    const src = ['data:image/svg+xml;base64,', Base64.encode(svg)].join("");
    const img = document.createElement("img");
    img.src = src;
    img.id = CommonTools.fingerPrint();
    img.setAttribute("user-id", member.user_uid);
    img.setAttribute("user-nickname", member.nickname);
    img.className = "at-mark-for-input";
    img.style.width = width + "px";
    return img;
  }

  /**
   * 输入框延迟获取焦点
   */
  asyncTextareaFocus() {
    setTimeout(() => this.textarea.nativeElement.focus(), 300);
  }

  selectFriend() {
    this.dialogService.openDialog(SelectFriendContactComponent, {
      width: '314px',
      maxHeight: '600px',
    }).then((friend) => {
      if(friend) {
        this.dialogService.confirm({title: "消息提示", text: "确认分享联系信息到当前聊天吗？"}).then((ok) => {
          if(ok) {
            const messageText = JSON.stringify({
              nickName: friend.nickname,
              uid: friend.friendUserUid,
            });
            this.doSend(messageText, MsgType.TYPE_CONTACT,true);
          }
        });
      }
    });
  }

    sendRedpocket() {
        var data = {
            dialog_type: 'start_red_pocket',
            toUserId: this.currentChat.alarmItem.dataId,
            chatType: this.currentChat.metadata.chatType,
            count: '',
        };

        this.dialogService.openDialog(RedPocketComponent, { data: data }).then((res: RedPacketInterface) => {
            console.log('red pocket dialog result: ', res);
            if (res && res.ok === true) {
              const msgContent = JSON.stringify({
                greetings: res.greetings,
                isOpen: 0,
                orderId: res.res.orderId,
                type: res.type,
                userId: res.toUserId,
                word: res.word,
              });
              this.messageService.sendMessage(MsgType.TYPE_REDBAG, this.currentChat.alarmItem.dataId, msgContent).then((send) => {
                const chatMsgEntity = this.messageEntityService.prepareSendedMessage(
                  send.msgBody.m, 0, send.fingerPrint, send.msgBody.ty
                );
                this.tempList.push({
                  chatMsgEntity: chatMsgEntity,
                  emitToUI: true,
                  msgBody: send.msgBody
                });
                this.pushCache();
              });
            }
        });
    }

  getDefaultDataContent(msgType: number): ProtocalModelDataContent {
    return {
      cy: 0, // 对应ChatType，聊天类型。比如单人聊天，群聊天
      f: this.localUserService.localUserInfo.userId, // 消息发送方
      m: "", // 消息内容
      t: this.currentChat.alarmItem.dataId, // 消息接收方
      ty: msgType, // 对应MsgType，消息类型。比如普通文本，图片消息等
      m2: "PC", // 设别
      nickName: this.localUserService.localUserInfo.nickname, //
      showMsg: false, //
      sync: "0", //
      uh: "",
    };
  }

  startScreenShot() {
      let winstartScreenShot = window['startScreenShot'];
      winstartScreenShot();
  }

}
