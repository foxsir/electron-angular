import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {ReplyMessageType} from "@app/interfaces/reply-message.interface";
import {ReplyContentType} from "@app/interfaces/reply-content.interface";

// 引用消息服务：用来设置和订阅引用回复
@Injectable({
  providedIn: 'root'
})
export class QuoteMessageService {
  private messageSource = new Subject<ChatmsgEntityModel>();
  // Observable string streams
  message$ = this.messageSource.asObservable();

  constructor() { }

  setQuoteMessage(message: ChatmsgEntityModel) {
    if(message === null) {
      this.messageSource.next(message);
    } else {
      const chat = this.checkMessageIsPureText(message.text);
      if (chat === true) {
        this.messageSource.next(message);
      } else {
        // 如果是回复消息，需要构建新消息体
        const newChat = chat as ReplyMessageType;
        message.text = newChat.msg;
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
