import {Component, Inject, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import EmojiMap from "./EmojiMap";
import {DomSanitizer} from "@angular/platform-browser";
import {ReplyMessageType} from "@app/interfaces/reply-message.interface";
import {ReplyContentType} from "@app/interfaces/reply-content.interface";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";

@Component({
  selector: 'app-message-text',
  templateUrl: './message-text.component.html',
  styleUrls: ['./message-text.component.scss']
})
export class MessageTextComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  public pureTextMessage = true;
  public newChatMsg: ReplyMessageType;
  public replyContentText: string = null;
  public replyContentData: ReplyContentType = null;

  constructor(
    private dom: DomSanitizer,
    private quoteMessageService: QuoteMessageService,
  ){
  }

  ngOnInit() {
    const chat = this.quoteMessageService.checkMessageIsPureText(this.chatMsg.text);
    if (chat === true) {
      this.chatMsg.text = this.showEmoji(this.chatMsg.text);
    } else {
      // 回复消息类型
      this.newChatMsg = chat as ReplyMessageType;
      const reply = this.quoteMessageService.checkReplyContent(this.newChatMsg.reply);
      if(typeof reply === 'string') {
        this.replyContentText = reply;
      } else {
        this.replyContentData = reply;
      }
      this.pureTextMessage = false;
    }
  }

  showEmoji(content: string) {
    content.split("/").forEach(item => {
      const emoji = ["/", item].join("");
      if(EmojiMap.hasOwnProperty(emoji)) {
        const img = document.createElement("img");

        img.className = 'emoji-icon';
        img.src = ['/assets/emojis', EmojiMap[emoji]].join("/");
        this.chatMsg.text = this.chatMsg.text.replace(emoji, img.outerHTML);
      }
    });

    return content;
  }

  typeof(data: any): string {
    return typeof data;
  }

}
