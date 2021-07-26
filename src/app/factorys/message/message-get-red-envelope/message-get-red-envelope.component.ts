import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-get-red-envelope',
  templateUrl: './message-get-red-envelope.component.html',
  styleUrls: ['./message-get-red-envelope.component.scss']
})
export class MessageGetRedEnvelopeComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
