import { Component, OnInit } from '@angular/core';
import {SignupForm} from "@app/forms/signup.form";
import {SignupMobileForm} from "@app/forms/signup-mobile.form";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponse from "@app/models/NewHttpResponse";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  registerForm: SignupForm | SignupMobileForm = this.signupForm;
  registerType: number = 0;
  selectedTab: number = 0;

  constructor(
    public signupForm: SignupForm,
    public signupFormMobile: SignupMobileForm,
    private restService: RestService,
  ) { }

  ngOnInit(): void {
    // this.checkRegisterTYpe();
  }

  /**
   * 切换tabs时检查注册类型
   * @param index
   */
  selectedChange(index: number) {
    this.selectedTab = index;
    if(index === 1) {
      // this.checkRegisterTYpe();
    }
    return index;
  }

  checkRegisterTYpe() {
    this.restService.getAppConfig().subscribe((res: NewHttpResponse<any>) => {
      if(res.data.registerType !== this.registerType) {
        if(res.data.registerType === 1) {
          this.registerForm = this.signupFormMobile;
        } else {
          this.registerForm = this.signupForm;
        }
        this.registerType = res.data.registerType;
      }
    });
  }

}
