import {Component, Input, OnInit} from '@angular/core';
import Chatting from "@app/models/Chatting";

@Component({
  selector: 'app-group-chatting-setting',
  templateUrl: './group-chatting-setting.component.html',
  styleUrls: ['./group-chatting-setting.component.scss']
})
export class GroupChattingSettingComponent implements OnInit {
  @Input() currentChat: Chatting;

  constructor() { }

  ngOnInit(): void {
  }

}
