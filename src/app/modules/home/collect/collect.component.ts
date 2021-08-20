import { Component, OnInit } from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {HttpResponse} from "@angular/common/http";
import { HttpService } from "@services/http/http.service";
import { MatMenuTrigger } from "@angular/material/menu";
import { ContextMenuService } from "@services/context-menu/context-menu.service";

@Component({
    selector: 'app-collect',
    templateUrl: './collect.component.html',
    styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements OnInit {
    collectList: any[];

    public contextMenu = [
        {
            label: "sendToFriend",
            limits: "",
            action: (chat: any, messageContainer: HTMLDivElement) => {
                //this.copyTextToClipboard(messageContainer);
            }
        },
        {
            label: "remove",
            limits: "",
            action: (chat: any, messageContainer: HTMLDivElement) => {
                // this.copyImageToClipboard(messageContainer);
            }
        }
    ];

    constructor(
        private restService: RestService,
        private localUserService: LocalUserService,
        private http: HttpService,
        private contextMenuService: ContextMenuService,
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

}
