import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-voice',
  templateUrl: './message-voice.component.html',
  styleUrls: ['./message-voice.component.scss']
})
export class MessageVoiceComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
