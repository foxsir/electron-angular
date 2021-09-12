import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { PrivacySettingComponent } from './privacy-setting/privacy-setting.component';
import { MySignatureComponent } from './my-signature/my-signature.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { RedPocketComponent } from './red-pocket/red-pocket.component';
import { GroupInfoDialogComponent } from './group-info-dialog/group-info-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TitleBarModule} from "../../factorys/title-bar/title-bar.module";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { UserInfoComponent } from './user-info/user-info.component';
import { SetRemarkComponent } from './set-remark/set-remark.component';
import { UserSilenceComponent } from './user-silence/user-silence.component';
import { MatRadioModule } from "@angular/material/radio";
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { TransmitMessageComponent } from './transmit-message/transmit-message.component';
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import { UserContactCardComponent } from './user-contact-card/user-contact-card.component';
import { SelectFriendContactComponent } from './select-friend-contact/select-friend-contact.component';
import {NgformlyModule} from "../../shared/formly/ngformly.module";
import { RedBagComponent } from './red-bag/red-bag.component';


@NgModule({
    declarations: [
        QrCodeComponent,
        PrivacySettingComponent,
        MySignatureComponent,
        UpdatePasswordComponent,
        RedPocketComponent,
        GroupInfoDialogComponent,
        UserInfoComponent,
        SetRemarkComponent,
        UserSilenceComponent,
        TransmitMessageComponent,
        UserContactCardComponent,
        SelectFriendContactComponent,
        RedBagComponent
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
    NzSwitchModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzListModule,
    MatRadioModule,
    NgxQRCodeModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
    NgformlyModule
  ]
})
export class UserDialogsModule { }
