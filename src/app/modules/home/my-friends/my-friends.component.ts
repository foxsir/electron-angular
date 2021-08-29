import { Component, OnInit } from '@angular/core';
import {CacheService} from "@services/cache/cache.service";

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.scss']
})
export class MyFriendsComponent implements OnInit {

  constructor(
    private cacheService: CacheService
  ) { }

  ngOnInit(): void {
    // 好友使用缓存中的数据
    // 我的群组组件有点击切换到聊天的示例 group.component.ts
    this.cacheService.getCacheFriends().then(data => {
      if(data) {
        // this.friendList = Object.values(data);
      }
    });
  }

}
