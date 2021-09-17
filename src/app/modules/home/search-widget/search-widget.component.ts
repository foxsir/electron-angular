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

    public alarmItemList: Map<string, any> = new Map();

    public find_friends: any[] = [];
    public find_messages: any[] = [];

    constructor(
        private dom: DomSanitizer,
        private router: Router,
        private cacheService: CacheService
    ) { }

    ngOnInit(): void {
        this.cacheService.getChattingList().then( res => {
            if (res) {
                //var chatlist = Object.values(res);
                //console.log('聊天列表 01：', chatlist, res);

                this.alarmItemList = new Map();
                res.forEach(item => this.alarmItemList.set(item.alarmData.alarmItem.dataId, item));

                console.log('聊天列表 01：', this.alarmItemList);
            }

            // this.cacheService.syncChattingList(res || new Map<string, AlarmItemInterface>()).then(list => {
            //     console.log('聊天列表 02：', list);
            //     this.alarmItemList = list;
            // });
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

        console.log('回车确认：', this.search, this.alarmItemList);
        let search_low = this.search.toLowerCase();

        this.alarmItemList.forEach(item => {
            //console.log('消息Model：', item);
            if (item.alarmData.alarmItem.title.indexOf(search_low) != -1) {
                this.find_friends.push(item.alarmData.alarmItem);
            }

            item.message.forEach(msg => {
                //console.log('消息：', msg);
                if (msg.text.indexOf(search_low) != -1) {
                    console.log('find msg: ', msg);
                    this.find_messages.push({
                        avatar: item.alarmData.alarmItem.avatar,
                        title: item.alarmData.alarmItem.title,
                        msgContent: msg.text,
                    });
                }
            });
        });

        console.log('find_friends: ', this.find_friends);
        console.log('find_messages: ', this.find_messages);
    }

}
