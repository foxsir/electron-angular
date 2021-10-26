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
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import CommonTools from "@app/common/common.tools";
import {AddFriendComponent} from "@modules/user-dialogs/add-friend/add-friend.component";
import {DialogService} from "@services/dialog/dialog.service";

interface SearchFriend {
  isFriend: number;
  friendUserUid: number;
  /**
   * @deprecated
   */
  isOnline: number; // 是否在线 0否 1是(已废弃)
  base64Avatar: string;
  userUid:  number; //  用户id
  nickname:  string; //  好友昵称
  remark:  string; //  对好友的备注
  userAvatarFileName:  string; //  好友头像
  userCornet:  string; //  好友通讯号
  groupName:  string; //  好友分组
  userSex:  string; //  好友性别
  whatSUp:  string; //  好友签名
  latestLoginTime:  number; //  最近登录时间(时间戳)
  onlineStatus:  boolean; //  好友在线状态
  updateAvatarTimestamp:  number; //  头像更新时间戳
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
    private currentChattingChangeService: CurrentChattingChangeService,
    private localUserService: LocalUserService,
    private dialogService: DialogService,
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
          console.dir(res)
          if(res.data !== null) {
            this.searchFriendInfo = res.data;
            // 和本地匹配一下，看看是不是好友
            this.cacheService.getCacheFriends().then(data => {
              if(data.get(this.searchFriendInfo.friendUserUid.toString())) {
                this.searchFriendInfo.isFriend = 1;
              } else {
                this.searchFriendInfo.isFriend = 0;
              }
            });
          } else {
            this.searchFriendInfo = null;
            this.snackBarService.openMessage("没有找到匹配的用户");
          }
      });
    }
  }

  friendRequest() {
    this.cacheService.getCacheFriends().then(data => {
      console.log("搜索到的好友信息:" , this.searchFriendInfo);
      if (this.searchFriendInfo.friendUserUid.toString() === this.localUserService.localUserInfo.userId.toString()) {
        this.snackBarService.openMessage("不能添加自己为好友");
      } else if(data[this.searchFriendInfo.friendUserUid.toString()]) {
        this.snackBarService.openMessage("已经是好友");
      } else {
        this.dialogService.openDialog(AddFriendComponent, { data: this.searchFriendInfo,width: '314px',panelClass: "padding-less-dialog" }).then((res: any) => {
          if (res.ok != true) {
            return;
          }
          this.messageService.addFriend(FriendAddWay.search, {
            friendUserUid: this.searchFriendInfo.friendUserUid,
            desc: res.txtMsg
          }).then(re => {
            if(re.success) {
              this.snackBarService.openMessage("已经发送请求");
            } else {
              this.snackBarService.openMessage("请稍后重试");
            }
            this.searchFriend = '';
            this.searchFriendInfo = null;
          });
        });

      }
    });
  }

  /**
   * 切换到和该好友的聊天界面
   */
  switchChatting(item: SearchFriend) {
    const alarm: AlarmItemInterface = {
      alarmItem: {
        alarmMessageType: 0, // 0单聊 1临时聊天/陌生人聊天 2群聊
        dataId: item.friendUserUid.toString(),
        date: CommonTools.getTimestamp(),
        msgContent: "",
        title: item.remark?item.remark:item.nickname,
        avatar: item.userAvatarFileName,
      },
      // 聊天元数据
      metadata: {
        chatType: "friend", // "friend" | "group"
      },
    };
    this.cacheService.putChattingCache(alarm).then(() => {
      this.currentChattingChangeService.switchCurrentChatting(alarm).then();
    });
  }
}
