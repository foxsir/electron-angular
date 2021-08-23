import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import FriendModel from "@app/models/friend.model";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {UserModel} from "@app/models/user.model";
import {FileService} from "@services/file/file.service";
import {AvatarService} from "@services/avatar/avatar.service";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  public user: UserModel;
  public userAvatar: string = this.avatarService.defaultLocalAvatar;

  constructor(
    public dialogRef: MatDialogRef<UserInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {userId: number},
    private restService: RestService,
    private fileService: FileService,
    private avatarService: AvatarService,
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    this.restService.getUserBaseById(this.data.userId.toString()).subscribe((res: NewHttpResponseInterface<UserModel>) => {
      if(res.status === 200 && res.data) {
        this.user = res.data;
        this.avatarService.getAvatar(this.user.userUid.toString(), this.user.userAvatarFileName).then(url => {
          this.userAvatar = url;
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
