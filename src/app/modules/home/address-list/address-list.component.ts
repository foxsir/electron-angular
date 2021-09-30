import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RosterProviderService} from "@services/roster-provider/roster-provider.service";
import FriendModel from "@app/models/friend.model";
import {DomSanitizer} from "@angular/platform-browser";

// import image
import editIcon from "@app/assets/icons/edit.svg";
import newFriendIcon from "@app/assets/icons/new-friend.svg";
import blackListIcon from "@app/assets/icons/black-list.svg";
import collectIcon from "@app/assets/icons/collect-circle.svg";
import groupChattingIcon from "@app/assets/icons/group-chatting-circle.svg";
import myFriend from "@app/assets/icons/my-friend.svg";
import {MatDrawer} from "@angular/material/sidenav";
import {MiniUiService} from "@services/mini-ui/mini-ui.service";
import rightArrowIcon from "@app/assets/icons/rightarr.svg";
import rightArrowActiveIcon from "@app/assets/icons/rightarr.svg";
// import image end

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit, AfterViewInit {
  @ViewChild("addressListPanel") private addressListPanel: MatDrawer;
  friendList: FriendModel[] = [];

  public drawerMode: 'side' | 'over' = 'side';
  public isMiniUI: boolean = false;
  public rightArrowIcon = this.dom.bypassSecurityTrustResourceUrl(rightArrowIcon);
  public rightArrowActiveIcon = this.dom.bypassSecurityTrustResourceUrl(rightArrowActiveIcon);

  leftMenuList = [
    {
      label: "新朋友",
      router: 'new-friend',
      icon: this.dom.bypassSecurityTrustResourceUrl(newFriendIcon)
      },
      {
          label: "我的好友",
          router: 'my-friends',
          icon: this.dom.bypassSecurityTrustResourceUrl(myFriend)
      },
    {
      label: "我的群组",
      router: 'group',
      icon: this.dom.bypassSecurityTrustResourceUrl(groupChattingIcon)
    },
    {
      label: "我的分组",
        router: 'friend-group',
      icon: this.dom.bypassSecurityTrustResourceUrl(collectIcon)
    },
    {
      label: "收藏",
      router: 'collect',
      icon: this.dom.bypassSecurityTrustResourceUrl(newFriendIcon)
    },
    {
      label: "黑名单",
      router: 'black-list',
      icon: this.dom.bypassSecurityTrustResourceUrl(blackListIcon)
    },
  ];

  // image
  public editIcon = this.dom.bypassSecurityTrustResourceUrl(editIcon);
  public newFriendIcon = this.dom.bypassSecurityTrustResourceUrl(newFriendIcon);

  constructor(
    private rosterProviderService: RosterProviderService,
    private dom: DomSanitizer,
    private miniUiService: MiniUiService,
  ) { }

  ngOnInit(): void {
    // this.getFriendList();
  }

  ngAfterViewInit() {
    this.listenMiniUI();
  }

  listenMiniUI() {
    this.addressListPanel.open().then();
    this.drawerMode = this.miniUiService.isMini ? 'over' : 'side';
    this.miniUiService.addressListDrawer$.subscribe(open => {
      if(open) {
        this.addressListPanel.open().then();
      } else {
        this.addressListPanel.close().then();
      }
    });
    this.miniUiService.mini$.subscribe((mini) => {
      this.isMiniUI = mini;
      this.drawerMode = mini ? 'over' : 'side';
    });
  }

  // getFriendList() {
  //   this.rosterProviderService.refreshRosterAsync().subscribe(res => {
  //     // 服务端返回的是一维RosterElementEntity对象数组
  //     this.friendList = JSON.parse(res.returnValue);
  //   });
  // }

}
