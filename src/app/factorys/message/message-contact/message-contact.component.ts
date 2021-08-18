import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {AvatarService} from "@services/avatar/avatar.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

interface UserContact {
  uid: number;
  nickName: string;
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
  ) { }

  ngOnInit(): void {
    this.userContact = JSON.parse(this.chatMsg.text);

    this.avatarService.getAvatar(this.userContact.uid.toString()).then(res => {
      this.userAvatar = this.dom.bypassSecurityTrustResourceUrl(res);
    });
  }

}
