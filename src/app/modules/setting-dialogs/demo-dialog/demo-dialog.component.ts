import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import { DialogService } from "@services/dialog/dialog.service";
import { DomSanitizer } from "@angular/platform-browser";

import checkboxIcon from "@app/assets/icons/checkbox-unactive.svg";
import checkboxActiveIcon from "@app/assets/icons/checkbox-active.svg";

@Component({
    selector: 'app-demo-dialog',
    templateUrl: './demo-dialog.component.html',
    styleUrls: ['./demo-dialog.component.scss']
})
export class DemoDialogComponent implements OnInit {

    public internel_list = [3, 5, 10, 15, 20, 30, 60, 120];

    public checkboxIcon = this.dom.bypassSecurityTrustResourceUrl(checkboxIcon);
    public checkboxActiveIcon = this.dom.bypassSecurityTrustResourceUrl(checkboxActiveIcon);

    constructor(
        public dialogRef: MatDialogRef<DemoDialogComponent>, // 必需
        @Inject(MAT_DIALOG_DATA) public data: any, // 必需
        private dialogService: DialogService,
        private dom: DomSanitizer,
    ) {

    }

    ngOnInit(): void {

    }

    cancel() {
        const result = {
            ok: false
        };
        this.dialogRef.close(result);
    }

    saveFriendRemark(ok) {
        console.log('saveFriendRemark');
        const result = {
            ok: ok,
            remark: (<any>this.data).remark,
        };
        this.dialogRef.close(result);
    }

    setInternel(item) {
        this.data.talkInterval = item;
    }

    savetalkInterval(ok) {
        console.log('savetalkInterval');
        const result = {
            ok: ok,
            talkInterval: (<any>this.data).talkInterval,
        };
        this.dialogRef.close(result);
    }


}
