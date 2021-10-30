import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {CacheService} from "@services/cache/cache.service";
import FriendModel from "@app/models/friend.model";
import {MatSelectionList} from "@angular/material/list";
import {ReplyMessageChildMessage} from "@app/interfaces/reply-message.interface";
import {MessageService} from "@services/message/message.service";
import {ChatModeType, MsgType} from "@app/config/rbchat-config";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {GroupModel} from "@app/models/group.model";

@Component({
  selector: 'app-transmit-message',
  templateUrl: './transmit-message.component.html',
  styleUrls: ['./transmit-message.component.scss']
})
export class TransmitMessageComponent implements OnInit {
  public filterFriend: string = "";

  public friends: any[] = [];
  public selectedFriends: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<TransmitMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChatmsgEntityModel[],
    private cacheService: CacheService,
    private messageService: MessageService,
    private messageEntityService: MessageEntityService,
    private currentChattingChangeService: CurrentChattingChangeService,
  ) { }

  ngOnInit(): void {
    this.cacheService.getCacheFriends().then((friendMap: Map<string, FriendModel>) => {
      if(friendMap) {
        friendMap.forEach(f =>{
          this.friends.push({id:f.friendUserUid, name:f.nickname,imgbase64:f.base64Avatar,img:f.userAvatarFileName,online:f.onlineStatus?1:2});
        });

        this.cacheService.getCacheGroups().then((groups: Map<string, GroupModel>) => {
          if(groups){
            groups.forEach( g =>{
              this.friends.push({id: g.gid, name:g.gname,imgbase64:null,img:g.avatar,online:3});
            });
            console.dir(this.friends);
          }
        });
      }
    });
  }

  /*
  filter() {
    this.cacheService.getCacheFriends().then(data => {
      if(data) {
        data.forEach((friend: FriendModel) => {
          if(friend.nickname.includes(this.filterFriend)) {
            this.friendMap.set(friend.friendUserUid.toString(), friend);
          }
        });
      }
      console.log(this.friendMap)
    });
  }
  *
   */

  async nextStep(friendSelect: MatSelectionList) {
    const names = [];
    this.selectedFriends = [];
    friendSelect.selectedOptions.selected.forEach(item => {
      this.selectedFriends.push(item.value);
      names.push(item.value.name);
    });

    // const merge: ReplyMessageChildMessage[] = [];
    await this.data.forEach(msg => {
      const newMsg: ReplyMessageChildMessage = {
        date: msg.date,
        sendId: msg.uid,
        sendNicName: msg.name,
        text: msg.text,
        type: msg.msgType,
      };
      this.selectedFriends.forEach(friend => {
        this.messageService.sendMessage(msg.msgType, friend.value.id, newMsg.text).then((res) => {
          if(res.success === true) {
            const alarmData: AlarmItemInterface = {
              alarmItem: {
                alarmMessageType: ChatModeType.CHAT_TYPE_FRIEND$CHAT,
                dataId: friend.value.id.toString(),
                date: msg.date,
                msgContent: MessageService.parseMessageForShow(msg.text, msg.msgType),
                title: friend.remark?friend.remark:friend.value.name,
                avatar: null,
              },
              metadata: {
                chatType: 'friend'
              }
            };
            const message = res.msgBody.m;
            const chatMsgEntity = this.messageEntityService.prepareSendedMessage(
              message, 0, res.fingerPrint, msg.msgType
            );
            alarmData.alarmItem.avatar = friend.value.img;
            this.cacheService.putChattingCache(alarmData, chatMsgEntity).then(() => {
              this.currentChattingChangeService.switchCurrentChatting(alarmData).then(() => {
                this.dialogRef.close(true);
              });
            });
          }
        });
      });
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

}
