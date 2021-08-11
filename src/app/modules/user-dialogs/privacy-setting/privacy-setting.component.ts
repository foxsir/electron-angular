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

  public findMeByPhone = false;
    public findMeByQRCode = false;
    public privacySetting;

  constructor(
    private dom: DomSanitizer,
    private restService: RestService,
  ) {
      this.restService.getPrivacyConfigById().subscribe(res => {
          console.log('getPrivacyConfigById result: ', res);
          this.privacySetting = res.data;

          this.findMeByPhone = this.privacySetting.privacyConfig.isSearchPhone == 1;
          this.findMeByQRCode = this.privacySetting.privacyConfig.isQr == 1;
      });
  }

    ngOnInit(): void {
        
    }

    byPhone() {
        // this.restService
        // RestService 中没有设置隐私的方法需要新添加
        // 隐私设置接口地址 http://120.79.90.66:3000/project/17/interface/api/49
        console.dir(this.findMeByPhone);
        console.log('privacysetting: ', this.privacySetting);

        var data = {
            id: this.privacySetting.privacyConfig.id,
            isSearchPhone: this.findMeByPhone == true ? 1 : 0,
        };
        this.restService.updatePrivacyConfig(data).subscribe(res => {

        });
    }

    byQRCode() {
        console.dir(this.findMeByQRCode);

        var data = {
            id: this.privacySetting.privacyConfig.id,
            isQr: this.findMeByQRCode == true ? 1 : 0,
        };
        this.restService.updatePrivacyConfig(data).subscribe(res => {

        });
    }

}
