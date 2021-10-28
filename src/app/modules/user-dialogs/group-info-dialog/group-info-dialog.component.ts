import {Component, Inject, OnInit} from '@angular/core';
import { PipeTransform, Pipe } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import { DialogService } from "@services/dialog/dialog.service"; // 必需
import { RestService } from "@services/rest/rest.service";
import { CacheService } from "@services/cache/cache.service";
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
      private cacheService: CacheService,
    ) { }

    public group_members: any[] = [];
    public search_keywords = '';
    public userinfo: any;

    ngOnInit(): void {
      this.userinfo = this.localUserService.localUserInfo;
      this.cacheService.getGroupMembers(this.data.toUserId).then(members => {
        this.group_members = [];
        members.forEach(member => {
          switch (this.data.choose_type){
            case 'transfer':
              if(this.userinfo.userId.toString() != member.userUid.toString()){
                this.group_members.push(member);
              }
              break;
            case 'add_group_admin':
              if(this.userinfo.userId.toString() != member.userUid.toString() && member.isAdmin!=1){
                this.group_members.push(member);
              }
              break;
            case 'delete_group_admin':
              if(this.userinfo.userId.toString() != member.userUid.toString() && member.isAdmin!=1){
                this.group_members.push(member);
              }
              break;
            default:
              this.group_members.push(member);
              break;
          }
        });
      });
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
                    ok: res.ok,
                    new_name: post_data_2.nicknameInGroup
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


    /* 确认选择 */
    confirmChoose(item) {
        const result = {
            ok: true,
            item: item,
        };
        this.dialogRef.close(result);
    }

    /* 群成员多选 */
  confirmMulChoose(selectMember: any) {
    const selectfriends = [];
    selectMember.selectedOptions.selected.forEach(item => {
      selectfriends.push({id:item.value.userUid,name: item.value.showNickname});
    });

    const result = {
      ok: true,
      selectfriends: selectfriends,
    }; console.dir(result);
    this.dialogRef.close(result);
  }

    /**
     * 删除管理员
     * @param friendSelect
     */
    confirmDeleteGroupAdmin(selectDeleteGroupAdmin: any) {
      let selectfriends = [];
      selectDeleteGroupAdmin.selectedOptions.selected.forEach(item => {
        selectfriends.push({id: item.value.userUid, name: item.value.nickname});
      });

      const result = {
        ok: true,
        selectfriends: selectfriends,
      };

      if(selectfriends.length > 0){
        let confirmTxt = "";
        if(selectfriends.length === 1){
          confirmTxt="确定删除管理员 "+selectfriends[0].name+"吗？";
        }else{
          confirmTxt="确定删除"+selectfriends[0].name+"等"+selectfriends.length.toString()+"位管理员吗？";
        }

        this.dialogService.confirm({title: '删除管理员', text: confirmTxt}).then(ok => {
          if (ok) {
            this.dialogRef.close(result);
          }
        });
      }
      else{
        this.dialogRef.close(result);
      }
    }
}
