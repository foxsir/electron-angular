import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";

@Injectable({
  providedIn: 'root'
})
export class ForwardMessageService {

  private forwardSource = new Subject<ChatmsgEntityModel>();
  public forward$ = this.forwardSource.asObservable();
  message: ChatmsgEntityModel;

  constructor(
    private currentChattingChangeService: CurrentChattingChangeService
  ) { }

  public forward(chatting: AlarmItemInterface, msg: ChatmsgEntityModel) {
    this.currentChattingChangeService.switchCurrentChatting(chatting).then(() => {
      this.forwardSource.next(msg);
      this.message = msg;
    });
  }

}
