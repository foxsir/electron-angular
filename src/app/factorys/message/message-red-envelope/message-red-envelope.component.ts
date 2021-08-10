import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Component({
  selector: 'app-message-red-envelope',
  templateUrl: './message-red-envelope.component.html',
  styleUrls: ['./message-red-envelope.component.scss']
})
export class MessageRedEnvelopeComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  constructor() { }

  ngOnInit(): void {
  }

}
