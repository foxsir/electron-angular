import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {DialogService} from "@services/dialog/dialog.service"; // 必需

@Component({
  selector: 'app-demo-dialog',
  templateUrl: './demo-dialog.component.html',
  styleUrls: ['./demo-dialog.component.scss']
})
export class DemoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DemoDialogComponent>, // 必需
    @Inject(MAT_DIALOG_DATA) public data: unknown, // 必需
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  close() {
    const result = {};
    this.dialogRef.close(result);
    // this.dialogRef.close(true);
    // this.dialogRef.close(100);
  }

  // 示例
  demo() {
    const data = {

    };
    this.dialogService.openDialog(DemoDialogComponent, {data: data}).then((res: unknown) => {
      console.dir(res);
    });
  }


}
