import { Component, OnInit } from '@angular/core';
import { LocalUserService } from "@services/local-user/local-user.service";

@Component({
    selector: 'app-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

    public value = "none";
    public qrcodesize = 250;

    constructor(private localUserService: LocalUserService) { }

    ngOnInit(): void {
        const localUserInfo = this.localUserService.getObj();
        this.value = localUserInfo.userId.toString();
    }

}
