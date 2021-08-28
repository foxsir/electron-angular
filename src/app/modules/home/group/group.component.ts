import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import GroupInfoModel from "@app/models/group-info.model";
import {CacheService} from "@services/cache/cache.service";
import {Subscription} from "rxjs";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {Router} from "@angular/router";
import ChattingModel from "@app/models/chatting.model";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
  public chattingGroup: GroupInfoModel[] = [];
  private subscribe: Subscription;

  constructor(
    private router: Router,
    private restService: RestService,
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
  ) {
    this.cacheService.getCacheGroups().then(data => {
      this.chattingGroup = Object.values(data);
    });

    this.subscribe = this.cacheService.cacheUpdate$.subscribe(cache => {
      if (cache.groupList) {
        this.chattingGroup = Object.values(cache.groupList);
      }
    });
  }

  ngOnInit(): void {
  }

  switchChatting(item: GroupInfoModel) {
    const alarm: AlarmItemInterface = {
      alarmItem: {
        alarmMessageType: 2, // 0单聊 1临时聊天/陌生人聊天 2群聊
        dataId: item.gid,
        date: "",
        istop: true,
        msgContent: "0",
        title: item.gname,
        avatar: item.avatar,
      },
      // 聊天元数据
      metadata: {
        chatType: "group", // "friend" | "group"
      },
    };
    this.router.navigate(['/home/message']).then(() => {
      this.cacheService.putChattingCache(alarm).then(() => {
        this.currentChattingChangeService.switchCurrentChatting(alarm);
      });
    });
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
