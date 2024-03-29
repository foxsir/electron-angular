import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import HttpPresponseModel from "@app/interfaces/http-response.interface";
import ChattingGroupModel from "@app/models/chatting-group.model";
import {MessageService} from "@services/message/message.service";
import {MsgType} from "@app/config/rbchat-config";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {FriendRequestModel} from "@app/models/friend-request.model";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {CacheService} from "@services/cache/cache.service";
import SubscribeManage from "@app/common/subscribe-manage";

@Component({
    selector: 'app-new-friend',
    templateUrl: './new-friend.component.html',
    styleUrls: ['./new-friend.component.scss']
})

export class NewFriendComponent implements OnInit {
    private localUserInfo: LocalUserinfoModel = this.localUserService.localUserInfo;
    public model_list: FriendRequestModel[] = [];

    constructor(
      private restService: RestService,
      private localUserService: LocalUserService,
      private messageService: MessageService,
      private snackBarService: SnackBarService,
      private cacheService: CacheService,
      private zone: NgZone,
      private changeDetectorRef: ChangeDetectorRef,
    ) {
        // this.cacheService.cacheNewFriends();
        this.cacheService.getNewFriendMap().then(cache => {
          console.log("缓存的好友请求数据:", cache);
          if(cache) {
            cache.forEach(item => {
              this.model_list.push(item);
            });
          }
          SubscribeManage.run(this.cacheService.cacheUpdate$, data => {
            if(data.newFriendMap) {
              this.zone.run(() => {
                this.model_list = [];
                data.newFriendMap.forEach(item => {
                  this.model_list.push(item);
                });
                this.changeDetectorRef.detectChanges();
              });
            }
          });
        });
    }

    ngOnInit(): void {

    }

    refuse(item) {
      this.messageService.friendRequest("cancel", item).then(res => {
        if(res.success) {
          this.cacheService.updateNewFriendMap(item.reqUserId, false);
          this.snackBarService.openMessage(`你拒绝了${item.reqUserNickname}的好友请求`);
        } else {
          this.snackBarService.openMessage("请稍后重试");
        }
      });
    }

    agree(item) {
      this.messageService.friendRequest("ok", item).then(res => {
        if(res.success) {
          this.cacheService.updateNewFriendMap(item.reqUserId, true);
          /*
          setTimeout(() => {
            this.cacheService.cacheFriends().then();
          }, 1000);
          *
           */
          this.snackBarService.openMessage(`已经同意${item.reqUserNickname}添加好友`);
        } else {
          this.snackBarService.openMessage("请稍后重试");
        }
      });
    }

}
