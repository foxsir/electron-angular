import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@modules/new-session/login/login.component';
import {SessionRoutingModule} from "./session-routing.module";
import { RegisterComponent } from './register/register.component';
import {FlexModule} from "@angular/flex-layout";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {FormlyModule} from "@ngx-formly/core";
import {MatButtonModule} from "@angular/material/button";
import {TitleBarModule} from "../../factorys/title-bar/title-bar.module";


@NgModule({
  declarations: [LoginComponent, RegisterComponent],
    imports: [
        CommonModule,
        SessionRoutingModule,
        FlexModule,
        MatCardModule,
        ReactiveFormsModule,
        FormlyModule,
        MatButtonModule,
        TitleBarModule,
    ]
})
export class NewSessionModule { }
