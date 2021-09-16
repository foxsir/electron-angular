import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {CacheService} from "@services/cache/cache.service";
import {AvatarService} from "@services/avatar/avatar.service";
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";

import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import FriendModel from "@app/models/friend.model";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {MessageService} from "@services/message/message.service";
import {FriendAddWay} from "@app/config/friend-add-way";

interface SearchFriend {
  friendId: number;
  isFriend: 0;
  lastLoginTime: string; // "2021-08-18 19:03:51"
  nickname: string;
  remark: string;
  userAvatarFileName: string;
  whatsUp: string;
}

@Component({
  selector: 'app-search-friend',
  templateUrl: './search-friend.component.html',
  styleUrls: ['./search-friend.component.scss']
})
export class SearchFriendComponent implements OnInit {

  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
  public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
  public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);

  public searchFriend: string = "";
  public searchFriendInfo: SearchFriend = null;

  constructor(
    private router: Router,
    private dom: DomSanitizer,
    private cacheService: CacheService,
    private avatarService: AvatarService,
    private restService: RestService,
    private snackBarService: SnackBarService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }

  goBack() {
    return this.router.navigate(['/home/message']);
  }

  search() {
    if (this.searchFriend.trim().length > 0) {
      this.restService.getFriendSearch({friendAccount: this.searchFriend})
        .subscribe((res: NewHttpResponseInterface<SearchFriend>) => {
          if(res.data !== null) {
            this.searchFriendInfo = res.data;
          } else {
            this.searchFriendInfo = null;
            this.snackBarService.openMessage("没有找到匹配的用户");
          }
      });
    }
  }

  friendRequest() {
    this.cacheService.getCacheFriends().then(data => {
      if(data[this.searchFriendInfo.friendId]) {
        this.snackBarService.openMessage("已经是好友");
      } else {
        this.messageService.addFriend(FriendAddWay.search, {
          friendUserUid: this.searchFriendInfo.friendId,
          desc: this.searchFriendInfo.whatsUp
        }).then(res => {
          if(res.success) {
            this.snackBarService.openMessage("已经发送请求");
          } else {
            this.snackBarService.openMessage("请稍后重试");
          }
          this.searchFriend = '';
          this.searchFriendInfo = null;
        });
      }
    });
  }

}
