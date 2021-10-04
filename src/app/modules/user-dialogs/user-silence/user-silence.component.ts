import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {LocalUserService} from "@services/local-user/local-user.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";

@Component({
  selector: 'app-user-silence',
  templateUrl: './user-silence.component.html',
  styleUrls: ['./user-silence.component.scss']
})
export class UserSilenceComponent implements OnInit {

  public durationTime: number = 1000*60;

  public timeList = [
    {label: '5分钟', time: 1000*60},
    {label: '30分钟', time: 1000*60*30},
    {label: '1小时', time: 1000*60*60},
    {label: '12小时', time: 1000*60*60*12},
    {label: '1天', time: 1000*60*60*24},
    {label: '7天', time: 1000*60*60*24*7},
    {label: '30天', time: 1000*60*60*24*30},
    {label: '60天', time: 1000*60*60*24*60},
  ];

  constructor(
    public dialogRef: MatDialogRef<UserSilenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {alarmItem: AlarmItemInterface; chat: ChatmsgEntityModel},
    private restService: RestService,
    private localUserService: LocalUserService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
  }

  save() {
    const adminId = this.localUserService.localUserInfo.userId;
    const data = {
      clusterId: this.data.alarmItem.alarmItem.dataId.toString(),
      userId: this.data.chat.uid.toString(),
      durationTime: this.durationTime,
      adminId: adminId.toString(),
    };
    this.restService.addGroupSilence(data).subscribe((res: NewHttpResponseInterface<any>) => {
      if(res.status === 200) {
        this.dialogRef.close();
        this.snackBarService.openMessage("已经禁言");
      }
    });
  }

}
