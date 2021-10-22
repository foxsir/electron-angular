import { Component, OnInit } from '@angular/core';
import {LoginForm} from "@app/forms/login.form";
import {RestService} from "@services/rest/rest.service";
import HttpPresponseModel from "@app/interfaces/http-response.interface";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {Router} from "@angular/router";
import {LocalUserService} from "@services/local-user/local-user.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {WindowService} from "@services/window/window.service";
import {CacheService} from "@services/cache/cache.service";
import {UserModel} from "@app/models/user.model";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {SessionService} from "@services/session/session.service";
import {IndexComponent} from "@modules/session/index/index.component";
import {GlobalCache} from "@app/config/global-cache";

interface Login {
  login: boolean;
  userId: number;
  token: string;
}

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
    private cacheService: CacheService,
    private sessionService: SessionService,
  ) {
  }

  ngOnInit(): void {
  }

  public onSubmit() {
    if (!GlobalCache.loginProtocol) {
      return this.snackBarService.openMessage("登录前请确认已阅读服务条款");
    }
    if (this.loginForm.form.valid) {
      const value = this.loginForm.form.value;
      this.sessionService.login(value.account, value.password);
      // 更新后，更新默认的登录名和密码
      this.loginForm.fields[0].defaultValue = value.account;
      this.loginForm.fields[1].defaultValue = value.password;
    }
  }

}
