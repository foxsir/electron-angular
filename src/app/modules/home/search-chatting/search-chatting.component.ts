import {Component, Input, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";

@Component({
  selector: 'app-search-chatting',
  templateUrl: './search-chatting.component.html',
  styleUrls: ['./search-chatting.component.scss']
})
export class SearchChattingComponent implements OnInit {
  @Input() chatting: ChattingModel;

  currentTab: "chat" | "media" | "file" = "chat";

  constructor() {
  }

  ngOnInit(): void {
  }

}
