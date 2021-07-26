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
import { FriendListComponent } from './friend-list/friend-list.component';
import { GroupComponent } from './group/group.component';
import { CollectComponent } from './collect/collect.component';
import {MatListModule} from "@angular/material/list";
import {MatInputModule} from "@angular/material/input";
import {MatBadgeModule} from "@angular/material/badge";
import {NzInputModule} from "ng-zorro-antd/input";
import {MatMenuModule} from "@angular/material/menu";
import {MessageModule} from "../../factorys/message/message.module";

@NgModule({
  declarations: [
    IndexComponent,
    MessageComponent,
    FriendListComponent,
    GroupComponent,
    CollectComponent
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
  ]
})
export class HomeModule { }
