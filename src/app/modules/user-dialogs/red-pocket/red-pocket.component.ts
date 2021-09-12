import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import { DialogService } from "@services/dialog/dialog.service"; // 必需
import { RestService } from "@services/rest/rest.service";
import {RedPacketInterface} from "@app/interfaces/red-packet-interface";

@Component({
    selector: 'app-red-pocket',
    templateUrl: './red-pocket.component.html',
    styleUrls: ['./red-pocket.component.scss']
})
export class RedPocketComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<RedPocketComponent, Partial<RedPacketInterface>>, // 必需
        @Inject(MAT_DIALOG_DATA) public data: any, // 必需
        private dialogService: DialogService,
        private restService: RestService
    ) { }

    ngOnInit(): void {
        /*是否设置支付密码*/
        this.restService.checkPayKeyIsExist().subscribe(res => {
            console.log('是否设置支付密码：', res);
        });
        console.log('红包弹出框初始化 data：', this.data);
    }

    close() {
        const result = {};
        this.dialogRef.close(result);
    }

    /*
     * 点击 “塞进红包” 按钮，跳到输入支付密码页面
     */
    showInputPassword() {
        this.data.dialog_type = 'input_password';
        console.log('red pocket data: ', this.data);
    }

    /*
     * 取消发送红包
     */
    cancel() {
      const result = {
        ok: false
      };
      this.dialogRef.close(result);
    }

    /*
     * 确认发送红包
     */
    confirmSendRedpocket() {
      console.log('确认发送红包...');

      const data: RedPacketInterface = {
        count: this.data.count,
        greetings: this.data.greetings,
        money: this.data.money,
        toUserId: this.data.toUserId,
        word: '',
        type: 1,
        ok: false,
      };

      this.restService.sentRedPacket(data).subscribe(res => {
        data.ok = true;
        this.dialogRef.close(data);
      });
    }

    //saveFriendRemark(ok) {
    //    console.log('saveFriendRemark');
    //    const result = {
    //        ok: ok,
    //        remark: (<any>this.data).remark,
    //    };
    //    this.dialogRef.close(result);
    //}

    //savetalkInterval(ok) {
    //    console.log('savetalkInterval');
    //    const result = {
    //        ok: ok,
    //        talkInterval: (<any>this.data).talkInterval,
    //    };
    //    this.dialogRef.close(result);
    //}


}