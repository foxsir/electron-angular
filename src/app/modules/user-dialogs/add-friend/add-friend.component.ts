import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import FriendModel from "@app/models/friend.model";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "../../../interfaces/new-http-response.interface";

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent implements OnInit {
  public friend: FriendModel = null;
  public txtMsg: string ="";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // 必需
    private dialogRef: MatDialogRef<AddFriendComponent>,
    private restService: RestService,
  ) {}

  ngOnInit(): void {
    console.dir(this.data)
  }



  cancel() {
    this.dialogRef.close();
  }

  confirmAdd() {
    const result = {
      ok: true,
      txtMsg: this.txtMsg,
    }; console.dir(result);
    this.dialogRef.close(result);
  }
}
