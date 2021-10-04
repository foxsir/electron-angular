import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

class NoTalk {
  isBanned: boolean;
  banTime: number;
  sendId: string;
  msg: string;
  adminId: string;
  uuid: string;
}

@Component({
  selector: 'app-message-no-talk',
  templateUrl: './message-no-talk.component.html',
  styleUrls: ['./message-no-talk.component.scss']
})
export class MessageNoTalkComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  public noTalk: NoTalk;

  constructor() { }

  ngOnInit(): void {
    this.noTalk = JSON.parse(this.chatMsg.text);
  }

}
