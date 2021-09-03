import {Component, Input, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CacheService} from "@services/cache/cache.service";
import {formatDate} from "@app/libs/mobileimsdk-client-common";

@Component({
    selector: 'app-search-chatting',
    templateUrl: './search-chatting.component.html',
    styleUrls: ['./search-chatting.component.scss']
})
export class SearchChattingComponent implements OnInit {
    @Input() chatting: AlarmItemInterface;

    public formatDate = formatDate;
    public currentTab: "chat" | "media" | "file" = "chat";
    public keywords = "";
    
    public list_chat: ChattingModel[] = [];
    public list_file: ChattingModel[] = [];

    constructor(
        private cacheService: CacheService
    ) {
    }

    ngOnInit(): void {
        
    }

    txtSearchChange(event: KeyboardEvent) {
        console.log("txtSearchChange: ", event);

        if (event.key != 'Enter') {
            return;
        }

        console.log('回车确认：', this.keywords);

        this.cacheService.getChattingCache(this.chatting).then(data => {
            console.log('消息列表：', data);

            if (!!data) {
                //this.ChattingModel = Object.values(data);
                this.list_chat.length = 0;
                this.list_file.length = 0;

                for (let key in data){
                    var item = data[key];
                    if (item.msgType == 0 && item.text.indexOf(this.keywords) != -1) {
                        this.list_chat.push(item);
                    }

                    if (item.msgType == 5) {
                        var obj = JSON.parse(item.text);
                        if (obj.fileName.indexOf(this.keywords) != -1) {
                            item.fileName = obj.fileName;
                            item.fileLength = obj.fileLength;
                            this.list_file.push(item);
                        }
                    }
                }

                console.log("文字结果：", this.list_chat);
                console.log("文件结果：", this.list_file);
            }
        });
    }
}