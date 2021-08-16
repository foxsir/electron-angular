import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from './index/index.component';
import {MessageComponent} from './message/message.component';
import {AddressListComponent} from "./address-list/address-list.component";
import {GroupComponent} from "./group/group.component";
import {CollectComponent} from "./collect/collect.component";
import {NewFriendComponent} from "./new-friend/new-friend.component";
import {GroupingComponent} from "./grouping/grouping.component";
import { BlackListComponent } from "./black-list/black-list.component";
import { FriendGroupComponent } from "./friend-group/friend-group.component";

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: '',
        redirectTo: 'message',
        pathMatch: 'full'
      },
      {
        path: 'message',
        component: MessageComponent,
        pathMatch: 'full'
      },
      {
        path: 'address-list',
        component: AddressListComponent,
        children: [
          {
            path: '',
            redirectTo: 'new-friend',
          },
          {
            path: 'new-friend',
            component: NewFriendComponent,
            pathMatch: 'full'
          },
          {
            path: 'group',
            component: GroupComponent,
            pathMatch: 'full'
          },
          {
            path: 'grouping',
            component: GroupingComponent,
            pathMatch: 'full'
          },
          {
            path: 'collect',
            component: CollectComponent,
            pathMatch: 'full'
          },
          {
            path: 'black-list',
            component: BlackListComponent,
            pathMatch: 'full'
            },
            {
                path: 'friend-group',
                component: FriendGroupComponent,
                pathMatch: 'full'
            },
        ]
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
