import {Component, Input, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";

@Component({
  selector: 'app-search-chatting',
  templateUrl: './search-chatting.component.html',
  styleUrls: ['./search-chatting.component.scss']
})
export class SearchChattingComponent implements OnInit {
  @Input() chatting: AlarmItemInterface;

  currentTab: "chat" | "media" | "file" = "chat";

  constructor() {
  }

  ngOnInit(): void {
  }

}
