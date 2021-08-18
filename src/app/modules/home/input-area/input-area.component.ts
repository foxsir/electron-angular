import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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

@Component({
  selector: 'app-input-area',
  templateUrl: './input-area.component.html',
  styleUrls: ['./input-area.component.scss']
})
export class InputAreaComponent implements OnInit {
  @Input() currentChat: AlarmItemInterface;
  @Output() sendMessage = new EventEmitter<ChatmsgEntityModel>();

  public attachmentIcon = this.dom.bypassSecurityTrustResourceUrl(attachmentIcon);
  public attachmentActiveIcon = this.dom.bypassSecurityTrustResourceUrl(attachmentActiveIcon);
  public emojiIcon = this.dom.bypassSecurityTrustResourceUrl(emojiIcon);
  public emojiActiveIcon = this.dom.bypassSecurityTrustResourceUrl(emojiActiveIcon);
  public sendIcon = this.dom.bypassSecurityTrustResourceUrl(sendIcon);
  public sendActiveIcon = this.dom.bypassSecurityTrustResourceUrl(sendActiveIcon);

  public messageText: string;

  private sendChatMap = {};
  // 引用回复消息
  public quoteMessage: ChatmsgEntityModel = null;

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
  ) { }

  ngOnInit(): void {
    // 订阅回复消息
    this.quoteMessageService.message$.subscribe((meg) => {
      this.quoteMessage = meg;
    });
  }

  getImageInfo(file: any) {
    CommonTools.getBlobUrlFromFile(file).then(blob => {
      this.sendChatMap[file.uid] = this.messageEntityService.createChatMsgEntity_TO_IMAGE(
        blob, 0, CommonTools.fingerPrint(), 0
      );
      // 尚未发出
      this.sendChatMap[file.uid].isOutgoing = false;
      this.sendMessage.emit(this.sendChatMap[file.uid]);
    });
  }

  imageUploaded(uploadedFile: UploadedFile) {
    const msg = this.sendChatMap[uploadedFile.file.uid];
    const messageText = msg.text = uploadedFile.url.href;
    return this.doSend(messageText, MsgType.TYPE_IMAGE,false, msg);
  }

  doSend(
    messageText: string = this.messageText,
    messageType: number = MsgType.TYPE_TEXT,
    emitToUI: boolean = true,
    replaceEntity: ChatmsgEntityModel = null
  ) {
    if (!messageText || messageText.trim().length === 0) {
      return;
    }
    if (!this.imService.isLogined()) {
      return this.imService.checkLogined();
    }

    messageText = this.parseReplyMessage(messageText, messageType);

    if(this.currentChat.metadata.chatType === 'friend') {
      this.sendFriendMessage(messageType, messageText, emitToUI, replaceEntity);
    } else if (this.currentChat.metadata.chatType === 'group') {
      this.sendGroupMessage(messageType, messageText, emitToUI, replaceEntity);
    }
  }

  sendFriendMessage(
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
        this.cacheService.putChattingCache(this.currentChat, chatMsgEntity);
        if(emitToUI) {
          this.sendMessage.emit(chatMsgEntity);
        }
        this.clearTextArea();
      }
    });
  }

  sendGroupMessage(
    messageType: number, messageText: string,
    emitToUI: boolean = true,
    replaceEntity: ChatmsgEntityModel = null
  ) {
    this.messageService.sendGroupMessage(messageType, this.currentChat.alarmItem.dataId, messageText).then(res => {
      console.dir(res);
    });
  }

  /**
   * 解析回复消息
   * @param messageText
   * @param messageType
   */
  parseReplyMessage(messageText: string, messageType: number): string {
    if (this.quoteMessage !== null) {
      const replyMsg = {
        duration: 0,
        fileLength: 0,
        fileName: "",
        msg: messageText,
        msgType: messageType,
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
    this.quoteMessageService.setQuoteMessage(null);
  }
}
