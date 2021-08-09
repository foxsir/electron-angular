import {Component, Input, OnInit} from '@angular/core';
import Chatting from "@app/models/Chatting";

@Component({
  selector: 'app-chatting-setting',
  templateUrl: './chatting-setting.component.html',
  styleUrls: ['./chatting-setting.component.scss']
})
export class ChattingSettingComponent implements OnInit {
  @Input() currentChat: Chatting;

  constructor() { }

  ngOnInit(): void {
  }

}
