import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import {LoginRoutingModule} from './login-routing.module';



@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
