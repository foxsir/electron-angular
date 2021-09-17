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
import { LocalUserService } from "@services/local-user/local-user.service";

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
        createTime: ''
    };
    public user_clu_info = {
        groupOwnerName: '',
        showNickname: '',
    };

    public setting_data = {
        gmute: false,
        invite: false,

        talkInterval: 3, /*发言时间间隔*/

        gnoticeContent: '', /*群上屏信息*/
        gnoticeContentTemp: '', /*群上屏信息，编辑，临时存放*/
    };

    /*
     * switch_default: 默认
     * group_notice: 群公告编辑
     */
    public view_mode = "switch_default";
    public view_title_object = {
        switch_default: '群组信息',
        group_notice: '群公告编辑',
        customer_service: '专属客服配置',
        group_tab: '群页签配置',
        manage_group_member: '群成员管理',
        manage_group_admin: '群管理员管理',
    };

    public group_notice_view_mode = "view"; /*view 或者 edit*/

    public group_member_list: any[] = [];
    public group_admin_list: any[] = [];

    constructor(
        private dom: DomSanitizer,
        private restService: RestService,
        private dialogService: DialogService,
        private localUserService: LocalUserService
    ) {
        
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

        /* 获取群成员列表 */
        this.restService.submitGetGroupMembersListFromServer(this.currentChat.alarmItem.dataId).subscribe(res => {
            console.log('群信息弹出框获取群成员：', res);
            this.group_member_list = res.data.list;
            for (let item of this.group_member_list) {
                item.show = true;
            }
        });

        /* 获取群管理员列表 */
        this.restService.getGroupAdminList(this.currentChat.alarmItem.dataId).subscribe(res => {
            console.log('群信息弹出框获取群管理员：', res);
            this.group_admin_list = res.data;
            for (let item of this.group_admin_list) {
                item.show = true;
            }
        });

        /* 个人的在群状态 */
        let userinfo = this.localUserService.localUserInfo;
        this.restService.getUserClusterVo(userinfo.userId.toString(), this.currentChat.alarmItem.dataId).subscribe(res => {
            this.user_clu_info = res.data;
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


    /**
     * 选择群成员 / 群管理员
     * @param choose_type: transfer, add_group_admin
     */
    chooseGroupPeople(choose_type) {
        var data = {
            dialog_type: 'choose_group_member',
            toUserId: this.currentChat.alarmItem.dataId,
            chatType: this.currentChat.metadata.chatType,
            count: '',
        };

        this.dialogService.openDialog(GroupInfoDialogComponent, { data: data }).then((res: any) => {
            console.log('group info dialog result: ', res);

            if (res.ok == false) {
                return;
            }

            this.restService.updateGroupAdmin(this.currentChat.alarmItem.dataId, [res.item.userUid], 1).subscribe(res => {
                
            });
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

    /* 邀请好友 */
    inviteFriend() {
        var data = {
            dialog_type: 'invite_friend',
            toUserId: this.currentChat.alarmItem.dataId,
            chatType: this.currentChat.metadata.chatType,
            count: '',
        };

        this.dialogService.openDialog(GroupInfoDialogComponent, { data: data }).then((res: any) => {
            console.log('group info dialog result: ', res);

            if (res.ok == true) { //


            } //
        });
    }

}