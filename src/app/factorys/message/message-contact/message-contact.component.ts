import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

interface UserContact {
  uid: string;
  nickName: string
}

@Component({
  selector: 'app-message-contact',
  templateUrl: './message-contact.component.html',
  styleUrls: ['./message-contact.component.scss']
})
export class MessageContactComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;
  public userContact: UserContact;

  constructor() { }

  ngOnInit(): void {
    this.userContact = JSON.parse(this.chatMsg.text);
  }

}
