import { Component, OnInit } from '@angular/core';

import editIcon from "@app/assets/icons/edit.svg";
import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CacheService } from "@services/cache/cache.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";

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
        private cacheService: CacheService,
        private currentChattingChangeService: CurrentChattingChangeService,
    ) { }

    ngOnInit(): void {
        this.cacheService.getChattingList().then( res => {
            if (res) {
                this.alarmItemList = new Map();
                res.forEach(item => this.alarmItemList.set(item.alarmData.alarmItem.dataId, item));

                console.log('聊天列表 01：', this.alarmItemList);
            }
        });
    }

    /**
     * 创建群
     */
    createGroup() {
        return this.router.navigate(['/home/message/create-group']);
    }

    /**
     * 搜索好友
     */
    searchFriend() {
        return this.router.navigate(['/home/message/search-friend']);
    }

    searchContent() {
        if (!this.showResource) {
            this.showResource = !this.showResource;
        }
    }

    /**
     * 取消搜索
     */
    cancelSearch() {
        this.search = null;
        this.showResource = false;
    }

    /**
     * 文本框搜索
     * @param event
     */
    txtSearchChange(event: KeyboardEvent) {
        if (event.key != 'Enter') {
            return;
        }

        console.log('回车确认：', this.search, this.alarmItemList);
        let search_low = this.search.toLowerCase();

        this.alarmItemList.forEach(item => {
            console.log('消息Model：', item);
            if (item.alarmData.alarmItem.title.indexOf(search_low) != -1) {
                this.find_friends.push({
                    avatar: item.alarmData.alarmItem.avatar,
                    title: item.alarmData.alarmItem.title,
                    msgContent: item.alarmData.alarmItem.msgContent,
                    dataId: item.alarmData.alarmItem.dataId,
                    chatType: item.alarmData.metadata.chatType,
                });
            }

            item.message.forEach(msg => {
                //console.log('消息：', msg);
                if (msg.text.indexOf(search_low) != -1) {
                    console.log('find msg: ', msg);
                    this.find_messages.push({
                        avatar: item.alarmData.alarmItem.avatar,
                        title: item.alarmData.alarmItem.title,
                        msgContent: msg.text,
                        dataId: item.alarmData.alarmItem.dataId,
                        chatType: item.alarmData.metadata.chatType,
                    });
                }
            });
        });

        console.log('find_friends: ', this.find_friends);
        console.log('find_messages: ', this.find_messages);
    }

    /**
     * 切换好友
     * @param item
     */
    switchChatting(item: any) {
        const alarm: AlarmItemInterface = {
            alarmItem: {
                alarmMessageType: item.chatType == 'friend' ? 0 : 1, // 0单聊 1临时聊天/陌生人聊天 2群聊
                dataId: item.dataId,
                date: new Date().getTime(),
                msgContent: "",
                title: item.title,
                avatar: item.avatar,
            },
            // 聊天元数据
            metadata: {
                chatType: item.chatType, // "friend" | "group"
            },
        };
        console.log('数据：', alarm);
        //return;

        this.cacheService.putChattingCache(alarm).then(() => {
            this.currentChattingChangeService.switchCurrentChatting(alarm).then();
            this.search = null;
            this.showResource = false;
        });
    }

}
