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

@Component({
  selector: 'app-transmit-message',
  templateUrl: './transmit-message.component.html',
  styleUrls: ['./transmit-message.component.scss']
})
export class TransmitMessageComponent implements OnInit {
  public filterFriend: string;
  public friendMap: Map<string, FriendModel> = new Map();

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
        this.friendMap = data;
      }
    });
  }

  filter() {
    this.cacheService.getCacheFriends().then(data => {
      if(data) {
        data.forEach((friend: FriendModel) => {
          if(friend.nickname.includes(this.filterFriend)) {
            this.friendMap.set(friend.friendUserUid.toString(), friend);
          }
        });
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
                alarmMessageType: ChatModeType.CHAT_TYPE_FRIEND$CHAT,
                dataId: friend.friendUserUid.toString(),
                date: msg.date.toString(),
                msgContent: this.messageService.parseMessageForShow(msg.text, msg.msgType),
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
            // chatMsgEntity.isOutgoing = false;
            this.cacheService.getCacheFriends().then(list => {
              const fm: FriendModel = list.get(friend.friendUserUid.toString());
              alarmData.alarmItem.avatar = fm.userAvatarFileName;
              this.cacheService.putChattingCache(alarmData, chatMsgEntity).then(() => {
                this.currentChattingChangeService.switchCurrentChatting(alarmData).then(() => {
                  this.dialogRef.close(true);
                });
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
