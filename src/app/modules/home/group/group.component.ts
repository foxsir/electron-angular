import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import GroupInfoModel from "@app/models/group-info.model";
import {CacheService} from "@services/cache/cache.service";
import groupOwner from "@app/assets/icons/group-owner.svg";
import {Subscription} from "rxjs";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {Router} from "@angular/router";
import ChattingModel from "@app/models/chatting.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import {DomSanitizer} from "@angular/platform-browser";
import CommonTools from "@app/common/common.tools";
import SubscribeManage from "@app/common/subscribe-manage";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
  public chattingGroup: GroupInfoModel[] = [];
  public groupOwnerIcon =  this.dom.bypassSecurityTrustResourceUrl(groupOwner);


  constructor(
    private router: Router,
    private restService: RestService,
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
    public localUserService : LocalUserService,
    private dom: DomSanitizer,
  ) {
    this.cacheService.getCacheGroups().then(data => {
      if(data) {
        data.forEach(item => {
          this.chattingGroup.push(item);
        });
      }
    });

    SubscribeManage.run(this.cacheService.cacheUpdate$, cache => {

      if (cache.groupMap) {
        this.chattingGroup = [];
        cache.groupMap.forEach(item => {
          this.chattingGroup.push(item);
        });
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
        date: CommonTools.getTimestamp(),
        msgContent: "",
        title: item.gname,
        avatar: item.avatar,
      },
      // 聊天元数据
      metadata: {
        chatType: "group", // "friend" | "group"
      },
    };
    this.cacheService.putChattingCache(alarm).then(() => {
      this.currentChattingChangeService.switchCurrentChatting(alarm).then();
    });
  }

  ngOnDestroy() {
  }

}
