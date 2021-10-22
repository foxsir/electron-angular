import { Component, OnInit } from '@angular/core';
import {LoginForm} from "@app/forms/login.form";
import {Router} from "@angular/router";
import {RestService} from "@services/rest/rest.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {WindowService} from "@services/window/window.service";
import {CacheService} from "@services/cache/cache.service";
import {SessionService} from "@services/session/session.service";


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
  ) { }

  ngOnInit(): void {
  }

  public onSubmit() {
    if (this.loginForm.form.valid) {
      const value = this.loginForm.form.value;
      this.sessionService.login(value.account, value.password);
    }
  }

}
