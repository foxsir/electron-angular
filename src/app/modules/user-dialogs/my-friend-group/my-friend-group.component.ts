import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RestService} from "@services/rest/rest.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";

@Component({
  selector: 'app-my-friend-group',
  templateUrl: './my-friend-group.component.html',
  styleUrls: ['./my-friend-group.component.scss']
})
export class MyFriendGroupComponent implements OnInit {
  nameFormControl = new FormControl('', [
    Validators.required
  ]);

  groupName: string = "";

  constructor(
    private dialogRef: MatDialogRef<MyFriendGroupComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: {groupId: number}, // 必需
    private restService: RestService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false);
  }

  save() {
    if(this.nameFormControl.valid && this.groupName.length > 0) {
      if(this.groupName.length > 14) {
        return this.snackBarService.openMessage("分组名称不能超过14个字符");
      }
      if(this.data && this.data.groupId) {
        // 修改
        this.restService.updateFriendGroup(this.data.groupId, this.groupName).subscribe((res: NewHttpResponseInterface<any>) => {
          if(res.status === 200) {
            this.snackBarService.openMessage(res.msg);
            this.dialogRef.close(true);
          } else {
            this.snackBarService.openMessage(res.msg);
          }
        });
      } else {
        // 创建
        this.restService.createFriendGroup(this.groupName, []).subscribe((res: NewHttpResponseInterface<any>) => {
          if(res.status === 200) {
            this.snackBarService.openMessage(res.msg);
            this.dialogRef.close(true);
          } else {
            this.snackBarService.openMessage(res.msg);
          }
        });
      }
    }
  }

}
