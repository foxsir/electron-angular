import {Component, OnInit} from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import MyGroupListInterface from "@app/interfaces/my-group-list.interface";
import {DialogService} from "@services/dialog/dialog.service";
import {MyFriendGroupComponent} from "@modules/user-dialogs/my-friend-group/my-friend-group.component";
import {DomSanitizer} from "@angular/platform-browser";

import arrowRightIcon from "@app/assets/icons/arrow-right.svg";
import {
  MyGroupChildFriendListInterface,
  MyGroupFriendListInterface
} from "@app/interfaces/my-group-friend-list.interface";
import FriendModel from "@app/models/friend.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {MatMenuTrigger} from "@angular/material/menu";
import {CacheService} from "@services/cache/cache.service";
import {SelectFriendContactComponent} from "@modules/user-dialogs/select-friend-contact/select-friend-contact.component";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";

@Component({
  selector: 'app-friend-group',
  templateUrl: './friend-group.component.html',
  styleUrls: ['./friend-group.component.scss']
})
export class FriendGroupComponent implements OnInit {
  public arrowRightIcon = this.dom.bypassSecurityTrustResourceUrl(arrowRightIcon);

  public friendGroupList: MyGroupListInterface[] = [];
  public friendListMap: Map<number, MyGroupFriendListInterface> = new Map();
  public myFriends: Map<string, FriendModel> = new Map();

  constructor(
    private restService: RestService,
    private localUserService: LocalUserService,
    private dialogService: DialogService,
    private dom: DomSanitizer,
    private currentChattingChangeService: CurrentChattingChangeService,
    private cacheService: CacheService,
    private snackBarService: SnackBarService,
  ) {
  }

  ngOnInit(): void {
    this.getGroupList();
    this.cacheService.getCacheFriends().then(res => {
      this.myFriends = res;
    });
  }

  getGroupList() {
    this.restService.getFriendGroupList().subscribe((res: NewHttpResponseInterface<MyGroupListInterface[]>) => {
      if(res.status === 200) {
        this.friendGroupList = res.data;
      }
    });
  }

  createGroup() {
    this.dialogService.openDialog(MyFriendGroupComponent, {
      width: "314px"
    }).then(() => {
      this.getGroupList();
    });
  }

  loadFriendList(groupId: number) {
    this.restService.getFriendGroupFriends(groupId).subscribe((res: NewHttpResponseInterface<MyGroupFriendListInterface>) => {
      if(res.status === 200) {
        this.friendListMap.set(groupId, res.data);
      }
    });
  }

  // switchChatting(friendId: number, nickname: string, avatar: string) {
  //   const alarm: AlarmItemInterface = {
  //     alarmItem: {
  //       alarmMessageType: 0, // 0单聊 1临时聊天/陌生人聊天 2群聊
  //       dataId: friendId.toString(),
  //       date: "",
  //       msgContent: "",
  //       title: nickname,
  //       avatar: avatar,
  //     },
  //     // 聊天元数据
  //     metadata: {
  //       chatType: "friend", // "friend" | "group"
  //     },
  //   };
  //   this.currentChattingChangeService.switchCurrentChatting(alarm).then();
  // }

  contextMenuForGroup(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement) {
    this.contextMenu(e, menu, span);
    return e.defaultPrevented;
  }

  contextMenuForFriend(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement) {
    // switchChatting(friend.friendId, friend.nickname, friend.userAvatarFileName)
    this.contextMenu(e, menu, span);
    return e.defaultPrevented;
  }

  private contextMenu(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement) {
    menu.openMenu();
    span.style.position = "fixed";
    span.style.top = "0px";
    span.style.left = "0px";
    span.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
  }

  addFriends(group: MyGroupListInterface) {
    const filterFriendId: number[] = [];
    this.friendListMap.get(group.groupId).list.forEach(item=>{
      filterFriendId.push(item.friendId);
    });
    this.dialogService.openDialog(SelectFriendContactComponent,{data:filterFriendId,width: '314px',panelClass: "padding-less-dialog"}).then((friend:{ok: boolean,selectfriends:FriendModel[]}) => {
      if(friend.selectfriends.length==0) return;
      if(friend.ok) {
        const friList=new Array();
        friend.selectfriends.forEach(fri => {
          friList.push(fri.friendUserUid);
        });
        this.restService.updateFriendGroupMembers(group.groupId, 'add', friList).subscribe((res: NewHttpResponseInterface<any>) => {
          this.snackBarService.openMessage(res.msg);
          this.loadFriendList(group.groupId);
          this.getGroupList();
        });
      }
    });
  }

  updateGroupName(group: MyGroupListInterface) {
    this.dialogService.openDialog(MyFriendGroupComponent, {
      width: "314px",
      data: {groupId: group.groupId, groupName: group.groupName}
    }).then(() => {
      this.getGroupList();
    });
  }

  deleteGroup(group: MyGroupListInterface) {
    this.dialogService.confirm({text: ['删除：', group.groupName, ' 分组'].join("")}).then(ok => {
      if(ok) {
        this.restService.deleteFriendGroupList(group.groupId).subscribe((res: NewHttpResponseInterface<any>) => {
          this.snackBarService.openMessage(res.msg);
          this.getGroupList();
        });
      }
    });
  }

  removeFriend(group: MyGroupListInterface, friend: MyGroupChildFriendListInterface) {
    this.dialogService.confirm({text: ['将好友：', friend.nickname, ' 移出分组'].join("")}).then(ok => {
      if(ok) {
        this.restService.updateFriendGroupMembers(group.groupId, 'del', [friend.friendId])
          .subscribe((res: NewHttpResponseInterface<any>) => {
            this.snackBarService.openMessage(res.msg);
            this.loadFriendList(group.groupId);
            this.getGroupList();
          });
      }
    });
  }

}
