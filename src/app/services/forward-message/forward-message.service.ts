import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";

@Injectable({
  providedIn: 'root'
})
export class ForwardMessageService {

  private forwardSource = new Subject<ChatmsgEntityModel>();
  public forward$ = this.forwardSource.asObservable();
  // message: ChatmsgEntityModel;

  constructor(
    private currentChattingChangeService: CurrentChattingChangeService,
    private snackBarService: SnackBarService,
  ) { }

  public forward(chatting: AlarmItemInterface, msg: ChatmsgEntityModel, switchChatting: boolean = true) {
    if(switchChatting) {
      this.currentChattingChangeService.switchCurrentChatting(chatting).then(() => {
        this.forwardSource.next(msg);
      });
    } else {
      this.forwardSource.next(msg);
      this.snackBarService.openMessage("发送成功");
    }
  }

}
