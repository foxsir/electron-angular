import {Component, OnInit} from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {HttpService} from "@services/http/http.service";
import {MatMenuTrigger} from "@angular/material/menu";
import {ContextMenuService} from "@services/context-menu/context-menu.service";
import {DialogService} from "@services/dialog/dialog.service";
import CollectModel from "@app/models/collect.model";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {ForwardMessageService} from "@services/forward-message/forward-message.service";
import {CacheService} from "@services/cache/cache.service";
import {MessageService} from "@services/message/message.service";
import {SelectFriendContactComponent} from "@modules/user-dialogs/select-friend-contact/select-friend-contact.component";
import FriendModel from "@app/models/friend.model";

interface CollectChatMsg {
  collect: CollectModel;
  chatMsg: ChatmsgEntityModel;
}

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements OnInit {
  collectList: CollectModel[] = [];

  public collectChatMsg: CollectChatMsg[] = [];

  public contextMenu = [
    {
      label: "发送给好友",
      action: (item: CollectChatMsg) => {
        this.dialogService.openDialog(SelectFriendContactComponent, {width: '314px'}).then((friend: FriendModel) => {
          this.cacheService.generateAlarmItem(
            friend.friendUserUid.toString(), 'friend', item.chatMsg.text, item.chatMsg.msgType
          ).then(alarm => {
            this.forwardMessageService.forward(alarm, item.chatMsg);
          });
        });
      }
    },
    {
      label: "删除",
      action: (item: CollectChatMsg) => {
        console.log('删除：', item);
        this.dialogService.confirm({
          title: '删除收藏',
          text: '确认将此内容从收藏中删除？'
        }).then((res: boolean) => {
          if (res) {
            this.restService.deleteMissuCollectById(item.collect.id).subscribe(() => {
              this.restService.getMyCollectList().subscribe(res => {
                this.collectList = res.data;
              });
            });
          }
        });
      }
    }
  ];

  constructor(
    private restService: RestService,
    private localUserService: LocalUserService,
    private http: HttpService,
    private contextMenuService: ContextMenuService,
    private dialogService: DialogService,
    private messageEntityService: MessageEntityService,
    private forwardMessageService: ForwardMessageService,
    private cacheService: CacheService,
    private messageService: MessageService,
  ) {
    this.restService.getMyCollectList().subscribe(res => {
      this.collectList = res.data;
      this.collectList.forEach(item => {
        const msgEntity = this.messageEntityService.prepareRecievedMessage(
          item.fromUserId, item.nickname, item.content, item.createTime, item.type
        );
        this.collectChatMsg.push({
          collect: item,
          chatMsg: msgEntity,
        });
      });
    });
  }

  ngOnInit(): void {
  }

  contextMenuForItem(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement, chat: any) {
    menu.openMenu();
    span.style.position = "fixed";
    span.style.top = "0px";
    span.style.left = "0px";
    span.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
    return e.defaultPrevented;
  }

}
