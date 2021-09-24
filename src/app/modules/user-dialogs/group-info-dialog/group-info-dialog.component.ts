import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import { DialogService } from "@services/dialog/dialog.service"; // 必需
import { RestService } from "@services/rest/rest.service";
import { LocalUserService } from "@services/local-user/local-user.service";

@Component({
    selector: 'app-group-info-dialog',
    templateUrl: './group-info-dialog.component.html',
    styleUrls: ['./group-info-dialog.component.scss']
})
export class GroupInfoDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<GroupInfoDialogComponent>, // 必需
        @Inject(MAT_DIALOG_DATA) public data: any, // 必需
        private dialogService: DialogService,
        private restService: RestService,
        private localUserService: LocalUserService,
    ) { }

    public group_members: any[] = [];
    public search_keywords = '';
    public userinfo: any;

    ngOnInit(): void {
        this.userinfo = this.localUserService.localUserInfo;

        /*是否设置支付密码*/
        this.restService.submitGetGroupMembersListFromServer(this.data.toUserId).subscribe(res => {
            console.log('群信息弹出框获取群成员：', res);
            this.group_members = res.data.list;
            for (let item of this.group_members) {
                item.show = true;
            }
        });
        console.log('群信息弹出框初始化 data：', this.data);
    }

    close() {
        const result = {};
        this.dialogRef.close(result);
    }

    /*
     * 取消
     */
    cancel() {
        const result = {
            ok: false
        };
        this.dialogRef.close(result);
    }

    /**
     * 修改群名称，群内昵称
     * @param change_type
     */
    saveGroupInfo(change_type) {
        console.log('userinfo: ', this.userinfo);
        if (this.data.txt_value.length == 0) {
            this.dialogService.alert({ title: '输入框不能为空！', text: '输入框不能为空！' }).then((ok) => {
            });
            return;
        }

        if (change_type == 'group_name') {
            var post_data = {
                gid: this.data.toUserId,
                modify_by_uid: this.userinfo.userId,
                modify_by_nickname: this.userinfo.nickname,
                group_name: this.data.txt_value,
            };

            this.restService.changeGroupName(post_data).subscribe(res => {
                const result = {
                    ok: res.success,
                    new_name: post_data.group_name
                };
                this.dialogRef.close(result);
            });
        }
        else if (change_type == 'nick_name_in_group') {
            var post_data_2 = { groupId: this.data.toUserId, nicknameInGroup: this.data.txt_value };
            this.restService.updateNicknameInGroup(post_data_2).subscribe(res => {
                const result = {
                    ok: res.ok
                };
                this.dialogRef.close(result);
            });
        }
    }

    /*
     * 解散群组： 取消和确定
     */
    confirmDismissGroup(ok) {
        const result = {
            ok: ok,
        };
        this.dialogRef.close(result);
    }

    /**
     * 搜索
     * @param event
     */
    txtSearchChange(event: KeyboardEvent) {
        if (event.key != 'Enter') {
            return;
        }

        console.log('回车确认：', this.search_keywords);
        for (let item of this.group_members) {
            if (item.showNickname.indexOf(this.search_keywords) == -1) {
                item.show = false;
            }
            else {
                item.show = true;
            }
        }
    }

    /* 确认选择 */
    confirmChoose(item) {
        const result = {
            ok: true,
            item: item,
        };
        this.dialogRef.close(result);
    }

    /**
     * 删除管理员
     * @param friendSelect
     */
    confirmDeleteGroupAdmin(selectDeleteGroupAdmin: any) {
        const names = [];
        let selectfriends = [];
        selectDeleteGroupAdmin.selectedOptions.selected.forEach(item => {
            console.log('item: ', item);
            selectfriends.push(item.value);
            names.push(item.value.nickname);
        });

        console.log('选中的数据：', selectfriends, names);

        const result = {
            ok: true,
            names: names,
            selectfriends: selectfriends,
        };
        this.dialogRef.close(result);
    }
}
