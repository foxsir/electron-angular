import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from './index/index.component';
import {MessageComponent} from './message/message.component';
import {FriendListComponent} from "./friend-list/friend-list.component";
import {GroupComponent} from "./group/group.component";
import {CollectComponent} from "./collect/collect.component";

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: '',
        component: MessageComponent,
        pathMatch: 'full'
      },
      {
        path: 'message',
        component: MessageComponent,
        pathMatch: 'full'
      },
      {
        path: 'friend-list',
        component: FriendListComponent,
        pathMatch: 'full'
      },
      {
        path: 'group',
        component: GroupComponent,
        pathMatch: 'full'
      },
      {
        path: 'collect',
        component: CollectComponent,
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
