import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {CacheService} from "@services/cache/cache.service";
import FriendModel from "@app/models/friend.model";

@Component({
  selector: 'app-transmit-message',
  templateUrl: './transmit-message.component.html',
  styleUrls: ['./transmit-message.component.scss']
})
export class TransmitMessageComponent implements OnInit {
  public filterFriend: string;
  public friendList: FriendModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<TransmitMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChatmsgEntityModel[],
    private cacheService: CacheService
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

  cancel() {
    this.dialogRef.close(false);
  }

}
