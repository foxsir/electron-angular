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
    public show_modal = false;
    public current_model: any;

    public collectChatMsg: CollectChatMsg[] = [];

    public contextMenu = [
        {
            label: "发送给好友",
            limits: "",
            action: (item: any) => {
                //this.copyTextToClipboard(messageContainer);
                // console.log('发送给好友：', messageContainer);
            }
        },
        {
            label: "删除",
            limits: "",
            //action: (item: any, messageContainer: HTMLDivElement) => {
            //    // this.copyImageToClipboard(messageContainer);
            //    console.log('删除：', messageContainer);
            //}
            action: (item) => {
                console.log('删除：', item);
              // this.show_modal = true;
                this.current_model = item;
              this.dialogService.confirm({
                title: '删除收藏',
                text: '确认将此内容从收藏中删除？'
              }).then((res: boolean) => {
                if(res) {
                  this.handleOk();
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
        console.log('ddd');

        menu.openMenu();
        span.style.position = "fixed";
        span.style.top = "0px";
        span.style.left = "0px";
        span.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
        return e.defaultPrevented;
    }

    handleCancel() {
        this.show_modal = false;
    }

    handleOk() {
        this.restService.deleteMissuCollectById(this.current_model.id).subscribe(res => {
            this.show_modal = false;

            this.restService.getMyCollectList().subscribe(res => {
                this.collectList = res.data;
            });
        });
    }

}
