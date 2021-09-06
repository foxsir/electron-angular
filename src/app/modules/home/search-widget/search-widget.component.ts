import { Component, OnInit } from '@angular/core';

import editIcon from "@app/assets/icons/edit.svg";
import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CacheService } from "@services/cache/cache.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";

@Component({
    selector: 'app-search-widget',
    templateUrl: './search-widget.component.html',
    styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent implements OnInit {
    public editIcon = this.dom.bypassSecurityTrustResourceUrl(editIcon);
    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public showResource: boolean = false;
    public search: string;

    public alarmItemList: AlarmItemInterface[] = [];

    constructor(
        private dom: DomSanitizer,
        private router: Router,
        private cacheService: CacheService
    ) { }

    ngOnInit(): void {
        this.cacheService.getChattingList().then(res => {
            if (res) {
                var chatlist = Object.values(res);
                console.log('聊天列表 01：', chatlist);
            }

            this.cacheService.SyncChattingList(res || {}).then(list => {
                console.log('聊天列表 02：', list);
                this.alarmItemList = list;
            });
        });
    }

    createGroup() {
        return this.router.navigate(['/home/message/create-group']);
    }

    searchFriend() {
        return this.router.navigate(['/home/message/search-friend']);
    }

    searchContent() {
        if (!this.showResource) {
            this.showResource = !this.showResource;
        }
    }

    cancelSearch() {
        this.search = null;
        this.showResource = false;
    }

    txtSearchChange(event: KeyboardEvent) {
        if (event.key != 'Enter') {
            return;
        }

        console.log('回车确认：', this.search);

        for (let alarmitem of this.alarmItemList) {
            console.log('消息Model：', alarmitem);
            this.cacheService.getChattingCache(alarmitem).then(data => {
                console.log('消息列表：', data);

                if (!!data) {

                }
            });
        }
    }

}
