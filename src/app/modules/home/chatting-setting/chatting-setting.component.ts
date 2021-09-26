import { Component, Input, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-chatting-setting',
    templateUrl: './chatting-setting.component.html',
    styleUrls: ['./chatting-setting.component.scss']
})
export class ChattingSettingComponent implements OnInit {
    @Input() currentChat: AlarmItemInterface;
    @Input() drawer: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);
    public arrowRightIcon = this.dom.bypassSecurityTrustResourceUrl(arrowRightIcon);

    public userData;
    public setting_data = {
        latestLoginAddres: '',
        latestLoginIp: '',
        userMail: '',
        whatSUp: '',
        nickname: '',
        remark: '',
    };

    private dialogConfig = {
        width: '314px'
    };

    constructor(
        private dom: DomSanitizer,
        private restService: RestService,
        private dialogService: DialogService,
        private currentChattingChangeService: CurrentChattingChangeService,
    ) {
        this.currentChattingChangeService.currentChatting$.subscribe(currentChat => {
            console.log('会话切换...');
            this.currentChat = currentChat;
            this.initData();
        });
    }

    initData() {
        console.log('currentChat ngOnInit: ', this.currentChat);

        this.restService.getUserBaseById(this.currentChat.alarmItem.dataId).subscribe(res => {
            console.log('getUserBaseById result: ', res);
            this.userData = res.data;

            this.setting_data.nickname = this.userData.nickname;
            this.setting_data.latestLoginAddres = this.userData.latestLoginAddres;
            this.setting_data.latestLoginIp = this.userData.latestLoginIp;
            this.setting_data.userMail = this.userData.userMail;
            this.setting_data.whatSUp = this.userData.whatSUp == null || this.userData.whatSUp.length == 0 ? '此人很懒，什么都没留下' : this.userData.whatSUp;
        });

        this.restService.getRemark({ toUserId: this.currentChat.alarmItem.dataId }).subscribe(res => {
            this.setting_data.remark = res.data == null || res.data.length == 0 ? '' : res.data;
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

        var data = {
            one: 'xxx',
            remark: this.setting_data.remark
        };

        this.dialogService.openDialog(DemoDialogComponent, { data: data }).then((res: any) => {
            console.log('dialog result: ', res);
            if (res.ok == true) {
                var post_data = {
                    toUserId: this.currentChat.alarmItem.dataId,
                    remark: res.remark,
                };

                this.restService.updRemark(post_data).subscribe(res => {
                    this.setting_data.remark = post_data.remark;
                });
            }
        });
    }
}
