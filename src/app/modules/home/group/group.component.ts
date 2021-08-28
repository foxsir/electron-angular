import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import HttpPresponseModel from "@app/interfaces/http-response.interface";
import ChattingGroupModel from "@app/models/chatting-group.model";
import GroupInfoModel from "@app/models/group-info.model";
import {CacheService} from "@services/cache/cache.service";
import {Subscribable, Subscription} from "rxjs";

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
    private localUserInfo: LocalUserinfoModel = this.localUserService.localUserInfo;
    public chattingGroup: GroupInfoModel[] = [];
    private subscribe: Subscription;

    constructor(
      private restService: RestService,
      private localUserService: LocalUserService,
      private cacheService: CacheService
    ) {
      this.cacheService.getCacheGroups().then(data => {
        this.chattingGroup = Object.values(data);
      });

      this.subscribe = this.cacheService.cacheUpdate$.subscribe(cache => {
        if(cache.groupList) {
          this.chattingGroup = Object.values(cache.groupList);
        }
      });
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
      this.subscribe.unsubscribe();
    }

}
