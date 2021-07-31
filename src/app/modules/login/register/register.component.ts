import { Component, OnInit } from '@angular/core';
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

  userSex: number = 0;

  uploadOptions: Partial<uploadOptions> = {
    size: {width: '40px'},
    icon: avatarIcon,
  };

  step: string = 'one';

  constructor(
    public signupForm: SignupForm,
    public signupFormMobile: SignupMobileForm,
    private dom: DomSanitizer,
  ) {
    this.signupForm = this.signupFormMobile;
  }

  ngOnInit(): void {
  }

  setSex(sex: 0 | 1) {
    this.userSex = sex;
  }

  public onSubmit() {
    if (this.signupForm.form.valid) {
      // this.http.post("/session/signup", this.signupForm.form.value).subscribe((res: HttpCreateResponse<UserModel>) => {
      //   this.setPopularize(res.data);
      // });
    }
    this.step = 'two';
  }

}
