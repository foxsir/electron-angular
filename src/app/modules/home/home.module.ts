import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import {HomeRoutingModule} from './home-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import { MessageComponent } from './message/message.component';
import { AddressListComponent } from './address-list/address-list.component';
import { GroupComponent } from './group/group.component';
import { CollectComponent } from './collect/collect.component';
import {MatListModule} from "@angular/material/list";
import {MatInputModule} from "@angular/material/input";
import {MatBadgeModule} from "@angular/material/badge";
import {NzInputModule} from "ng-zorro-antd/input";
import {MatMenuModule} from "@angular/material/menu";
import {MessageModule} from "../../factorys/message/message.module";
import { BlackListComponent } from './black-list/black-list.component';
import { GroupingComponent } from './grouping/grouping.component';
import { NewFriendComponent } from './new-friend/new-friend.component';
import {EmptyDataModule} from "../../factorys/empty-data/empty-data.module";
import { AccountPanelComponent } from './account-panel/account-panel.component';
import { SearchChattingComponent } from './search-chatting/search-chatting.component';
import {TitleBarModule} from "../../factorys/title-bar/title-bar.module";
import { InputAreaComponent } from './input-area/input-area.component';
import {FormsModule} from "@angular/forms";
import {UserDialogsModule} from "../user-dialogs/user-dialogs.module";
import { ChattingSettingComponent } from './chatting-setting/chatting-setting.component';
import { GroupChattingSettingComponent } from './group-chatting-setting/group-chatting-setting.component';
import {UploadModule} from "../../factorys/upload/upload.module";

@NgModule({
  declarations: [
    IndexComponent,
    MessageComponent,
    AddressListComponent,
    GroupComponent,
    CollectComponent,
    BlackListComponent,
    GroupingComponent,
    NewFriendComponent,
    AccountPanelComponent,
    SearchChattingComponent,
    InputAreaComponent,
    ChattingSettingComponent,
    GroupChattingSettingComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatBadgeModule,
    NzInputModule,
    MatMenuModule,
    MessageModule,
    EmptyDataModule,
    TitleBarModule,
    FormsModule,
    UserDialogsModule,
    UploadModule,
  ]
})
export class HomeModule { }
