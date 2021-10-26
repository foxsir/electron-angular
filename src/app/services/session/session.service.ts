import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {UserModel} from "@app/models/user.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {WindowService} from "@services/window/window.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {CacheService} from "@services/cache/cache.service";
import {DatabaseService} from "@services/database/database.service";
import {SignupModel} from "@app/models/signup.model";
import RegisterResponseModel from "@app/models/register-response.model";

interface Login {
  login: boolean;
  userId: number;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private router: Router,
    private restService: RestService,
    private localUserService: LocalUserService,
    private snackBarService: SnackBarService,
    private windowService: WindowService,
    private cacheService: CacheService,
  ) { }

  login(account: string, password: string, message: string = "登录成功") {
    this.restService.submitLoginToServer(account, password).subscribe((res: NewHttpResponseInterface<Login>) => {
      if (res.status === 200) {
        const userInfo = res.data;
        this.localUserService.update(userInfo);
        this.cacheService.connectionDB(userInfo.userId.toString()).then((connect) => {
          this.cacheService.cacheMyInfo().then(() => {
            // 使用缓存中的头像
            this.cacheService.getMyInfo().then((myInfo: UserModel) => {
              this.localUserService.updateLocalUserInfo(myInfo);
              this.snackBarService.openMessage("正在登录...");
              setTimeout(() => {
                this.router.navigate(["/home"]).then(() => {
                  this.snackBarService.openMessage(message);
                  this.windowService.normalWindow();
                });
              }, 2000);
            });
          });
        });
      } else {
        this.snackBarService.openMessage("你输入的账号或密码不正确，请重新输入");
      }
    });
  }

  register(signup: SignupModel) {
    this.restService.submitRegisterToServer(signup).subscribe((res: NewHttpResponseInterface<RegisterResponseModel>) => {
      if (res.status === 200) {
        this.login(signup.user_phone || signup.user_mail, signup.user_psw);
      } else {
        this.snackBarService.openMessage(res.msg);
      }
    });
  }


}
