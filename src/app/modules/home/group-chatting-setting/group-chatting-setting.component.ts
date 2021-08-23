import { Component, Input, OnInit } from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";

import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import { RestService } from "@services/rest/rest.service";
import { DemoDialogComponent } from "@modules/setting-dialogs/demo-dialog/demo-dialog.component";
import { DialogService } from "@services/dialog/dialog.service";

@Component({
    selector: 'app-group-chatting-setting',
    templateUrl: './group-chatting-setting.component.html',
    styleUrls: ['./group-chatting-setting.component.scss']
})
export class GroupChattingSettingComponent implements OnInit {
    @Input() currentChat: AlarmItemInterface; // 测试群ID：0000000642
    @Input() drawer: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);

    public groupData;
    public setting_data = {
        customerServiceSwitch: false, /*专属客服开关*/
        tabSwitch: false, /*群页签开关*/
        topContentSwitch: false, /*群上屏开关*/
        silenceNotice: false, /*禁言通知开关*/
        revocationNotice: false, /*撤回通知开关*/
        kickNotice: false, /*退群通知开关*/
        talkIntervalSwitch: false, /*发言间隔开关*/

        talkInterval: 3, /*发言时间间隔*/

        gtopContent: '', /*群上屏信息*/
        gtopContentTemp: '', /*群上屏信息，编辑，临时存放*/
    };

    public customerServiceList: any[];
    public groupTabList: any[];

    /*
     * switch_default: 默认
     * group_top: 群上屏编辑
     */
    public view_mode = "switch_default";
    public view_title_object = {
        switch_default: '群配置',
        group_top: '群上屏编辑',
        customer_service: '专属客服配置',
        group_tab: '群页签配置'
    };

    public group_top_view_mode = "view"; /*view 或者 edit*/

    constructor(private dom: DomSanitizer, private restService: RestService, private dialogService: DialogService) {
        
    }

    ngOnInit(): void {
        console.log('currentChat: ', this.currentChat);

        /*获取群基本信息*/
        this.restService.getGroupBaseById(this.currentChat.alarmItem.dataId).subscribe(res => {
            console.log('getGroupBaseById result: ', res);
            this.groupData = res.data;

            this.setting_data.customerServiceSwitch = this.groupData.customerServiceSwitch == 1;
            this.setting_data.tabSwitch = this.groupData.tabSwitch == 1;
            this.setting_data.topContentSwitch = this.groupData.topContentSwitch == 1;
            this.setting_data.silenceNotice = this.groupData.silenceNotice == 1;
            this.setting_data.revocationNotice = this.groupData.revocationNotice == 1;
            this.setting_data.kickNotice = this.groupData.kickNotice == 1;
            this.setting_data.talkIntervalSwitch = this.groupData.talkIntervalSwitch == 1;

            this.setting_data.talkInterval = this.groupData.talkInterval.toString();

            this.setting_data.gtopContent = this.groupData.gtopContent;
        });

        /*获取群页签列表*/
        this.restService.getGroupCustomerService(this.currentChat.alarmItem.dataId).subscribe(res => {
            this.customerServiceList = res.data;
            console.log('客服数据：', this.customerServiceList);
        });

        /*获取群客服列表*/
        this.restService.getUserGroupTab(this.currentChat.alarmItem.dataId).subscribe(res => {
            this.groupTabList = res.data;
        });
    }

    bySwitch(key) {
        var data = {
            gid: this.currentChat.alarmItem.dataId
        };
        data[key] = this.setting_data[key] == true ? 1 : 0,

        this.restService.updateGroupBaseById(data).subscribe(res => {

        });
    }

    back() {
        switch (this.view_mode) {
            case "switch_default":
                this.drawer.close();
                break;

            default:
                this.view_mode = "switch_default";
                break;
        }
    }

    changeView(view) {
        this.view_mode = view;

        if (view == 'group_top') {
            this.group_top_view_mode = 'view';
        }
    }

    editGroupTop() {
        this.group_top_view_mode = 'edit';
        this.setting_data.gtopContentTemp = this.setting_data.gtopContent;
    }

    cancelGroupTop() {
        this.group_top_view_mode = 'view';
    }

    saveGroupTop() {
        var data = {
            gid: this.currentChat.alarmItem.dataId,
            gtopContent: this.setting_data.gtopContentTemp
        };

        this.restService.updateGroupBaseById(data).subscribe(res => {
            this.group_top_view_mode = 'view';
            this.setting_data.gtopContent = this.setting_data.gtopContentTemp;
        });  
    }

    /*修改发言间隔*/
    changetalkInterval() {
        var data = {
            two: 'xxx',
            talkInterval: this.setting_data.talkInterval
        };

        this.dialogService.openDialog(DemoDialogComponent, { data: data }).then((res: any) => {
            console.log('dialog result: ', res);

            if (res.ok == true) {

                var post_data = {
                    gid: this.currentChat.alarmItem.dataId,
                    talkInterval: res.talkInterval
                };

                this.restService.updateGroupBaseById(post_data).subscribe(res => {
                    this.setting_data.talkInterval = post_data.talkInterval;
                });
            }
        });
    }

}