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
import NewHttpResponse from "@app/models/NewHttpResponse";
import RegisterResponse from "@app/models/RegisterResponse";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from "@angular/router";
import {WindowService} from "@services/window/window.service";

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
  avatarUrl: URL;

  uploadOptions: Partial<uploadOptions> = {
    size: {width: '60px'},
    icon: avatarIcon,
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
  ) {
    this.checkRegisterTYpe();
  }

  ngOnInit(): void {
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

  checkRegisterTYpe() {
    this.restService.getAppConfig().subscribe((res: NewHttpResponse<any>) => {
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
        phone: [this.form.form.value.area, this.form.form.value.user_phone].join("-"),
        vCode: this.form.form.value.code
      };
      if (this.registerType === 1) {
        this.restService.submitVerifyCodeToServer(data).subscribe((res: NewHttpResponse<any>) => {
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
      phone: [this.form.form.value.area, this.form.form.value.user_phone].join("-"),
      username: this.form.form.value.user_mail
    };
    let params = "";
    if (this.registerType === 1) {
      params = "?phone="+data.phone;
    } else {
      params = "?username="+data.username;
    }
    this.restService.checkUsernameAndPhone(params, data).subscribe((res: NewHttpResponse<any>) => {
      if(res.status === 200) {
        this.step = 'two';
      } else {
        this.snackBarService.openMessage(res.msg);
      }
    });
  }

  public setAvatar(url: URL) {
    this.avatarUrl = url;
  }

  public onSubmit() {
    if (this.step2Form.valid) {
      let data = {
        ...this.form.form.value,
        ...this.step2Form.value,
        user_sex: this.userSex,
      };
      if(this.avatarUrl && this.avatarUrl.pathname) {
        data = Object.assign(data, {userAvatarFileName: this.avatarUrl.pathname});
      }

      this.restService.submitRegisterToServer(data).subscribe((res: NewHttpResponse<RegisterResponse>) => {
        if (res.status === 200) {
          const userInfo = res.data;

          this.localUserService.update(userInfo);
          this.router.navigate(["/home"]).then(() => {
            this.snackBarService.openMessage("注册成功");
            this.windowService.normalWindow();
          });
        } else {
          this.snackBarService.openMessage(res.msg);
        }
      });
    } else {
      this.step2Form.markAllAsTouched();
    }
  }

}
