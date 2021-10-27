import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {GroupModel} from "@app/models/group.model";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {DialogService} from "@services/dialog/dialog.service";
import {Subscription} from "rxjs";
import SubscribeManage from "@app/common/subscribe-manage";

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
export class CreateGroupComponent implements OnInit, OnDestroy {
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
    private currentChattingChangeService: CurrentChattingChangeService,
    private snackBarService: SnackBarService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.getFriendList();
    SubscribeManage.run(this.cacheService.cacheUpdate$, (cache) => {
      if(cache.friendMap) {
        this.friendList.forEach(friend => {
          friend.onlineStatus = cache.friendMap.get(friend.friendUserUid.toString()).onlineStatus;
        });
      }
    });

    // SubscribeManage.run(this.cacheService.cacheUpdate$,(cache) => {
    //   if(cache.friendMap) {
    //     this.friendList.forEach(friend => {
    //       friend.onlineStatus = cache.friendMap.get(friend.friendUserUid.toString()).onlineStatus;
    //     });
    //   }
    // });
  }

  /**
   * 获取好友列表
   * @param filter
   */
  getFriendList(filter: string = null) {
    this.cacheService.getCacheFriends().then((friendMap: Map<string, FriendModel>) => {
      if(friendMap.size > 0) {
        // 赋值前先清空，避免重复叠加数据
        this.friendList = [];
        friendMap.forEach(item => {
          if(filter === null) {
            this.friendList.push(item);
          } else if(item.nickname.includes(filter)) {
            this.friendList.push(item);
          }
        });
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

    if(names.length<=0){
      this.dialogService.alert({ title: '请选择群成员!',text: '请选择群成员！' }).then(() => {});
      return;
    }

    this.defaultGroupName = names.join("&");
    //this.step = 'two';

    this.doCreate();
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
        console.log('登录的用户信息：', localUser);
        //return;

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

        members.push({
            groupUserId: "",
            isAdmin: "",
            mute: "",
            nickname: localUser.nickname,
            userAvatarFileName: localUser.userAvatarFileName,
            user_uid: localUser.userId.toString(),
        });

        this.restService.submitCreateGroupToServer(localUserUid, localUser.nickname, members).subscribe((res: HttpResponseInterface) => {
            const returnValue = JSON.parse(res.returnValue);
            const alarmData: AlarmItemInterface = {
                alarmItem: {
                    alarmMessageType: 0,
                    dataId: returnValue.g_id,
                    date: new Date(returnValue.create_time).getTime(),
                    msgContent: "",
                    title: returnValue.g_name,
                    avatar: returnValue.avatar,
                },
                metadata: {
                    chatType: 'group'
                }
            };
            if (res.success) {
              this.cacheService.cacheGroups().then();
              this.cacheService.putChattingCache(alarmData).then(() => {
                this.cacheService.cacheGroupAdmins(alarmData.alarmItem.dataId.toString()).then();
                this.cacheService.cacheGroupMembers(alarmData.alarmItem.dataId.toString()).then();
                this.currentChattingChangeService.switchCurrentChatting(alarmData).then(() => {
                  this.snackBarService.openMessage("群创建成功");
                });
              });
            }
        });
    }

    ngOnDestroy() {
    }

}
