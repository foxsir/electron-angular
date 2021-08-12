import {Component, Input, OnInit} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {DomSanitizer} from "@angular/platform-browser";

import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import {RestService} from "@services/rest/rest.service";

@Component({
  selector: 'app-privacy-setting',
  templateUrl: './privacy-setting.component.html',
  styleUrls: ['./privacy-setting.component.scss']
})
export class PrivacySettingComponent implements OnInit {
  @Input() drawer: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);

    public privacySetting;
    public setting_data = {
        isSearchPhone: false,
        isSearchUid: false,
        isQr: false,
        isGroup: false,
        isCard: false,
        isTemporary: false,
        isPublishLimit: '0',
    };

    public publish_limit_list = [
        { value: 0, label: 'x' },
        { value: 1, label: 'x' },
        { value: 2, label: 'xx' },
        { value: 3, label: 'xx' },
    ];

    constructor(private dom: DomSanitizer, private restService: RestService) {
        this.restService.getPrivacyConfigById().subscribe(res => {
            console.log('getPrivacyConfigById result: ', res);
            this.privacySetting = res.data;

            this.setting_data.isSearchPhone = this.privacySetting.privacyConfig.isSearchPhone == 1;
            this.setting_data.isSearchUid = this.privacySetting.privacyConfig.isSearchUid == 1;
            this.setting_data.isQr = this.privacySetting.privacyConfig.isQr == 1;
            this.setting_data.isGroup = this.privacySetting.privacyConfig.isGroup == 1;
            this.setting_data.isCard = this.privacySetting.privacyConfig.isCard == 1;
            this.setting_data.isTemporary = this.privacySetting.privacyConfig.isTemporary == 1;
            this.setting_data.isPublishLimit = '' + this.privacySetting.privacyConfig.isPublishLimit + '';
        });
    }

    ngOnInit(): void {

    }

    bySwitch(key) {
        var data = {
            id: this.privacySetting.privacyConfig.id
        };
        data[key] = this.setting_data[key] == true ? 1 : 0,

        this.restService.updatePrivacyConfig(data).subscribe(res => {

        });
    }

    setPublishLimit() {
        console.log('setting_data.isPublishLimit: ', this.setting_data.isPublishLimit);

        var data = {
            id: this.privacySetting.privacyConfig.id
        };
        data['isPublishLimit'] = this.setting_data.isPublishLimit,

        this.restService.updatePrivacyConfig(data).subscribe(res => {
             
        });
    }

}
