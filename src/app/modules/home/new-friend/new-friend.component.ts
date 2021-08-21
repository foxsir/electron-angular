import { Component, OnInit } from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import HttpPresponseModel from "@app/interfaces/http-response.interface";
import ChattingGroupModel from "@app/models/chatting-group.model";

@Component({
    selector: 'app-new-friend',
    templateUrl: './new-friend.component.html',
    styleUrls: ['./new-friend.component.scss']
})

export class NewFriendComponent implements OnInit {
    private localUserInfo: LocalUserinfoModel = this.localUserService.localUserInfo;
    public model_list: any[];

    constructor(private restService: RestService, private localUserService: LocalUserService) {
        this.restService.getNewFriend().subscribe(res => {
            this.model_list = res.data;

            //this.model_list.push({
            //    reqUserId: 1000400,
            //    reqUserAvatar: 'https://strawberry-im.oss-cn-shenzhen.aliyuncs.com/default_portrait/avatar_man_1.png',
            //    reqDesc: 'I am your classmate',
            //    reqTime: '',
            //    userId: 0,
            //    reqUserNickname: 'cloudsky'
            //});

            //this.model_list.push({
            //    reqUserId: 1000400,
            //    reqUserAvatar: 'https://strawberry-im.oss-cn-shenzhen.aliyuncs.com/default_portrait/avatar_man_1.png',
            //    reqDesc: 'I am your classmate',
            //    reqTime: '',
            //    userId: 0,
            //    reqUserNickname: 'cloudsky'
            //});
        });
    }

    ngOnInit(): void {

    }

    refuse(item) {
        console.log('newfriend, refuse: ', item);
    }

    agree(item) {
        console.log('newfriend, agree: ', item);
    }

}
