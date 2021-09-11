import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import FriendModel from "@app/models/friend.model";
import {CacheService} from "@services/cache/cache.service";

@Component({
  selector: 'app-select-friend-contact',
  templateUrl: './select-friend-contact.component.html',
  styleUrls: ['./select-friend-contact.component.scss']
})
export class SelectFriendContactComponent implements OnInit {
  public friendList: FriendModel[] = [];
  public filterFriend: string = "";

  constructor(
    private dialogRef: MatDialogRef<SelectFriendContactComponent>,
    private cacheService: CacheService,
  ) {}

  ngOnInit(): void {
    this.cacheService.getCacheFriends().then(data => {
      data.forEach(friend => {
        this.friendList.push(friend);
      });
    });
  }

  filter() {
    this.cacheService.getCacheFriends().then(data => {
      this.friendList = Object.values(data).filter(
        (friend: FriendModel) => friend.nickname.includes(this.filterFriend)
      ) as FriendModel[];
    });
  }

  select(friendList: FriendModel) {
    this.dialogRef.close(friendList);
  }

}
