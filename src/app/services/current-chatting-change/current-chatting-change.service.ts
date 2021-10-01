import { Injectable } from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {Subject} from "rxjs";
import {CacheService} from "@services/cache/cache.service";
import {Router} from "@angular/router";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentChattingChangeService {

  public currentChatting: AlarmItemInterface;

  private currentChattingSource = new Subject<AlarmItemInterface>();
  // Observable string streams
  currentChatting$ = this.currentChattingSource.asObservable();

  constructor(
    private router: Router,
    private cacheService: CacheService,
    private quoteMessageService: QuoteMessageService
  ) { }

  switchCurrentChatting(currentChatting: AlarmItemInterface): Promise<boolean> {
    return new Promise((resolve) => {
      if(currentChatting !== null) {
        this.router.navigate(['/home/message']).then(() => {
          currentChatting.metadata.unread = 0;
          if(!this.currentChatting || this.currentChatting.alarmItem.dataId !== currentChatting.alarmItem.dataId) {
            this.cacheService.chatMsgEntityMap.clear();
            this.cacheService.chatMsgEntityList = [];
            this.cacheService.chatMsgEntityMapTemp.clear();
            this.cacheService.setChattingBadges(currentChatting, 0);
            this.currentChatting = currentChatting;
            this.currentChattingSource.next(currentChatting);
            this.quoteMessageService.setQuoteMessage(null);
          }
          resolve(true);
        });
      } else {
        this.currentChatting = currentChatting;
        this.currentChattingSource.next(currentChatting);
        resolve(true);
      }
    });
  }
}
