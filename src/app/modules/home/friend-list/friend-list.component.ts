import { Component, OnInit } from '@angular/core';
import {RosterProviderService} from "@services/roster-provider/roster-provider.service";
import Friend from "@app/models/Friend";

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {
  friendList: Friend[] = [];

  constructor(
    private rosterProviderService: RosterProviderService
  ) { }

  ngOnInit(): void {
    this.getFriendList();
  }

  getFriendList() {
    this.rosterProviderService.refreshRosterAsync().subscribe(res => {
      console.log(res);
      // 服务端返回的是一维RosterElementEntity对象数组
      this.friendList = JSON.parse(res.returnValue);
    });
  }

}
