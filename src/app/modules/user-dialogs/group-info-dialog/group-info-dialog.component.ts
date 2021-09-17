import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import { DialogService } from "@services/dialog/dialog.service"; // 必需
import { RestService } from "@services/rest/rest.service";

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
        private restService: RestService
    ) { }

    public group_members: any[] = [];
    public search_keywords = '';

    ngOnInit(): void {
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

    saveGroupInfo() {

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
}
