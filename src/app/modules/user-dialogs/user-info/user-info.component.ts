import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import FriendModel from "@app/models/friend.model";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {UserModel} from "@app/models/user.model";

import arrowRight from "@app/assets/icons/arrow-right.svg";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CacheService} from "@services/cache/cache.service";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {MsgType} from "@app/config/rbchat-config";
import {AddFriendComponent} from "@modules/user-dialogs/add-friend/add-friend.component";
import {FriendAddWay} from "@app/config/friend-add-way";
import {LocalUserService} from "@services/local-user/local-user.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {DialogService} from "@services/dialog/dialog.service";
import {MessageService} from "@services/message/message.service";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  public user: UserModel;
  public userInfo: FriendModel = new FriendModel();
  public friendRemark: string = "没有备注";
  public onlineStatus: string = "[在线]";

  loading = true;

  public arrowRight: SafeResourceUrl = this.dom.bypassSecurityTrustResourceUrl(arrowRight)

  // 判断是否已经是好友
  isFriend: boolean;

  constructor(
    public dialogRef: MatDialogRef<UserInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {userId: number},
    private dom: DomSanitizer,
    private restService: RestService,
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private localUserService: LocalUserService,
    private snackBarService: SnackBarService,
    private dialogService: DialogService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.checkIsFriend();
  }

  getUserInfo() {
    this.restService.getUserBaseById(this.data.userId.toString()).subscribe((res: NewHttpResponseInterface<UserModel>) => {
      if(res.status === 200 && res.data) {
        this.user = res.data;
        this.restService.getRemark({ toUserId: this.user.userUid }).subscribe((mark: NewHttpResponseInterface<string>) => {
          if(mark.status === 200) {
            this.friendRemark = mark.data || this.friendRemark;
          }
        });

        this.restService.getFriendInfo(this.data.userId).subscribe((info: NewHttpResponseInterface<FriendModel>) => {
          if(info.status === 200) {
            this.userInfo = info.data;
            this.onlineStatus = info.data.onlineStatus ? '[离线]' : '[在线]';
          }
        });
      }
      this.loading = false;
    });
  }

  close() {
    this.dialogRef.close();
  }

  checkIsFriend() {
    this.cacheService.getCacheFriends().then(friends => {
      if (friends.get(this.data.userId.toString())) {
        this.isFriend = true;
      } else {
        this.isFriend = false;
      }
    });
  }

  sendMessage() {
    this.cacheService.generateAlarmItem(this.user.userUid.toString(), 'friend', null, MsgType.TYPE_TEXT).then(alarm => {
      this.cacheService.putChattingCache(alarm).then(() => {
        this.currentChattingChangeService.switchCurrentChatting(alarm).then(() => {
          this.dialogRef.close();
        });
      });
    });
  }

  friendRequest() {
    this.cacheService.getCacheFriends().then(data => {
      if (this.data.userId.toString() === this.localUserService.localUserInfo.userId.toString()) {
        this.snackBarService.openMessage("不能添加自己为好友");
      } else if(data[this.data.userId.toString()]) {
        this.snackBarService.openMessage("已经是好友");
      } else {
        this.dialogService.openDialog(AddFriendComponent, {
          data: this.userInfo, width: '314px',panelClass: "padding-less-dialog"
        }).then((res: any) => {
          if (res && res.ok === true) {
            this.messageService.addFriend(FriendAddWay.search, {
              friendUserUid: this.userInfo.friendUserUid,
              desc: res.txtMsg
            }).then(re => {
              if(re.success) {
                this.snackBarService.openMessage("已经发送请求");
                this.dialogRef.close();
              } else {
                this.snackBarService.openMessage("请稍后重试");
              }
              this.userInfo = null;
            });
          }
        });

      }
    });
  }

}
