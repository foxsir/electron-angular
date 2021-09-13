import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

import redBagCloseIcon from "@app/assets/icons/red-bag-close.svg";
import redBagOpenIcon from "@app/assets/icons/red-bag-open.svg";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {AvatarService} from "@services/avatar/avatar.service";
import {CacheService} from "@services/cache/cache.service";
import {UserModel} from "@app/models/user.model";
import FriendModel from "@app/models/friend.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {GroupMemberModel} from "@app/models/group-member.model";
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
  ) { }

  ngOnInit(): void {
    this.dialogRef.addPanelClass("red-bag-dialog");
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.removePanelClass("open-red-bag-dialog");
      this.dialogRef.removePanelClass("red-bag-dialog");
    });
    this.initInfo();
    this.redBag = JSON.parse(this.data.text);
  }

  initInfo() {
    this.cacheService.getMyInfo().then(info => {
      if(this.data.uid.toString() === info.userUid.toString()) {
        this.nickName = info.nickname;
        this.avatar = this.dom.bypassSecurityTrustResourceUrl(info.userAvatarFileName);
      }
    });
    if(this.currentChatting.metadata.chatType === 'friend') {
      this.cacheService.getCacheFriends().then(friend => {
        const user = friend.get(this.data.uid);
        if(user) {
          this.nickName = user.nickname;
          this.avatar = this.dom.bypassSecurityTrustResourceUrl(user.userAvatarFileName);
        }
      });
    } else {
      this.cacheService.getGroupMembers(this.currentChatting.alarmItem.dataId).then(member => {
        const user = member.get(Number(this.data.uid));
        if(user) {
          this.nickName = user.nickname;
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

    if(this.data.uid.toString() === data.userId.toString()) {
      this.selfOpen = true;
      this.httpService.postForm(robRedPacket, data).subscribe((res: NewHttpResponseInterface<MyRedPacketInterface>) => {
        if(res.status === 200) {
          this.openedRedBag = true;
          this.dialogRef.addPanelClass("open-red-bag");
          this.myRedPacket = res.data;
        } else {
          this.snackBarService.openMessage(res.msg);
        }
      });
    } else {
      this.selfOpen = false;
      this.httpService.postForm(robRedPacket, data).subscribe((res: NewHttpResponseInterface<FriendRedPacketInterface>) => {
        if(res.status === 200) {
          this.openedRedBag = true;
          this.dialogRef.addPanelClass("open-red-bag-dialog");
          this.friendRedPacket = res.data;
          this.snackBarService.openMessage("领取成功");

          const msgContent = JSON.stringify({
            receiveId: data.userId,
            receiveName: this.localUserService.localUserInfo.nickname,
            redId: data.orderId,
            sendName: this.nickName,
          });
          this.messageService.sendMessage(MsgType.TYPE_GETREDBAG, this.currentChatting.alarmItem.dataId, msgContent).then((send) => {
            const chatMsgEntity = this.messageEntityService.prepareSendedMessage(
              send.msgBody.m, 0, send.fingerPrint, send.msgBody.ty
            );
            // this.data.fingerPrintOfProtocal;
            // this.data.xu_isRead_type = 0;
          });


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