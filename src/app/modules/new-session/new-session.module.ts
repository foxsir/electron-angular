import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@modules/new-session/login/login.component';
import {SessionRoutingModule} from "./session-routing.module";
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    SessionRoutingModule,
  ]
})
export class NewSessionModule { }
