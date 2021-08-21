import { Component, OnInit } from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {HttpResponse} from "@angular/common/http";
import { HttpService } from "@services/http/http.service";
import { MatMenuTrigger } from "@angular/material/menu";
import { ContextMenuService } from "@services/context-menu/context-menu.service";
import {DialogService} from "@services/dialog/dialog.service";

@Component({
    selector: 'app-collect',
    templateUrl: './collect.component.html',
    styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements OnInit {
    collectList: any[];
    public show_modal = false;
    public current_model: any;

    public contextMenu = [
        {
            label: "发送给好友",
            limits: "",
            action: (item: any, messageContainer: HTMLDivElement) => {
                //this.copyTextToClipboard(messageContainer);
                console.log('发送给好友：', messageContainer);
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
    ) {
        this.restService.getMyCollectList().subscribe(res => {
            this.collectList = res.data;
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
