import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

import redBagCloseIcon from "@app/assets/icons/red-bag-close.svg";
import redBagOpenIcon from "@app/assets/icons/red-bag-open.svg";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {AvatarService} from "@services/avatar/avatar.service";
import {CacheService} from "@services/cache/cache.service";
import {RedPacketResponseInterface} from "@app/interfaces/red-packet-response.interface";
import {HttpService} from "@services/http/http.service";
import {robRedPacket} from "@app/config/post-api";
import {LocalUserService} from "@services/local-user/local-user.service";
import {FriendRedPacketInterface, MyRedPacketInterface} from "@app/interfaces/open-red-packet.interface";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {MessageService} from "@services/message/message.service";
import {MsgType} from "@app/config/rbchat-config";
import {MessageEntityService} from "@services/message-entity/message-entity.service";

@Component({
  selector: 'app-red-bag',
  templateUrl: './red-bag.component.html',
  styleUrls: ['./red-bag.component.scss']
})
export class RedBagComponent implements OnInit {
  public redBagCloseIcon = this.dom.bypassSecurityTrustResourceUrl(redBagCloseIcon);
  public redBagOpenIcon = this.dom.bypassSecurityTrustResourceUrl(redBagOpenIcon);

  public currentChatting = this.currentChattingChangeService.currentChatting;
  public nickName: string = "";
  public avatar: SafeResourceUrl = this.dom.bypassSecurityTrustResourceUrl(
    this.avatarService.defaultLocalAvatar
  );

  public redBag: RedPacketResponseInterface;

  public selfOpen = false;
  public myRedPacket: MyRedPacketInterface;
  public friendRedPacket: FriendRedPacketInterface;
  public openedRedBag = false;

  constructor(
    public dialogRef: MatDialogRef<RedBagComponent, Partial<boolean>>,
    @Inject(MAT_DIALOG_DATA) public data: ChatmsgEntityModel,
    private dom: DomSanitizer,
    private avatarService: AvatarService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private cacheService: CacheService,
    private httpService: HttpService,
    private localUserService: LocalUserService,
    private snackBarService: SnackBarService,
    private messageService: MessageService,
    private messageEntityService: MessageEntityService,
  ) {
  }

  ngOnInit(): void {
    this.dialogRef.addPanelClass("red-bag-dialog");
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.removePanelClass("open-red-bag-dialog");
      this.dialogRef.removePanelClass("red-bag-dialog");
    });
    this.initInfo();
    this.redBag = JSON.parse(this.data.text);

    const data = {
      orderId: this.redBag.orderId,
      userId: this.localUserService.localUserInfo.userId
    };
    if(this.redBag.status === '2') {
      this.httpService.postForm(robRedPacket, data).subscribe((res: NewHttpResponseInterface<FriendRedPacketInterface>) => {
        if (res.status === 200) {
          this.openedRedBag = true;
          this.dialogRef.addPanelClass("open-red-bag-dialog");
          this.friendRedPacket = res.data;
        } else {
          this.snackBarService.openMessage(res.msg);
        }
      });
    }
  }

  initInfo() {
    this.cacheService.getMyInfo().then(info => {
      if (this.data.uid.toString() === info.userUid.toString()) {
        this.nickName = info.nickname;
        this.avatar = this.dom.bypassSecurityTrustResourceUrl(info.userAvatarFileName);
      }
    });
    if (this.currentChatting.metadata.chatType === 'friend') {
      this.cacheService.getCacheFriends().then(friend => {
        const user = friend.get(this.data.uid);
        if (user) {
          this.nickName = user.nickname;
          this.avatar = this.dom.bypassSecurityTrustResourceUrl(user.userAvatarFileName);
        }
      });
    } else {
      this.cacheService.getGroupMembers(this.currentChatting.alarmItem.dataId).then(member => {
        const user = member.get(this.data.uid);
        if (user) {
          this.nickName = user.showNickname;
          this.avatar = this.dom.bypassSecurityTrustResourceUrl(user.userAvatarFileName);
        }
      });
    }
  }

  openRedBag() {
    const data = {
      orderId: this.redBag.orderId,
      userId: this.localUserService.localUserInfo.userId
    };

    if (this.data.uid.toString() === data.userId.toString() && this.currentChatting.metadata.chatType === 'friend') {
      this.selfOpen = true;
      this.httpService.postForm(robRedPacket, data).subscribe((res: NewHttpResponseInterface<MyRedPacketInterface>) => {
        if (res.status === 200) {
          this.dialogRef.addPanelClass("open-red-bag");
          this.myRedPacket = res.data;
          this.openedRedBag = true;
        } else {
          this.snackBarService.openMessage(res.msg);
        }
      });
    } else {
      this.selfOpen = false;
      this.httpService.postForm(robRedPacket, data).subscribe((res: NewHttpResponseInterface<FriendRedPacketInterface>) => {
        if (res.status === 200) {
          this.openedRedBag = true;
          this.dialogRef.addPanelClass("open-red-bag-dialog");
          this.friendRedPacket = res.data;
          this.snackBarService.openMessage("领取成功");
          this.redBag.status = '2';
          this.data.text = JSON.stringify(this.redBag);
          this.cacheService.putChattingCache(this.currentChatting, this.data).then();
          // this.cacheService.chatMsgEntityMap.set(this.data.fingerPrintOfProtocal, this.data);
          this.cacheService.putMsgEntityMap(this.data);
        } else {
          this.snackBarService.openMessage(res.msg);
        }
      });
    }
  }

  close() {
    this.dialogRef.close(false);
  }

}
