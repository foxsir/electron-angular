import { Component, OnInit } from '@angular/core';
import {ResetPasswordForm} from "@app/forms/reset-password.form";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<UpdatePasswordComponent>,
    public form: ResetPasswordForm,
    public restService: RestService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
  }

  update() {
    if(this.form.form.valid) {
      const data = {
        oldPwd: this.form.model.old_psw,
        newPwd: this.form.model.user_psw
      };
      this.restService.updatePassword(data).subscribe((res: NewHttpResponseInterface<any>) => {
        if (res.status == 200) {
          this.dialogRef.close();
          this.form.fields.forEach(item => {
            item.formControl.setValue("");
            item.formControl.markAsUntouched();
          });
        }
        this.snackBarService.openMessage(res.msg);
      });
    }
  }

}
