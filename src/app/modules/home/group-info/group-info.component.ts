import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { CacheService } from "@services/cache/cache.service";
import { SelectFriendContactComponent } from "@modules/user-dialogs/select-friend-contact/select-friend-contact.component";
import { TransmitMessageComponent } from "@modules/user-dialogs/transmit-message/transmit-message.component";
import { MessageService } from "@services/message/message.service";
import { CurrentChattingChangeService } from "@services/current-chatting-change/current-chatting-change.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import GroupInfoModel from "@app/models/group-info.model";

@Component({
    selector: 'app-group-info',
    templateUrl: './group-info.component.html',
    styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent implements OnInit {
    @Input() currentChat: AlarmItemInterface; // 测试群ID：0000000642
    @Input() drawer: MatDrawer;
    @ViewChild('groupConfig') private groupConfig: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);
    public arrowRightIcon = this.dom.bypassSecurityTrustResourceUrl(arrowRightIcon);

    public userinfo: any;
    public user_role: string; /*当前用户在这个群的角色：owner, admin, common*/
    public groupData: Partial<GroupInfoModel> = {
        gmute: 0,
        invite: 0,
        allowPrivateChat: 0,
        gmemberCount: 0,
        createTime: '',
        gownerUserUid: 0,
        gnotice: '',
    };
    public user_clu_info = {
        groupOwnerName: '',
        showNickname: '',
        groupOwner: '',
        isAdmin: 0,
    };

    public setting_data = {
        gmute: false, /*全体禁言*/
        allowPrivateChat: false, /*成员互相添加好友*/
        no_disturb: false, /*消息免打扰*/
        top_chat: false, /*置顶聊天*/
        invite: false, /*普通成员邀请好友入群*/

        talkInterval: 3, /*发言时间间隔*/

        gnotice: '', /*群公告*/
        gnotice_temp: '', /*群公告，编辑，临时存放*/
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
        private localUserService: LocalUserService,
        private cacheService: CacheService,
        private messageService: MessageService,
        private currentChattingChangeService: CurrentChattingChangeService,
    ) {
        this.currentChattingChangeService.currentChatting$.subscribe(currentChat => {
            console.log('会话切换...');
            this.currentChat = currentChat;
            this.view_mode = 'switch_default';
            this.groupConfig.close().then();
            this.initGroupData();
        });

        this.cacheService.cacheUpdate$.subscribe(res => {
          if(res.groupMemberMap || res.groupAdminMap) {
            this.initGroupData();
          }
        });
    }

    ngOnInit(): void {
        this.initGroupData();
    }

    loadGroupAdminList() {
        /* 获取群管理员列表 */
        this.cacheService.getCacheGroupAdmins(this.currentChat.alarmItem.dataId).then(members => {
            this.group_admin_list = [];
            members.forEach(member => {
                this.group_admin_list.push(member);
            });
            console.log('群管理员列表 01：', members);
        });
    }

    initGroupData() {
        console.log('currentChat ngOnInit（群聊设置页面）: ', this.currentChat);
        if (this.currentChat.metadata.chatType === 'friend') {
            return;
        }

        /*获取群基本信息*/
        this.restService.getGroupBaseById(this.currentChat.alarmItem.dataId).subscribe((res: NewHttpResponseInterface<GroupInfoModel>) => {
            console.log('getGroupBaseById result: ', res);
            if (res.status !== 200)
                return;

            if(res.status === 200 && res.data) {
              this.groupData = res.data;
              this.setting_data.gmute = this.groupData.gmute === 1;
              this.setting_data.invite = this.groupData.invite === 1;
              this.setting_data.allowPrivateChat = this.groupData.allowPrivateChat === 1;
              this.setting_data.gnotice = this.groupData.gnotice;
            }

        });

        /* 获取群成员列表 */
        this.cacheService.getGroupMembers(this.currentChat.alarmItem.dataId).then(members => {
          this.group_member_list = [];
          members.forEach(member => {
            this.group_member_list.push(member);
          });
        });

        this.loadGroupAdminList();

        /* 个人的在群状态 */
        this.userinfo = this.localUserService.localUserInfo;
        this.restService.getUserClusterVo(this.userinfo.userId.toString(), this.currentChat.alarmItem.dataId).subscribe(res => {
            if (res.status !== 200)
                return;

            this.user_clu_info = res.data;
            if (this.user_clu_info.groupOwner == this.userinfo.userId.toString()) {
                this.user_role = 'owner';
            }
            else if (this.user_clu_info.isAdmin == 1) {
                this.user_role = 'admin';
            }
            else {
                this.user_role = 'common';
            }

            console.log('当前用户在这个群的角色: ', this.user_role);
        });

        /* 查看免打扰状态 */
        this.restService.noDisturbDetail(this.userinfo.userId.toString(), this.currentChat.alarmItem.dataId).subscribe(res => {
            if (res.status !== 200)
                return;

            this.setting_data.no_disturb = parseInt(res.data) == 1;
        });

        /* 查看置顶状态 */
        this.restService.topDetail(this.userinfo.userId.toString(), this.currentChat.alarmItem.dataId).subscribe(res => {
            if (res.status !== 200)
                return;

            this.setting_data.top_chat = parseInt(res.data) == 1;
        });
    }

    /**
     * 开关设置
     * @param key
     */
    bySwitch(key) {
        if (key == 'no_disturb') {
            this.cacheService.setMute(this.currentChat.alarmItem.dataId, this.currentChat.metadata.chatType, this.setting_data[key]).then(() => {
                //this.snackBarService.openMessage("关闭声音通知");
            });
        }
        else if (key == 'top_chat') {
            this.cacheService.setTop(this.currentChat.alarmItem.dataId, this.currentChat.metadata.chatType, this.setting_data[key]).then();
        }
        else {
            var data = {
                gid: this.currentChat.alarmItem.dataId
            };
            data[key] = this.setting_data[key] == true ? 1 : 0,

            this.restService.updateGroupBaseById(data).subscribe();
        }
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

    /**
     * 切换视图
     * @param view
     */
    changeView(view) {
        this.view_mode = view;

        if (view == 'group_notice') {
            this.group_notice_view_mode = 'view';
        }
    }

    editGroupNotice() {
        this.group_notice_view_mode = 'edit';
        this.setting_data.gnotice_temp = this.setting_data.gnotice;
    }

    cancelGroupNotice() {
        this.group_notice_view_mode = 'view';
    }

    saveGroupNotice() {
        //console.log('userinfo: ', this.userinfo);
        //return;

        var post_data = {
            g_notice: this.setting_data.gnotice_temp,
            g_notice_updateuid: this.userinfo.userId,
            g_id: this.currentChat.alarmItem.dataId,
        };

        this.restService.changeGroupNotice(post_data).subscribe(res => {
            if (res.success == false) {
                return;
            }
            console.log('修改群公告成功，发送通知消息...');
            this.group_notice_view_mode = 'view';
            this.setting_data.gnotice = this.setting_data.gnotice_temp;

            this.dialogService.confirm({ title: '通知确认', text: '群公告修改成功，是否通知全部群成员？' }).then((ok) => {
                if (ok) {
                    console.log('确认通知...');

                    var imdata = {
                        bridge: false,
                        dataContent: {
                            "time": 0, "uh": this.userinfo.userAvatarFileName,
                            "nickName": this.userinfo.nickname, "cy": 2, "f": this.userinfo.userId,
                            "m": "@所有人【群公告】" + this.setting_data.gnotice_temp,
                            "m3": "pc", "t": "0000005019", "ty": this.currentChat.alarmItem.dataId
                        },
                        fp: '', from: this.userinfo.userId, to: this.currentChat.alarmItem.dataId,
                        QoS: true, sm: 0, type: 2, typeu: 44,
                    };
                    this.messageService.sendCustomerMessage(imdata).then(res => {
                        if (res.success === true) {

                        }
                    });
                }
            });
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
            group_name: this.currentChat.alarmItem.title,
            txt_value: column == 'group_name' ? this.currentChat.alarmItem.title : this.user_clu_info.showNickname,
        };

        this.dialogService.openDialog(GroupInfoDialogComponent, { data: data }).then((res: any) => {
            console.log('group info dialog result: ', res);

            if (res.ok == false) {
                return;
            }

            if (column == 'group_name') {
                this.currentChat.alarmItem.title = res.new_name;
                this.cacheService.putChattingCache(this.currentChat).then(() => {});
            }
            else if (column == 'group_nickname') {
                this.user_clu_info.showNickname = res.new_name;
            }

            //if (column == 'group_name') {
            //    this.dialogService.confirm({ title: '通知确认', text: '群名称已修改成功，是否通知全部群成员？' }).then((ok) => {
            //        if (ok) {
            //            console.log('确认通知...');

            //            var imdata = {
            //                bridge: false,
            //                dataContent: {
            //                    changedByUid: this.userinfo.userId,
            //                    nnewGroupName: res.new_name,
            //                    notificationContent: this.userinfo.nickname + '修改群名为：' + res.new_name,
            //                    gid: this.currentChat.alarmItem.dataId,
            //                },
            //                fp: '', from: 0, qoS: true, sm: -1, sync: 0, type: 2, typeu: 51,
            //            };
            //            this.messageService.sendCustomerMessage(imdata).then(res => {
            //                if (res.success === true) {

            //                }
            //            });
            //        }
            //    });
            //}
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


            if (choose_type == 'add_group_admin') {
                this.restService.updateGroupAdmin(this.currentChat.alarmItem.dataId, [res.item.userUid], 1).subscribe(res => {
                    setTimeout(() => {
                        this.cacheService.cacheGroupAdmins(this.currentChat.alarmItem.dataId).then(members => {
                            this.loadGroupAdminList();
                            console.log('更新管理员缓存，并重新加载');
                        });
                    }, 1000);
                });
            }
            else if (choose_type == 'transfer') {

            }
        });
    }

    /*
     * 删除管理员
     */
    deleteGroupAdmin() {
        var data = {
            dialog_type: 'delete_group_admin',
            toUserId: this.currentChat.alarmItem.dataId,
            chatType: this.currentChat.metadata.chatType,
            admin_list: this.group_admin_list
        };

        this.dialogService.openDialog(GroupInfoDialogComponent, { data: data }).then((res: any) => {
            console.log('group info dialog result: ', res);

            if (res.ok == false) {
                return;
            }
            this.restService.updateGroupAdmin(this.currentChat.alarmItem.dataId, res.selectfriends, 0).subscribe(res => {
                this.loadGroupAdminList();
            });
        });
    }

    /*
     * 解散本群
     */
    dismissGroup() {
        this.dialogService.confirm({ title: "解散群组", text: "此操作不可逆，请慎重操作呦" }).then((ok) => {
            if (ok == false) {
                return;
            }

            console.log('确认解散...');
            var post_data = {
                g_id: this.currentChat.alarmItem.dataId,
                //owner_uid: this.userinfo.userId,
                //owner_nickname: this.userinfo.nickname,
                owner_uid: this.groupData.gownerUserUid,
                owner_nickname: this.user_clu_info.groupOwnerName,
            };

            this.restService.jieSangGroup(post_data).subscribe(res => {
                if (res.success == false) {
                    return;
                }
                console.log('解散成功，发送通知消息...');

                var imdata = {
                    bridge: false,
                    dataContent: {
                        "nickName": "",
                        "uh": "", "f": "0",
                        "t": this.currentChat.alarmItem.dataId,
                        "m": "本群已被" + this.userinfo.nickname + "解散",
                        "cy": 2, "ty": 90, "sync": "0"
                    },
                    fp: '', from: 0, qoS: true, sm: -1, sync: 0, type: 2, typeu: 48,
                };
                this.messageService.sendCustomerMessage(imdata).then(res => {
                    if (res.success === true) {
                        this.dialogService.alert({ title: '解散成功！', text: '输入框不能为空！' }).then((ok) => {
                        });
                    }
                });
            });
        });
    }

    /* 邀请好友 */
    inviteFriend() {
        this.dialogService.openDialog(SelectFriendContactComponent, { width: '400px', maxHeight: '600px' }).then((friend) => {
            if (friend) {
                console.log('选择的好友：', friend);
                //return;

                this.dialogService.confirm({ title: "消息提示", text: "确定邀请该好友入群？" }).then((ok) => {
                    if (ok == false) {
                        return;
                    }

                    var post_data = {
                        invite_to_gid: this.currentChat.alarmItem.dataId,
                        invite_uid: this.userinfo.userId,
                        invite_nickname: this.userinfo.nickname,
                        members: [[this.currentChat.alarmItem.dataId, friend.friendUserUid.toString(), friend.nickname]]
                    };

                    this.restService.inviteFriendToGroup(post_data).subscribe(res => {
                        if (res.success == false) {
                            return;
                        }
                        this.dialogService.alert({ title: '邀请成功！'}).then(() => {
                          setTimeout(() => {
                            return this.cacheService.cacheGroupMembers(this.currentChat.alarmItem.dataId).then();
                          }, 1000);
                        });
                    });
                });
            }
        });
    }

    /*
     * 退出本群
     */
    exitGroup() {
        this.dialogService.confirm({ title: "退出本群", text: "确定退出本群吗？" }).then((ok) => {
            if (ok == false) {
                return;
            }
            const alarmItem = this.currentChat.alarmItem;
            console.log('确认退出...');
            var post_data = {
                del_opr_nickname: this.userinfo.nickname,
                gid: alarmItem.dataId,
                members: [
                    [alarmItem.dataId, this.userinfo.userId, this.userinfo.nickname]
                ],
                del_opr_uid: this.userinfo.userId,
            };

            this.restService.exitGroup(post_data).subscribe(res => {
                if (res.success == false) {
                    return;
                }
                console.log('退出成功，发送通知消息...');

                var imdata = {
                    bridge: false,
                    dataContent: {
                        "nickName": this.userinfo.nickname,
                        "uh": this.userinfo.userAvatarFileName, "f": this.userinfo.userId,
                        "t": alarmItem.dataId,
                        "m": this.userinfo.nickname + "已退出本群",
                        "cy": 2, "ty": 90, "sync": "0"
                    },
                    fp: '', from: this.userinfo.userId, to: alarmItem.dataId,
                    QoS: true, sm: -1, type: 2, typeu: 50,
                    recvTime: 0, "sync": "0"
                };
                this.messageService.sendCustomerMessage(imdata).then(res2 => {
                    if (res2.success === true) {
                        this.dialogService.alert({ title: '退出成功！'}).then((done) => {
                          this.cacheService.deleteData<ChattingModel>({model: "chatting", query: {dataId: alarmItem.dataId}}).then(() => {
                            this.cacheService.deleteChattingCache(alarmItem.dataId).then(() => {
                              return this.currentChattingChangeService.switchCurrentChatting(null);
                            });
                          });
                        });
                    }
                });

            });
        });
    }

}
