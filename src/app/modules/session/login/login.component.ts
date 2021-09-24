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
    if (this.loginForm.form.valid) {
      const value = this.loginForm.form.value;
      this.sessionService.login(value.account, value.password);
    }
  }

}
