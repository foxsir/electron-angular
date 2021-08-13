import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

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
    this.messageSource.next(message);
  }

}
