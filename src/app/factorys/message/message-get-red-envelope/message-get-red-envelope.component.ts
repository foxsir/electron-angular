import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Component({
  selector: 'app-message-get-red-envelope',
  templateUrl: './message-get-red-envelope.component.html',
  styleUrls: ['./message-get-red-envelope.component.scss']
})
export class MessageGetRedEnvelopeComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  constructor() { }

  ngOnInit(): void {
  }

}
