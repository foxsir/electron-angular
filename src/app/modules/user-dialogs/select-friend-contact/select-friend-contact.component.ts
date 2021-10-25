import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import FriendModel from "@app/models/friend.model";
import {CacheService} from "@services/cache/cache.service";
import {Subscription} from "rxjs";
import SubscribeManage from "@app/common/subscribe-manage";


@Component({
  selector: 'app-select-friend-contact',
  templateUrl: './select-friend-contact.component.html',
  styleUrls: ['./select-friend-contact.component.scss']
})
export class SelectFriendContactComponent implements OnInit, OnDestroy {
  public friendList: FriendModel[] = [];
  public filterFriend: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number[] = [],
    private dialogRef: MatDialogRef<SelectFriendContactComponent>,
    private cacheService: CacheService,
  ) {}

  ngOnInit(): void {
    this.cacheService.getCacheFriends().then((data: Map<string, FriendModel>) => {
      data.forEach(friend => {
        // 过滤掉已经筛选过的用户
        if (!this.data || !this.data.includes(Number(friend.friendUserUid))) {
          this.friendList.push(friend);
        }
      });
    });

    SubscribeManage.run(this.cacheService.cacheUpdate$, (cache) => {
      if(cache.friendMap) {
        this.friendList.forEach(friend => {
          friend.onlineStatus = cache.friendMap.get(friend.friendUserUid.toString()).onlineStatus;
        });
      }
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

  cancel() {
    this.dialogRef.close();
  }

  confirmSelectMember(selectMember: any) {
    const selectfriends = [];
    selectMember.selectedOptions.selected.forEach(item => {
      console.log('item: ', item.friendUserUid);
      selectfriends.push(item.value);
    });

    console.log('选中的数据：', selectfriends);

    const result = {
      ok: true,
      selectfriends: selectfriends,
    }; console.dir(result);
    this.dialogRef.close(result);
  }

  ngOnDestroy() {
  }
}
