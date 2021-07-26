import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-red-envelope',
  templateUrl: './message-red-envelope.component.html',
  styleUrls: ['./message-red-envelope.component.scss']
})
export class MessageRedEnvelopeComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
