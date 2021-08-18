import { Injectable } from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {Subject} from "rxjs";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Injectable({
  providedIn: 'root'
})
export class CurrentChattingChangeService {

  private currentChattingSource = new Subject<AlarmItemInterface>();
  // Observable string streams
  currentChatting$ = this.currentChattingSource.asObservable();

  constructor() { }

  switchCurrentChatting(currentChatting: AlarmItemInterface) {
    this.currentChattingSource.next(currentChatting);
  }
}
