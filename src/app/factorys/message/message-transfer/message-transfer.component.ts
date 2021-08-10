import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Component({
  selector: 'app-message-transfer',
  templateUrl: './message-transfer.component.html',
  styleUrls: ['./message-transfer.component.scss']
})
export class MessageTransferComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  constructor() { }

  ngOnInit(): void {
  }

}
