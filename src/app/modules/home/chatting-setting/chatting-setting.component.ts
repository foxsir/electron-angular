import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";
import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import arrowRightIcon from "@app/assets/icons/arrow-right.svg";
import { RestService } from "@services/rest/rest.service";
import { DemoDialogComponent } from "@modules/setting-dialogs/demo-dialog/demo-dialog.component";
import { DialogService } from "@services/dialog/dialog.service";
import { CurrentChattingChangeService } from "@services/current-chatting-change/current-chatting-change.service";
import {Subscription} from "rxjs";
import FriendModel from "../../../../../app/entitys/friend.model";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {CacheService} from "@services/cache/cache.service";

@Component({
    selector: 'app-chatting-setting',
    templateUrl: './chatting-setting.component.html',
    styleUrls: ['./chatting-setting.component.scss']
})
export class ChattingSettingComponent implements OnInit,OnDestroy {
    @Input() currentChat: AlarmItemInterface;
    @Input() drawer: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);
    public arrowRightIcon = this.dom.bypassSecurityTrustResourceUrl(arrowRightIcon);

    public friendInfo: FriendModel;

    private dialogConfig = {
        width: '314px'
    };

  public currentSubscription: Subscription;

    constructor(
        private dom: DomSanitizer,
        private restService: RestService,
        private dialogService: DialogService,
        private currentChattingChangeService: CurrentChattingChangeService,
        private snackBarService: SnackBarService,
        private cacheService: CacheService,
    ) {
       this.currentSubscription = this.currentChattingChangeService.currentChatting$.subscribe(currentChat => {
          if(currentChat && this.currentChat.alarmItem.dataId !== currentChat.alarmItem.dataId) {
            console.log('单聊会话切换...');
            console.log("当前会话id:"+this.currentChat.alarmItem.dataId+",切换到的会话id:"+currentChat.alarmItem.dataId);
            this.currentChat = currentChat;
            this.initData();
          }
        });
    }

    initData() {
        console.log('currentChat ngOnInit（私聊设置页面）: ', this.currentChat);
        if (this.currentChat.metadata.chatType === 'group') {
            return;
        }

        this.restService.getFriendInfo(Number(this.currentChat.alarmItem.dataId)).subscribe(res => {
            console.log('getFriendInfo result: ', res);
            if (res.status === 200 && res.data) {
              this.friendInfo = res.data;
              this.friendInfo.whatSUp = this.friendInfo.whatSUp == null || this.friendInfo.whatSUp.length == 0 ? '此人很懒，什么都没留下' : this.friendInfo.whatSUp;
            }
        });
    }



    ngOnInit(): void {
        this.initData();
    }

    changeRemark() {
        //this.dialogService.openDialog(DemoDialogComponent, {
        //    data: {
        //        two: 'xxx'
        //    }
        //});

        const data = {
            one: 'xxx',
            remark: this.friendInfo.remark
        };

        this.dialogService.openDialog(DemoDialogComponent, { data: data }).then((res: any) => {
            if (res.ok == true) {
                const post_data = {
                    toUserId: this.currentChat.alarmItem.dataId,
                    remark: res.remark,
                };

                this.restService.updRemark(post_data).subscribe(res => {
                    this.friendInfo.remark = post_data.remark;
                    // 然后更新会话的标题
                    this.cacheService.upFriendRemark(this.friendInfo.friendUserUid, this.friendInfo.remark);
                    if (this.currentChat.alarmItem.dataId == this.friendInfo.friendUserUid.toString()) {
                      this.currentChat.alarmItem.title = this.friendInfo.remark;
                    }
                });
            }
        });
    }

  ngOnDestroy() {
    this.currentSubscription.unsubscribe();
  }
  formatDate(date,format) {
    if (["string", "number"].includes(typeof date)) {
      date = new Date(Number(date));
    }
    if(date === null) {
      date = new Date();
    }
    // 格式化时间
    const year = date.getFullYear(),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      sdate = ("0" + date.getDate()).slice(-2),
      hour = ("0" + date.getHours()).slice(-2),
      minute = ("0" + date.getMinutes()).slice(-2);
    // 拼接
    const result = year + "-"+ month +"-"+ sdate +" "+ hour +":"+ minute;
    // 返回
    return result;
  }
}
