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
import {sign} from "crypto";

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
    private databaseService: DatabaseService,
  ) { }

  login(account: string, password: string, message: string = "登录成功") {
    this.restService.submitLoginToServer(account, password).subscribe((res: NewHttpResponseInterface<Login>) => {
      if (res.status === 200) {
        const userInfo = res.data;
        this.localUserService.update(userInfo);
        this.databaseService.connectionDB(userInfo.userId.toString()).then((connect) => {
          this.cacheService.cacheMyInfo(userInfo.userId).then(() => {
            // 使用缓存中的头像
            this.cacheService.getMyInfo().then((myInfo: UserModel) => {
              this.updateLocalUserInfo(myInfo);

              this.router.navigate(["/home"]).then(() => {
                this.snackBarService.openMessage(message);
                this.windowService.normalWindow();
              });
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
        // this.localUserService.update(userInfo);
        // this.router.navigate(["/home"]).then(() => {
        //   this.snackBarService.openMessage("注册成功");
        //   this.windowService.normalWindow();
        //   this.cacheService.cacheMyInfo(userInfo.userId).then(() => {
        //     // 使用缓存中的头像
        //     this.cacheService.getMyInfo().then((myInfo: UserModel) => {
        //       this.updateLocalUserInfo(myInfo);
        //       // if(data.userAvatarFileName.length > 0) {
        //       //   this.myAvatar = this.dom.bypassSecurityTrustResourceUrl(data.userAvatarFileName);
        //       // }
        //     });
        //   });
        // });
      } else {
        this.snackBarService.openMessage(res.msg);
      }
    });
  }

  logout() {

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
  }


}
