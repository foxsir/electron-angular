import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";

import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import { RestService } from "@services/rest/rest.service";
import { LocalUserService } from "@services/local-user/local-user.service";

@Component({
    selector: 'app-my-signature',
    templateUrl: './my-signature.component.html',
    styleUrls: ['./my-signature.component.scss']
})

export class MySignatureComponent implements OnInit {
    @Input() drawer: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);

    public whatSUp = "";

    constructor(private dom: DomSanitizer, private restService: RestService, private localUserService: LocalUserService) {

        const localUserInfo = this.localUserService.getObj();
        console.log('localUserInfo: ', localUserInfo);
        this.restService.getUserBaseById(localUserInfo.userId.toString()).subscribe(res => {
            console.log('MySignatureComponent result: ', res);
            this.whatSUp = res.data.whatSUp;
        });
    }

    ngOnInit(): void {

    }

    save() {
        console.log('whatSUp: ', this.whatSUp);

        var data = {
            whatSUp: this.whatSUp
        };

        this.restService.updateUserBaseById(data).subscribe(res => {

        });
    }
}

