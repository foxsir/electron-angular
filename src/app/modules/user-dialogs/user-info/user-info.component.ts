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

  constructor(
    public dialogRef: MatDialogRef<UserInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {userId: number},
    private dom: DomSanitizer,
    private restService: RestService,
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
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

  sendMessage() {
    this.cacheService.generateAlarmItem(this.user.userUid.toString(), 'friend', null, MsgType.TYPE_TEXT).then(alarm => {
      this.cacheService.putChattingCache(alarm).then(() => {
        this.currentChattingChangeService.switchCurrentChatting(alarm).then(() => {
          this.dialogRef.close();
        });
      });
    });
  }

}
