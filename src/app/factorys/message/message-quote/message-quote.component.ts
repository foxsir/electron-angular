import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {ChatmsgReplyOriginModel, ChatmsgReplyTextModel} from "@app/models/chatmsg-reply-text.model";
import MessageTypeTips from "@app/config/message-type-tips";
import {AlarmMessageType, MsgType} from "@app/config/rbchat-config";
import FileMetaInterface from "@app/interfaces/file-meta.interface";
import {MessageService} from "@services/message/message.service";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import {DialogService} from "@services/dialog/dialog.service";
import {PreviewMediaComponent} from "@modules/user-dialogs/preview-media/preview-media.component";

@Component({
  selector: 'app-message-quote',
  templateUrl: './message-quote.component.html',
  styleUrls: ['./message-quote.component.scss']
})
export class MessageQuoteComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public replyMsg: ChatmsgReplyTextModel;
  public replyContent: {msgType: number; msgContent: string}; // 我回复的消息
  public originContent: ChatmsgReplyOriginModel; // 原始消息
  public contactMsg: {
    nickName: string;
    userAvatar: string;
    uid: string;
    uh: string;
  }; // 名片
  public contactEntity: ChatmsgEntityModel;

  public messageType = MessageTypeTips;
  public msgType = MsgType;

  public msgParse: {msgType: number; msgContent: string} = null;

  constructor(
      private messageEntityService: MessageEntityService,
      private dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
    this.replyMsg = JSON.parse(this.chatMsg.text);
    this.replyContent = JSON.parse(this.replyMsg.msg);
    if(this.replyMsg.msgType === this.msgType.TYPE_SHORTVIDEO) {
      this.originContent = JSON.parse(this.replyMsg.reply);
    }

    if(this.replyMsg.msgType === this.msgType.TYPE_CONTACT) {
      this.contactMsg = JSON.parse(this.replyMsg.reply);
      this.contactEntity = this.messageEntityService.prepareRecievedMessage(
          this.contactMsg.uid, this.contactMsg.nickName, this.replyMsg.reply, null, MsgType.TYPE_CONTACT
      );
      this.contactEntity.uh = this.contactMsg.uh;
    }

    this.parseMsgToJSON();
  }

  parseFileMeta(text: string): FileMetaInterface {
    return JSON.parse(text);
  }

  parseMsgToJSON() {
    try {
      this.msgParse = JSON.parse(this.replyMsg.msg);
    } finally {
      // pass
    }
  }

  previewImage(url: string) {
    this.dialogService.openDialog(PreviewMediaComponent, {
      data: {type: 'image', url: url},
      panelClass: "padding-less-dialog",
    }).then(() => {});
  }
}
