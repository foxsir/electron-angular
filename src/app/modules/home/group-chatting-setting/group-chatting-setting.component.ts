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
    selector: 'app-group-chatting-setting',
    templateUrl: './group-chatting-setting.component.html',
    styleUrls: ['./group-chatting-setting.component.scss']
})
export class GroupChattingSettingComponent implements OnInit {
    @Input() currentChat: AlarmItemInterface; // ����ȺID��0000000642
    @Input() drawer: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);

    public groupData;
    public setting_data = {
        customerServiceSwitch: false, /*ר���ͷ�����*/
        tabSwitch: false, /*Ⱥҳǩ����*/
        topContentSwitch: false, /*Ⱥ��������*/
        silenceNotice: false, /*����֪ͨ����*/
        revocationNotice: false, /*����֪ͨ����*/
        kickNotice: false, /*��Ⱥ֪ͨ����*/
        talkIntervalSwitch: false, /*���Լ������*/
    };

    constructor(private dom: DomSanitizer, private restService: RestService) {
        console.log('currentChat: ', this.currentChat);

        this.restService.getGroupBaseById('0000000642').subscribe(res => {
            console.log('getGroupBaseById result: ', res);
            this.groupData = res.data;

            this.setting_data.customerServiceSwitch = this.groupData.customerServiceSwitch == 1;
            this.setting_data.tabSwitch = this.groupData.tabSwitch == 1;
            this.setting_data.topContentSwitch = this.groupData.topContentSwitch == 1;
            this.setting_data.silenceNotice = this.groupData.silenceNotice == 1;
            this.setting_data.revocationNotice = this.groupData.revocationNotice == 1;
            this.setting_data.kickNotice = this.groupData.kickNotice == 1;
            this.setting_data.talkIntervalSwitch = this.groupData.talkIntervalSwitch == 1;
        }); 
    }

    ngOnInit(): void {

    }

    bySwitch(key) {
        var data = {
            gid: '0000000642'
        };
        data[key] = this.setting_data[key] == true ? 1 : 0,

        this.restService.updateGroupBaseById(data).subscribe(res => {

        }); 
    }

}