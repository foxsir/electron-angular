import { Component, OnInit } from '@angular/core';
import {SignupForm} from "@app/forms/signup.form";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    public signupForm: SignupForm
  ) { }

  ngOnInit(): void {
  }

  public onSubmit() {
    if (this.signupForm.form.valid) {
      // this.http.post("/session/signup", this.signupForm.form.value).subscribe((res: HttpCreateResponse<UserModel>) => {
      //   this.setPopularize(res.data);
      // });
    }
  }

}
