import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {ReplyMessageType} from "@app/interfaces/reply-message.interface";
import {ReplyContentType} from "@app/interfaces/reply-content.interface";
import {MsgType} from "@app/config/rbchat-config";
import CommonTools from "@app/common/common.tools";
import {MessageEntityService} from "@services/message-entity/message-entity.service";

/**
 * 允许被回复的消息类型：文本，图片，视频，语音，名片
 * 回复消息时允许回复的消息类型：本文，图片，视频，语音 【PC端没有视频，语音】
 * 引用消息服务：用来设置和订阅引用回复
 */
@Injectable({
  providedIn: 'root'
})
export class QuoteMessageService {
  private messageSource = new Subject<ChatmsgEntityModel>();
  // Observable string streams
  message$ = this.messageSource.asObservable();

  constructor(
    private messageEntityService: MessageEntityService
  ) { }

  setQuoteMessage(message: ChatmsgEntityModel) {
    if(message === null) {
      this.messageSource.next(message);
    } else {
      const chat = this.checkMessageIsPureText(message.text as string);
      if (chat === true) {
        this.messageSource.next(message);
      } else if(message.msgType === MsgType.TYPE_QUOTE) {
        // 如果是回复消息，需要构建新消息体
        const newChat = chat as ReplyMessageType;
        const msg = JSON.parse(newChat.msg);
        const entity: ChatmsgEntityModel = this.messageEntityService.createChatMsgEntity_TO_TEXT(
          msg.msgContent, message.date, message.fingerPrintOfProtocal, 1
        );
        this.messageSource.next(entity);
      } else {
        // 如果是回复消息，需要构建新消息体
        const newChat = chat as ReplyMessageType;
        message.text = JSON.stringify(newChat);
        this.messageSource.next(message);
      }
    }
  }

  checkReplyContent(reply: string): string | ReplyContentType {
    try {
      if (Number(reply) > -1) {
        return reply.toString();
      }
      return JSON.parse(reply);
    } catch (e) {
      return reply;
    }
  }

  checkMessageIsPureText(text: string): boolean | ReplyMessageType {
    try {
      if (Number(text) > -1) {
        return true;
      }
      return JSON.parse(text);
    } catch (e) {
      return true;
    }
  }

}
