import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Component({
  selector: 'app-message-repeal',
  templateUrl: './message-repeal.component.html',
  styleUrls: ['./message-repeal.component.scss']
})
export class MessageRepealComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  constructor() { }

  ngOnInit(): void {
  }

}
