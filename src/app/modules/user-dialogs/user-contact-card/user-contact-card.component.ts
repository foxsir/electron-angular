import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {AvatarService} from "@services/avatar/avatar.service";

interface UserContact {
  uid: number;
  nickName: string;
  userAvatar: string;
}

@Component({
  selector: 'app-user-contact-card',
  templateUrl: './user-contact-card.component.html',
  styleUrls: ['./user-contact-card.component.scss']
})
export class UserContactCardComponent implements OnInit {
  public userContact: UserContact;
  public userAvatar: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<UserContactCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChatmsgEntityModel,
    private dom: DomSanitizer,
    private avatarService: AvatarService,
  ) {}

  ngOnInit(): void {
    this.userContact = JSON.parse(this.data.text);
    this.userAvatar = this.dom.bypassSecurityTrustResourceUrl(this.userContact.userAvatar);
  }

}
