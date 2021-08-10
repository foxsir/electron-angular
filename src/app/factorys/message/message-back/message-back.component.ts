import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Component({
  selector: 'app-message-back',
  templateUrl: './message-back.component.html',
  styleUrls: ['./message-back.component.scss']
})
export class MessageBackComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  constructor() { }

  ngOnInit(): void {
  }

}
