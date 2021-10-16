import {Component, Inject, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import EmojiMap from "./EmojiMap";
import {DomSanitizer} from "@angular/platform-browser";
import {ReplyMessageType} from "@app/interfaces/reply-message.interface";
import {ReplyContentType} from "@app/interfaces/reply-content.interface";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";
import {DialogService} from "@services/dialog/dialog.service";
import {MessageMergeMultipleComponent} from "@app/factorys/message/message-merge-multiple/message-merge-multiple.component";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {LocalUserService} from "@services/local-user/local-user.service";

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

  public localUserInfo: LocalUserinfoModel;

  public content: string;

  public messageType = {
    [0]: '普通文字',
    [1]: '图片',
    [2]: '语音留言',
    [5]: '文件',
    [6]: '短视频',
    [7]: '名片',
    [8]: '位置',
    [10]: '红包',
    [11]: '撤回',
    [12]: '禁言',
    [19]: '回复',
    [21]: '语音聊天',
    [90]: '系统或提示',
  };

  constructor(
    private dom: DomSanitizer,
    private quoteMessageService: QuoteMessageService,
    private dialogService: DialogService,
    private localUserService: LocalUserService,
  ){
    this.localUserInfo = this.localUserService.localUserInfo;
  }

  ngOnInit() {
    this.content = this.showEmoji(this.chatMsg.text as string);
    // const chat = this.quoteMessageService.checkMessageIsPureText(this.chatMsg.text as string);
    // if (chat === true) {
    //   this.chatMsg.text = this.showEmoji(this.chatMsg.text as string);
    // } else {
    //   // 回复消息类型
    //   this.newChatMsg = chat as ReplyMessageType;
    //   const reply = this.quoteMessageService.checkReplyContent(this.newChatMsg.reply);
    //   if(typeof reply === 'string') {
    //     this.replyContentText = reply;
    //   } else if (typeof reply === 'object') {
    //     this.replyContentData = reply;
    //   } else if(this.newChatMsg.messages) {
    //     // console.dir(this.newChatMsg.messages);
    //   }
    //   this.pureTextMessage = false;
    // }
  }

  showEmoji(content: string) {
    content = this.encode(content);
    for (const emojiMapKey in EmojiMap) {
      if(EmojiMap[emojiMapKey]) {
        const tp = content.split(emojiMapKey);
        if(tp.length > 1) {
          const img = document.createElement("img");
          img.className = 'emoji-icon';
          img.src = ['assets/emojis', EmojiMap[emojiMapKey]].join("/");
          content = tp.join(img.outerHTML);
        }
      }
    }


    return content.split("\n").join('<br />');
  }

  /**
   * 将html标签转化为实体字符
   * @param html
   */
  encode(html): string {
    return String(html)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // typeof(data: any): string {
  //   return typeof data;
  // }
  //
  // showMultipleMessage() {
  //   this.dialogService.openDialog(MessageMergeMultipleComponent, {
  //     data: this.newChatMsg.messages,
  //     width: '430px'
  //   }).then();
  // }
  //
  // parseNewMsg(msg: string): string {
  //   return msg;
  // }

}
