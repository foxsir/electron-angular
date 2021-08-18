import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CacheService} from "@services/cache/cache.service";
import FriendModel from "@app/models/friend.model";

import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";

import {DomSanitizer} from "@angular/platform-browser";
import {AvatarService} from "@services/avatar/avatar.service";
import {MatSelectionList} from "@angular/material/list";
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {ImService} from "@services/im/im.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChattingModel from "@app/models/chatting.model";
import HttpResponseInterface from "@app/interfaces/http-response.interface";

interface GroupMember {
  groupUserId: string;
  isAdmin: string;
  mute: string;
  nickname: string;
  userAvatarFileName: string; // "https://strawberry-im.oss-cn-shenzhen.aliyuncs.com/default_portrait/avatar_man_288.png";
  user_uid: string;
}

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
  public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
  public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);

  public friendList: FriendModel[] = [];
  public searchFriend: string = "";
  public defaultGroupAvatar: string = this.avatarService.defaultLocalAvatar;
  public step: 'one' | 'two' = "one";

  public selectedFriends: FriendModel[] = [];
  public defaultGroupName: string = "";

  constructor(
    private router: Router,
    private dom: DomSanitizer,
    private cacheService: CacheService,
    private avatarService: AvatarService,
    private restService: RestService,
    private localUserService: LocalUserService,
  ) { }

  ngOnInit(): void {
    this.getFriendList();
  }

  /**
   * 获取好友列表
   * @param filter
   */
  getFriendList(filter: string = null) {
    this.cacheService.getCacheFriends().then(fl => {
      if(fl) {
        this.friendList = Object.values(fl).filter((item => {
          return filter === null ? true : item.nickname.includes(filter);
        }));
        this.friendList.forEach(friend => {
          this.avatarService.getAvatar(friend.friendUserUid.toString(), friend.userAvatarFileName).then(url => {
            friend.base64Avatar = url;
          });
        });
      }
    });
  }

  goBack(chatting: boolean = false) {
    if(this.step === 'two' && chatting === false) {
      this.step = 'one';
    } else {
      return this.router.navigate(['/home/message']);
    }
  }

  nextStep(friendSelect: MatSelectionList) {
    const names = [];
    this.selectedFriends = [];
    friendSelect.selectedOptions.selected.forEach(item => {
      this.selectedFriends.push(item.value);
      names.push(item.value.nickname);
    });
    this.defaultGroupName = names.join("&");
    this.step = 'two';
  }

  /**
   * 过滤好友
   */
  doSearchFriend() {
    if(this.searchFriend.length > 0) {
      setTimeout(() => {
        this.getFriendList(this.searchFriend);
      }, 500);
    }
  }

  doCreate() {
    const localUser = this.localUserService.getObj();
    const localUserUid = localUser.userId;
    const localUserNickname = "foxsir";
    const members: GroupMember[] = [];
    this.selectedFriends.forEach(friend => {
      members.push({
        groupUserId: "",
        isAdmin: "",
        mute: "",
        nickname: friend.nickname,
        userAvatarFileName: friend.userAvatarFileName,
        // "https://strawberry-im.oss-cn-shenzhen.aliyuncs.com/default_portrait/avatar_man_288.png",
        user_uid: friend.friendUserUid.toString(),
      });
    });
    this.restService.submitCreateGroupToServer(localUserUid, localUserNickname, members).subscribe((res: HttpResponseInterface) => {
      // create_time: "2021-08-17 22:22"
      // create_user_name: "普通管理员"
      // g_id: "0000000499"
      // g_member_count: "1"
      // g_name: "梅西大巴黎等"
      // g_notice: ""
      // g_notice_updatenick: ""
      // g_notice_updatetime: ""
      // g_notice_updateuid: ""
      // g_owner_name: "普通管理员"
      // g_owner_user_uid: "400070"
      // g_status: "1"
      // imIsInGroup: "-1"
      // max_member_count: "200"
      // nickname_ingroup: ""
      // worldChat: false
      const returnValue = JSON.parse(res.returnValue);
      const alarmData: AlarmItemInterface = {
        alarmItem: {
          alarmMessageType: 0,
          dataId: returnValue.g_id,
          date: new Date(returnValue.create_time).getTime().toString(),
          istop: true,
          msgContent: "",
          title: returnValue.g_name,
        },
        metadata: {
          chatType: 'group'
        }
      };
      if(res.success) {
        this.cacheService.putChattingCache(alarmData).then(() => this.goBack(true));
      }
    });
  }

}
