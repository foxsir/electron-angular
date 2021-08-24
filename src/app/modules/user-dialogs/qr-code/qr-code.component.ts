import { Component, OnInit } from '@angular/core';
import { LocalUserService } from "@services/local-user/local-user.service";
import { RestService } from "@services/rest/rest.service";

@Component({
    selector: 'app-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

    public value = "none";
    public qrcodesize = 260;
    public whatsup = "";

    constructor(private localUserService: LocalUserService, private restService: RestService) { }

    ngOnInit(): void {
        const localUserInfo = this.localUserService.getObj();
        this.value = localUserInfo.userId.toString();

        console.log('二维码页面，用户信息：', localUserInfo);

        this.restService.getUserBaseById(localUserInfo.userId.toString()).subscribe(res => {
            console.log('QrCodeComponent result: ', res);
            this.whatsup = res.data.whatSUp;
        });
    }

}
