import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ReplyMessageChildMessage} from "@app/interfaces/reply-message.interface";

@Component({
  selector: 'app-message-merge-multiple',
  templateUrl: './message-merge-multiple.component.html',
  styleUrls: ['./message-merge-multiple.component.scss']
})
export class MessageMergeMultipleComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MessageMergeMultipleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReplyMessageChildMessage[],
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(true);
  }

}
