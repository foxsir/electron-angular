import { Component, OnInit } from '@angular/core';
import {LoginForm} from "@app/forms/login.form";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    public loginForm: LoginForm,
  ) { }

  ngOnInit(): void {
  }

  public onSubmit() {
    if (this.loginForm.form.valid) {
      console.dir(this.loginForm.form.value);

      // this.http.post("/session/login", this.loginForm.form.value).subscribe((res) => {
      //   localStorage.setItem("Authorization", res.sign);
      //
      //   this.http.post("/users/get", {}).subscribe((user: UserModel) => {
      //     this.userService.setUser(user);
      //   });
      //   return this.router.navigate(['/account']);
      // });
    }
  }

}
