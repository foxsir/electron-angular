import {Component, Inject, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import EmojiMap from "./EmojiMap";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-message-text',
  templateUrl: './message-text.component.html',
  styleUrls: ['./message-text.component.scss']
})
export class MessageTextComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  constructor(
    private dom: DomSanitizer,
  ){
  }

  ngOnInit() {
    this.showEmoji();
  }

  showEmoji() {
    const content = this.chatMsg.text;
    content.split("/").forEach(item => {
      const emoji = ["/", item].join("");
      if(EmojiMap.hasOwnProperty(emoji)) {
        const img = document.createElement("img");

        img.className = 'emoji-icon';
        img.src = ['/assets/emojis', EmojiMap[emoji]].join("/");
        this.chatMsg.text = this.chatMsg.text.replace(emoji, img.outerHTML);
      }
    });
  }

}
