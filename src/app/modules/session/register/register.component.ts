import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {SignupForm} from "@app/forms/signup.form";
import {SignupMobileForm} from "@app/forms/signup-mobile.form";

// import icons
import manIcon from "@app/assets/icons/man.svg";
import manActiveIcon from "@app/assets/icons/man-active.svg";
import womanIcon from "@app/assets/icons/woman.svg";
import womanActiveIcon from "@app/assets/icons/woman-active.svg";
import avatarIcon from "@app/assets/icons/avatar.svg";

import {DomSanitizer} from "@angular/platform-browser";
import uploadOptions from "@app/factorys/upload/uploadOptions";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import RegisterResponseModel from "@app/models/register-response.model";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from "@angular/router";
import {WindowService} from "@services/window/window.service";
import {UploadedFile} from "@app/factorys/upload/upload-file/upload-file.component";
import appConfigInterface from "@app/interfaces/app-config.interface";
import {UserModel} from "@app/models/user.model";
import {CacheService} from "@services/cache/cache.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {SessionService} from "@services/session/session.service";
import {SignupModel} from "@app/models/signup.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  manIcon = this.dom.bypassSecurityTrustResourceUrl(manIcon);
  manActiveIcon = this.dom.bypassSecurityTrustResourceUrl(manActiveIcon);
  womanIcon = this.dom.bypassSecurityTrustResourceUrl(womanIcon);
  womanActiveIcon = this.dom.bypassSecurityTrustResourceUrl(womanActiveIcon);

  userSex: number = 1;
  avatarUrl: URL = null;

  uploadOptions: Partial<uploadOptions> = {
    size: {width: '60px'},
    icon: this.avatarUrl ? this.avatarUrl.href : avatarIcon,
  };

  nicknameControl = new FormControl(null, Validators.required);
  step2Form = new FormGroup({
    nickname: this.nicknameControl
  });

  step: string = 'one';

  public form: SignupForm | SignupMobileForm = this.signupForm;
  public registerType: number = 0;

  constructor(
    private dom: DomSanitizer,
    private restService: RestService,
    private snackBarService: SnackBarService,
    private localUserService: LocalUserService,
    private router: Router,
    private windowService: WindowService,
    public signupForm: SignupForm,
    public signupFormMobile: SignupMobileForm,
    private cacheService: CacheService,
    private sessionService: SessionService,
  ) {
    this.checkRegisterType();
  }

  ngOnInit(): void {
    // 清楚相关信息
    this.form.form.reset();
  }

  setSex(sex: 0 | 1) {
    this.userSex = sex;
  }

  switchType(type: number) {
    if(type === 1) {
      this.form = this.signupFormMobile;
    } else {
      this.form = this.signupForm;
    }
    this.registerType = type;
  }

  checkRegisterType() {
    this.restService.getAppConfig().subscribe((res: NewHttpResponseInterface<appConfigInterface>) => {
      if(res.data.registerType !== this.registerType) {
        if(res.data.registerType === 1) {
          this.form = this.signupFormMobile;
        } else {
          this.form = this.signupForm;
        }
        this.registerType = res.data.registerType;
      }
    });
  }

  public nextStep() {
    if (this.form.form.valid) {
      const data = {
        phone: [this.form.model.area, this.form.form.value.user_phone].join("-"),
        vCode: this.form.form.value.code
      };

      if (this.registerType === 1) {
        this.restService.submitVerifyCodeToServer(data).subscribe((res: NewHttpResponseInterface<any>) => {
          if (res.status === 200) {
            this.gotoStepTwo();
          } else {
            this.snackBarService.openMessage("您输入的验证码有误，请核对验证码后重新输");
          }
        });
      } else {
        this.gotoStepTwo();
      }
    } else {
      this.form.form.markAllAsTouched();
    }
  }

  /**
   * 检查用户名或者手机号是否可用
   */
  gotoStepTwo() {
    const data = {
      phone: this.form.form.value.user_phone ? [this.form.model.area, this.form.form.value.user_phone].join("-"):'',
      username: this.form.form.value.user_mail?this.form.form.value.user_mail:'',
    };
    this.restService.checkUsernameAndPhone(data).subscribe((res: NewHttpResponseInterface<any>) => {
      if(res.status === 200) {
        this.step = 'two';
      } else {
        this.snackBarService.openMessage(res.msg);
      }
    });
  }

  public setAvatar(upload: UploadedFile) {
    this.avatarUrl = null;
    setTimeout(() => {
      this.avatarUrl = upload.url;
    }, 100);
  }

  public onSubmit() {
    if (this.step2Form.valid) {
      let data: SignupModel = {
        ...this.form.form.value,
        ...this.step2Form.value,
        user_sex: this.userSex,
      };
      if(this.registerType === 1) {
        data.user_phone = [this.form.model.area, this.form.form.value.user_phone].join("-");
      }
      if(this.avatarUrl && this.avatarUrl.pathname) {
        data = Object.assign(data, {userAvatarFileName: this.avatarUrl});
      }
      this.sessionService.register(data);

    } else {
      this.step2Form.markAllAsTouched();
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
