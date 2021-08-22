import { Component, Input, OnInit } from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";

import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import { RestService } from "@services/rest/rest.service";

@Component({
    selector: 'app-chatting-setting',
    templateUrl: './chatting-setting.component.html',
    styleUrls: ['./chatting-setting.component.scss']
})
export class ChattingSettingComponent implements OnInit {
    @Input() currentChat: AlarmItemInterface; // 测试群ID：0000000642
    @Input() drawer: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);    

    public userData;
    public setting_data = {
        latestLoginAddres: '',
        latestLoginIp: '',
        userMail: '',
        whatSUp: '',
        nickname: '',
    };

    constructor(private dom: DomSanitizer, private restService: RestService) {
        console.log('currentChat: ', this.currentChat);

        this.restService.getUserBaseById('400340').subscribe(res => {
            console.log('getUserBaseById result: ', res);
            this.userData = res.data;

            this.setting_data.nickname = this.userData.nickname;
            this.setting_data.latestLoginAddres = this.userData.latestLoginAddres;
            this.setting_data.latestLoginIp = this.userData.latestLoginIp;
            this.setting_data.userMail = this.userData.userMail;
            this.setting_data.whatSUp = this.userData.whatSUp == null || this.userData.whatSUp.length == 0 ? '此人很懒，什么都没留下' : this.userData.whatSUp;            
        });
    }

    ngOnInit(): void {

    }
}
