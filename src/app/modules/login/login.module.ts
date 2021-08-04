import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import {LoginRoutingModule} from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormlyModule} from "@ngx-formly/core";
import {MatButtonModule} from "@angular/material/button";
import {UploadModule} from "../../factorys/upload/upload.module";
import {TitleBarModule} from "../../factorys/title-bar/title-bar.module";



@NgModule({
  declarations: [
    IndexComponent,
    LoginComponent,
    RegisterComponent
  ],
    imports: [
        CommonModule,
        LoginRoutingModule,
        MatTabsModule,
        MatCardModule,
        FlexLayoutModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        FormlyModule,
        MatButtonModule,
        UploadModule,
        TitleBarModule,
    ]
})
export class LoginModule { }
