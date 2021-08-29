import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {CacheService} from "@services/cache/cache.service";
import FriendModel from "@app/models/friend.model";
import {MatSelectionList} from "@angular/material/list";
import {ReplyMessageChildMessage} from "@app/interfaces/reply-message.interface";
import {MessageService} from "@services/message/message.service";
import {MsgType} from "@app/config/rbchat-config";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";

@Component({
  selector: 'app-transmit-message',
  templateUrl: './transmit-message.component.html',
  styleUrls: ['./transmit-message.component.scss']
})
export class TransmitMessageComponent implements OnInit {
  public filterFriend: string;
  public friendList: FriendModel[] = [];

  public selectedFriends: FriendModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<TransmitMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChatmsgEntityModel[],
    private cacheService: CacheService,
    private messageService: MessageService,
    private messageEntityService: MessageEntityService,
    private currentChattingChangeService: CurrentChattingChangeService,
  ) { }

  ngOnInit(): void {
    this.cacheService.getCacheFriends().then(data => {
      if(data) {
        this.friendList = Object.values(data);
      }
    });
  }

  filter() {
    this.cacheService.getCacheFriends().then(data => {
      if(data) {
        const list = Object.values(data);
        this.friendList = list.filter((friend: FriendModel) => {
          return friend.nickname.includes(this.filterFriend);
        }) as FriendModel[];
      }
    });
  }

  async nextStep(friendSelect: MatSelectionList) {
    const names = [];
    this.selectedFriends = [];
    friendSelect.selectedOptions.selected.forEach(item => {
      this.selectedFriends.push(item.value);
      names.push(item.value.nickname);
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
        this.messageService.sendMessage(msg.msgType, friend.friendUserUid, newMsg.text).then((res) => {
          if(res.success === true) {
            const alarmData: AlarmItemInterface = {
              alarmItem: {
                alarmMessageType: 0,
                dataId: friend.friendUserUid.toString(),
                date: new Date().getTime().toString(),
                istop: true,
                msgContent: newMsg.text,
                title: friend.nickname,
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
            chatMsgEntity.isOutgoing = false;
            this.cacheService.getCacheFriends().then(list => {
              const fm: FriendModel = list[alarmData.alarmItem.dataId];
              alarmData.alarmItem.avatar = fm.userAvatarFileName;
              this.cacheService.putChattingCache(alarmData, chatMsgEntity).then(() => {
                this.currentChattingChangeService.switchCurrentChatting(alarmData);
                this.dialogRef.close();
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
