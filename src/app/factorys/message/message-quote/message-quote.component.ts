import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {ChatmsgReplyOriginModel, ChatmsgReplyTextModel} from "@app/models/chatmsg-reply-text.model";
import MessageTypeTips from "@app/config/message-type-tips";
import {AlarmMessageType, MsgType} from "@app/config/rbchat-config";
import FileMetaInterface from "@app/interfaces/file-meta.interface";

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

  public messageType = MessageTypeTips;
  public msgType = MsgType;

  public msgParse: {msgType: number; msgContent: string} = null;

  constructor() {
  }

  ngOnInit(): void {
    this.replyMsg = JSON.parse(this.chatMsg.text);
    this.replyContent = JSON.parse(this.replyMsg.msg);
    if(this.replyMsg.msgType === this.msgType.TYPE_SHORTVIDEO) {
      this.originContent = JSON.parse(this.replyMsg.reply);
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

}
