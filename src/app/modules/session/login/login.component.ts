import { Component, OnInit } from '@angular/core';
import {LoginForm} from "@app/forms/login.form";
import {RestService} from "@services/rest/rest.service";
import HttpPresponseModel from "@app/models/http-response.model";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {Router} from "@angular/router";
import {LocalUserService} from "@services/local-user/local-user.service";
import NewHttpResponseModel from "@app/models/new-http-response.model";
import {WindowService} from "@services/window/window.service";

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
    private windowService: WindowService,
  ) {
  }

  ngOnInit(): void {
  }

  public onSubmit() {
    if (this.loginForm.form.valid) {
      const value = this.loginForm.form.value;
      this.restService.submitLoginToServer(value.account, value.password).subscribe((res: NewHttpResponseModel<any>) => {
        if (res.status === 200) {
          const userInfo = res.data;
          this.localUserService.update(userInfo);
          this.router.navigate(["/home"]).then(() => {
            this.snackBarService.openMessage("登录成功");
            this.windowService.normalWindow();
          });
        } else {
          this.snackBarService.openMessage("你输入的账号或密码不正确，请重新输入");
        }
      });
    }
  }

}
