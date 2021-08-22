import {Component, Inject, OnInit} from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";

@Component({
  selector: 'app-set-remark',
  templateUrl: './set-remark.component.html',
  styleUrls: ['./set-remark.component.scss']
})
export class SetRemarkComponent implements OnInit {
  public remark: string;

  constructor(
    public dialogRef: MatDialogRef<SetRemarkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {userId: number},

    private restService: RestService,
    private localUserService: LocalUserService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
  }

  save() {
    if (this.remark.trim().length > 0) {
      const data = {
        id: this.localUserService.localUserInfo.userId.toString(),
        toUserId: this.data.userId.toString(),
        remark: this.remark,
      };
      this.restService.updateFriendRemark(data).subscribe((res: NewHttpResponseInterface<any>) => {
        if(res.status === 200) {
          this.snackBarService.openMessage('修改完成');
          this.dialogRef.close(true);
        }
      });
    }
  }

}
