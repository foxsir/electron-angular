import {Component, Input, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";

@Component({
  selector: 'app-chatting-setting',
  templateUrl: './chatting-setting.component.html',
  styleUrls: ['./chatting-setting.component.scss']
})
export class ChattingSettingComponent implements OnInit {
  @Input() currentChat: ChattingModel;

  constructor() { }

  ngOnInit(): void {
  }

}
