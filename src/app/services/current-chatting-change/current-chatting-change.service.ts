import { Injectable } from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {Subject} from "rxjs";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {CacheService} from "@services/cache/cache.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentChattingChangeService {

  public currentChatting: AlarmItemInterface;

  private currentChattingSource = new Subject<AlarmItemInterface>();
  // Observable string streams
  currentChatting$ = this.currentChattingSource.asObservable();

  constructor(
    private cacheService: CacheService
  ) { }

  switchCurrentChatting(currentChatting: AlarmItemInterface) {
    currentChatting.metadata.unread = 0;
    this.cacheService.setChattingBadges(currentChatting, 0);
    this.currentChatting = currentChatting;
    this.currentChattingSource.next(currentChatting);
  }
}
