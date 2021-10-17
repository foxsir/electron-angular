import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";

@Component({
  selector: 'app-group-notice',
  templateUrl: './group-notice.component.html',
  styleUrls: ['./group-notice.component.scss']
})
export class GroupNoticeComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<GroupNoticeComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string; txt: string} // 必需
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
