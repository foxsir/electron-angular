import { Component, OnInit } from '@angular/core';
import {LoginForm} from "@app/forms/login.form";
import {RestService} from "@services/rest/rest.service";
import HttpResponse from "@app/models/HttpResponse";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {Router} from "@angular/router";
import {LocalUserService} from "@services/local-user/local-user.service";


const { ipcRenderer } = window.require("electron");

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    public loginForm: LoginForm,
    private router: Router,
    private restService: RestService,
    private snackBarService: SnackBarService,
    private localUserService: LocalUserService,
  ) {
  }

  ngOnInit(): void {
  }

  public onSubmit() {
    if (this.loginForm.form.valid) {
      const value = this.loginForm.form.value;
      this.restService.submitLoginToServer(value.account, value.password).subscribe((res: HttpResponse) => {
        if (res.returnValue !== "null") {
          const userInfo = JSON.parse(res.returnValue);
          console.dir(userInfo);
          this.localUserService.update(userInfo);
          this.router.navigate(["/home"]).then(() => {
            this.snackBarService.openSnackBar("登录成功");
            ipcRenderer.send("large-window");
          });
        } else {
          this.snackBarService.openMessage("你输入的账号或密码不正确，请重新输入");
        }
      });
    }
  }

}
