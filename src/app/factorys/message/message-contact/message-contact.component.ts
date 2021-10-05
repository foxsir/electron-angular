import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {AvatarService} from "@services/avatar/avatar.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {DialogService} from "@services/dialog/dialog.service";
import {UserContactCardComponent} from "@modules/user-dialogs/user-contact-card/user-contact-card.component";

interface UserContact {
  uid: number;
  nickName: string;
  userAvatar: string;
}

@Component({
  selector: 'app-message-contact',
  templateUrl: './message-contact.component.html',
  styleUrls: ['./message-contact.component.scss']
})
export class MessageContactComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public userContact: UserContact;
  public userAvatar: SafeResourceUrl;

  constructor(
    private avatarService: AvatarService,
    private dom: DomSanitizer,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.userContact = JSON.parse(this.chatMsg.text);

    this.userAvatar = this.dom.bypassSecurityTrustResourceUrl(this.userContact.userAvatar);
  }

  showContact() {
    this.dialogService.openDialog(UserContactCardComponent, {
      data: this.chatMsg
    }).then();
  }

}
