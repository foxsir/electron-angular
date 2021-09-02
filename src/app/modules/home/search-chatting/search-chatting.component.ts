import {Component, Input, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CacheService} from "@services/cache/cache.service";

@Component({
    selector: 'app-search-chatting',
    templateUrl: './search-chatting.component.html',
    styleUrls: ['./search-chatting.component.scss']
})
export class SearchChattingComponent implements OnInit {
    @Input() chatting: AlarmItemInterface;

    currentTab: "chat" | "media" | "file" = "chat";

    constructor(
        private cacheService: CacheService,
    ) {
    }

    ngOnInit(): void {
        this.cacheService.getChattingCache(this.chatting).then(data => {
            if (!!data) {
                this.ChattingModel = Object.values(data);



            }
        });
    }

}
