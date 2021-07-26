import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-no-talk',
  templateUrl: './message-no-talk.component.html',
  styleUrls: ['./message-no-talk.component.scss']
})
export class MessageNoTalkComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
