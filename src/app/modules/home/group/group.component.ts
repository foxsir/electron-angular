import { Component, OnInit } from '@angular/core';
import {RestService} from "@services/rest/rest.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import HttpPresponseModel from "@app/interfaces/http-response.interface";
import ChattingGroupModel from "@app/models/chatting-group.model";

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
    private localUserInfo: LocalUserinfoModel = this.localUserService.localUserInfo;
    public chattingGroup: ChattingGroupModel[];

    constructor(private restService: RestService, private localUserService: LocalUserService) {
        this.restService.submitGetGroupsListFromServer(this.localUserInfo.userId).subscribe((res: HttpPresponseModel) => {
            if (res.success) {
                this.chattingGroup = JSON.parse(res.returnValue);

                console.log('chattingGroup: ', this.chattingGroup);
            }
        });
    }

    ngOnInit(): void {

    }

}
