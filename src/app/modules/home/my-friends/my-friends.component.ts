import {Component, OnInit} from '@angular/core';
import {CacheService} from "@services/cache/cache.service";
import {RestService} from "@services/rest/rest.service";
import FriendModel from "@app/models/friend.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {Router} from "@angular/router";

const iconv = window.require('iconv-lite');

class FriendData {
  public char: string;
  // 使用map保证 FriendModel 唯一
  public list: Map<number, FriendModel> = new Map();
}

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.scss']
})
export class MyFriendsComponent implements OnInit {

  public friendList: FriendModel[] = [];
  public frienddata: FriendData[] = [];

  public numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  public letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  constructor(
    private cacheService: CacheService,
    private restService: RestService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // 好友使用缓存中的数据
    // 我的群组组件有点击切换到聊天的示例 group.component.ts
    //const buf = iconv.encode("你", 'gb2312');
    //console.dir(buf);
    //console.log('gb2312: ', this.getLetter('你'));

    this.cacheService.getCacheFriends().then(data => {
      if(data) {
        this.showFriend(data);
      }
    });

    // 监听好友变化
    this.cacheService.cacheUpdate$.subscribe(cache => {
      if(cache.friendMap) {
        this.showFriend(cache.friendMap);
      }
    });
  }

  showFriend(data: Map<string, FriendModel>) {
    this.friendList = [];
    data.forEach(item => {
      this.friendList.push(item);
    });
    console.log('我的好友 data：', data);
    console.log('我的好友 list：', this.friendList);

    for (let item of this.friendList) {
      var first_char = item.nickname[0].toString().toUpperCase();

      if (this.numbers.indexOf(first_char) == -1 && this.letters.indexOf(first_char) == -1) {
        first_char = this.getLetter(first_char);
      }

      var results = this.frienddata.filter(t => t.char == first_char);
      if (results.length == 0) {
        var model = new FriendData();
        model.char = first_char;
        model.list.set(item.friendUserUid, item);
        this.frienddata.push(model);
      } else {
        results[0].list.set(item.friendUserUid, item);
      }
    }

    this.frienddata = this.frienddata.sort((n1, n2) => {
      var flag = 0;
      if (n1.char > n2.char) {
        flag = 1;
      } else if (n1.char < n2.char) {
        flag = -1;
      }
      return flag;
    });

    console.log('我的好友 list 格式化之后：', this.frienddata);
  }

  getLetter(str) {
    const buf = iconv.encode(str, 'gb2312');
    var num = parseInt(buf[0], 10) * 256 + parseInt(buf[1], 10);

    // iCnChar match the constant
    var letter = "ABCDEFGHJKLMNOPQRSTWXYZ";
    var areacode = [
      45217, 45253, 45761, 46318, 46826, 47010, 47297, 47614,
      48119, 49062, 49324, 49896, 50371, 50614, 50622, 50906,
      51387, 51446, 52218, 52698, 52980, 53689, 54481, 55290];

    for (var i = 0; i < 23; i++) {
      if (areacode[i] <= num && num < areacode[i + 1]) {
        str = letter.substr(i, 1);
        break;
      }
    }

    return str;
  }

  switchChatting(item: FriendModel) {
    const alarm: AlarmItemInterface = {
      alarmItem: {
        alarmMessageType: 0, // 0单聊 1临时聊天/陌生人聊天 2群聊
        dataId: item.friendUserUid.toString(),
        date: new Date().getTime(),
        msgContent: "",
        title: item.nickname,
        avatar: item.userAvatarFileName,
      },
      // 聊天元数据
      metadata: {
        chatType: "friend", // "friend" | "group"
      },
    };
    this.cacheService.putChattingCache(alarm).then(() => {
      this.currentChattingChangeService.switchCurrentChatting(alarm).then();
    });
  }

}
