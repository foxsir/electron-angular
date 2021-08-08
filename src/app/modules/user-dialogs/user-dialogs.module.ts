import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { PrivacySettingComponent } from './privacy-setting/privacy-setting.component';
import { MySignatureComponent } from './my-signature/my-signature.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
    QrCodeComponent,
    PrivacySettingComponent,
    MySignatureComponent,
    UpdatePasswordComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class UserDialogsModule { }
