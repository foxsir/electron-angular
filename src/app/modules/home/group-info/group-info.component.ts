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
import { GroupInfoDialogComponent } from "@modules/user-dialogs/group-info-dialog/group-info-dialog.component";

@Component({
    selector: 'app-group-info',
    templateUrl: './group-info.component.html',
    styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent implements OnInit {
    @Input() currentChat: AlarmItemInterface; // 测试群ID：0000000642
    @Input() drawer: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);
    public arrowRightIcon = this.dom.bypassSecurityTrustResourceUrl(arrowRightIcon);

    public groupData = {
        gmute: 0,
        invite: 0,
        gmemberCount: 0,
    };

    public setting_data = {
        gmute: false,
        invite: false,

        talkInterval: 3, /*发言时间间隔*/

        gnoticeContent: '', /*群上屏信息*/
        gnoticeContentTemp: '', /*群上屏信息，编辑，临时存放*/
    };

    public customerServiceList: any[];
    public groupTabList: any[];

    /*
     * switch_default: 默认
     * group_notice: 群公告编辑
     */
    public view_mode = "switch_default";
    public view_title_object = {
        switch_default: '群组信息',
        group_notice: '群公告编辑',
        customer_service: '专属客服配置',
        group_tab: '群页签配置'
    };

    public group_notice_view_mode = "view"; /*view 或者 edit*/

    constructor(private dom: DomSanitizer, private restService: RestService, private dialogService: DialogService) {
        
    }

    ngOnInit(): void {
        console.log('currentChat（group-info-component）: ', this.currentChat);

        /*获取群基本信息*/
        this.restService.getGroupBaseById(this.currentChat.alarmItem.dataId).subscribe(res => {
            console.log('getGroupBaseById result: ', res);
            this.groupData = res.data;

            this.setting_data.gmute = this.groupData.gmute == 1;
            this.setting_data.invite = this.groupData.invite == 1;
        });

        /*获取群客服列表*/
        this.restService.getGroupCustomerService(this.currentChat.alarmItem.dataId).subscribe(res => {
            for (var i = 0; i < res.data.length; i++) {
                res.data[i].status_switch = res.data[i].status == 0 ? false : true;
            }
            this.customerServiceList = res.data;
            console.log('群客服数据：', this.customerServiceList);
        });

        /*获取群页签列表*/
        this.restService.getUserGroupTab(this.currentChat.alarmItem.dataId).subscribe(res => {
            for (var i = 0; i < res.data.length; i++) {
                res.data[i].status_switch = res.data[i].status == 0 ? false : true;
            }
            this.groupTabList = res.data;
            console.log('群页签数据：', this.groupTabList);
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

    /**
     * 群客服设置
     * @param item
     */
    bySwitchCustomer(item) {
        console.log('bySwitchCustomer: ', item);

        var data = {
            clusterId: this.currentChat.alarmItem.dataId,
            customerServiceId: item.customerServiceId,
            status: item.status_switch == true ? 1 : 0,
        };

        this.restService.UpGroupCustomerService(data).subscribe(res => {
            item.status = data.status;
        });
    }

    /**
     * 群页签配置
     * @param item
     */
    bySwitchGroupTab(item) {
        console.log('bySwitchGroupTab: ', item);

        var data = {
            clusterId: this.currentChat.alarmItem.dataId,
            groupTabId: item.groupTabId,
            status: item.status_switch == true ? 1 : 0,
        };

        this.restService.UpUserGroupTab(data).subscribe(res => {
            item.status = data.status;
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

        if (view == 'group_notice') {
            this.group_notice_view_mode = 'view';
        }
    }

    editGroupNotice() {
        this.group_notice_view_mode = 'edit';
        this.setting_data.gnoticeContentTemp = this.setting_data.gnoticeContent;
    }

    cancelGroupNotice() {
        this.group_notice_view_mode = 'view';
    }

    saveGroupNotice() {
        var data = {
            gid: this.currentChat.alarmItem.dataId,
            gnoticeContent: this.setting_data.gnoticeContentTemp
        };

        this.restService.updateGroupBaseById(data).subscribe(res => {
            this.group_notice_view_mode = 'view';
            this.setting_data.gnoticeContent = this.setting_data.gnoticeContentTemp;
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

    /*
     * 编辑群信息： 群组名称、群内昵称
     */
    editGroupInfo(column) {
        var data = {
            dialog_type: 'edit_' + column,
            toUserId: this.currentChat.alarmItem.dataId,
            chatType: this.currentChat.metadata.chatType,
            txt_value: '',
        };

        this.dialogService.openDialog(GroupInfoDialogComponent, { data: data }).then((res: any) => {
            console.log('group info dialog result: ', res);

            if (res.ok == true) {


            }
        });
    }

    /*
     * 解散本群
     */
    dismissGroup() {
        var data = {
            dialog_type: 'dismiss_group',
            toUserId: this.currentChat.alarmItem.dataId,
            chatType: this.currentChat.metadata.chatType,
            count: '',
        };

        this.dialogService.openDialog(GroupInfoDialogComponent, { data: data }).then((res: any) => {
            console.log('group info dialog result: ', res);

            if (res.ok == true) {


            }
        });
    }

}