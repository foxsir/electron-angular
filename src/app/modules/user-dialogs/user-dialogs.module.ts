import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { PrivacySettingComponent } from './privacy-setting/privacy-setting.component';
import { MySignatureComponent } from './my-signature/my-signature.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TitleBarModule} from "../../factorys/title-bar/title-bar.module";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {NzSwitchModule} from "ng-zorro-antd/switch";



@NgModule({
    declarations: [
        QrCodeComponent,
        PrivacySettingComponent,
        MySignatureComponent,
        UpdatePasswordComponent
    ],
    exports: [
        PrivacySettingComponent
    ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    TitleBarModule,
    MatIconModule,
    FormsModule,
    NzSwitchModule
  ]
})
export class UserDialogsModule { }
