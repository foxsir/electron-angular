import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "@services/dialog/dialog.service"; // 必需
import {RestService} from "@services/rest/rest.service";
import {RedPacketInterface} from "@app/interfaces/red-packet.interface";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {RedPacketResponseInterface} from "@app/interfaces/red-packet-response.interface";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import CommonTools from "@app/common/common.tools";

@Component({
  selector: 'app-red-pocket',
  templateUrl: './red-pocket.component.html',
  styleUrls: ['./red-pocket.component.scss']
})
export class RedPocketComponent implements OnInit {

  public defaultGreetings = "恭喜发财，大吉大利";

  public requirePayPassword = false;
  public payPassword: string = "";

  constructor(
    public dialogRef: MatDialogRef<RedPocketComponent, Partial<RedPacketInterface>>, // 必需
    @Inject(MAT_DIALOG_DATA) public data: any, // 必需
    private dialogService: DialogService,
    private restService: RestService,
    private snackBarService: SnackBarService,
  ) {
  }

  ngOnInit(): void {
    this.dialogRef.addPanelClass("send-red-bag-dialog");
    /*是否设置支付密码*/
    this.restService.checkPayKeyIsExist().subscribe((res: NewHttpResponseInterface<number>) => {
      console.log('是否设置支付密码：', res.data);
      this.requirePayPassword = res.data === 1;
    });
    this.data.count = 1; // 设置默认红包个数
    console.log('红包弹出框初始化 data：', this.data);
  }

  close() {
    this.dialogRef.removePanelClass("send-red-bag-dialog");
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

    const data: Partial<RedPacketInterface> = {
      count: Boolean(this.data.count) ? this.data.count : 1,
      greetings: this.data.greetings ? this.data.greetings : this.defaultGreetings,
      money: this.data.money,
      toUserId: this.data.toUserId,
      word: '', // 口令
      type: 1,
      ok: false,
    };
    if(this.requirePayPassword) {
      data.payKey = CommonTools.md5(this.payPassword);
    }

    if(this.requirePayPassword) {
      if(this.payPassword.length === 0) {
        this.snackBarService.openMessage("请输入支付密码");
        return false;
      }
      this.data.payKey = CommonTools.md5(this.data.payKey);
    }

    this.restService.sentRedPacket(data).subscribe((res: NewHttpResponseInterface<RedPacketResponseInterface>) => {
      if (res.status === 200) {
        data.res = res.data;
        data.ok = true;
        this.dialogRef.close(data);
      } else {
        // this.dialogRef.close(null);
        const msg = res.data || res.msg;
        this.snackBarService.openMessage(String(msg));
      }
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
