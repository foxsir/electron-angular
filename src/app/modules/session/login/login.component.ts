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
  ) {
  }

  ngOnInit(): void {
  }

  public onSubmit() {
    if (this.loginForm.form.valid) {
      const value = this.loginForm.form.value;
      this.restService.submitLoginToServer(value.account, value.password).subscribe((res: NewHttpResponseInterface<any>) => {
        if (res.status === 200) {
          const userInfo = res.data;
          this.localUserService.update(userInfo);
          this.router.navigate(["/home"]).then(() => {
            this.snackBarService.openMessage("登录成功");
            this.windowService.normalWindow();

            this.cacheService.cacheMyInfo().then(() => {
              // 使用缓存中的头像
              this.cacheService.getMyInfo().then((data: UserModel) => {
                this.updateLocalUserInfo(data);
                // if(data.userAvatarFileName.length > 0) {
                //   this.myAvatar = this.dom.bypassSecurityTrustResourceUrl(data.userAvatarFileName);
                // }
              });
            });

          });
        } else {
          this.snackBarService.openMessage("你输入的账号或密码不正确，请重新输入");
        }
      });
    }
  }

  updateLocalUserInfo(data: UserModel) {
    const local: Partial<LocalUserinfoModel> = {
      latest_login_ip: data.latestLoginIp,
      latest_login_time: null,
      login: true,
      maxFriend: data.maxFriend,
      nickname: data.nickname,
      online: data.online,
      userAvatarFileName: data.userAvatarFileName,
      userDesc: data.whatSUp,
      userType: data.userType,
      user_mail: data.userMail,
      user_phone: data.userPhone,
      user_sex: data.userSex,
      whatsUp: data.whatSUp,
    };
    this.localUserService.update( Object.assign(local, this.localUserService.localUserInfo) );

    console.dir(this.localUserService.localUserInfo);
  }

}
