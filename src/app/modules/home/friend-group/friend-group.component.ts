import { Component, OnInit } from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import HttpPresponseModel from "@app/interfaces/http-response.interface";
import ChattingGroupModel from "@app/models/chatting-group.model";

@Component({
    selector: 'app-friend-group',
    templateUrl: './friend-group.component.html',
    styleUrls: ['./friend-group.component.scss']
})
export class FriendGroupComponent implements OnInit {
    private localUserInfo: LocalUserinfoModel = this.localUserService.localUserInfo;
    public friendgrouplist: any[];

    constructor(private restService: RestService, private localUserService: LocalUserService) {
        this.restService.getFriendGroupList().subscribe(res => {
            this.friendgrouplist = res.data;
        });
    }

    ngOnInit(): void {

    }

}
