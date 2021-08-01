import {Component, Input, OnInit} from '@angular/core';
import Chatting from "@app/models/Chatting";

@Component({
  selector: 'app-search-chatting',
  templateUrl: './search-chatting.component.html',
  styleUrls: ['./search-chatting.component.scss']
})
export class SearchChattingComponent implements OnInit {
  @Input() chatting: Chatting;

  currentTab: "chat" | "media" | "file" = "chat";

  constructor() {
  }

  ngOnInit(): void {
  }

}
