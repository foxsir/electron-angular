import { Component, Input, OnInit } from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "@services/message/message.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";

import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import { RestService } from "@services/rest/rest.service";
import { DemoDialogComponent } from "@modules/setting-dialogs/demo-dialog/demo-dialog.component";
import { DialogService } from "@services/dialog/dialog.service";
import { LocalUserService } from "@services/local-user/local-user.service";

@Component({
    selector: 'app-chatting-voice',
    templateUrl: './chatting-voice.component.html',
    styleUrls: ['./chatting-voice.component.scss']
})
export class ChattingVoiceComponent implements OnInit {
    @Input() currentChat: AlarmItemInterface;
    @Input() drawer: MatDrawer;

    public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
    public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
    public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
    public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);

    public view_mode = "default";
    public localUserInfo: LocalUserinfoModel;

    constructor(
        private dom: DomSanitizer,
        private restService: RestService,
        private dialogService: DialogService,
        private messageService: MessageService,
        private localUserService: LocalUserService,
    ) {

    }

    ngOnInit(): void {
        console.log('chatingVoice ngOnInit: ', this.currentChat);

        this.localUserInfo = this.localUserService.localUserInfo;
    }

    /* 向好友发起语音请求 */
    startVoice() {
        console.log('发起语音聊天...');

        if (this.currentChat.metadata.chatType === 'friend')
        {
            this.messageService.sendMessage(120, this.currentChat.alarmItem.dataId, 'start_voice').then(res => {
                if (res.success === true) {
                    this.view_mode = "wait_answer_1";
                    joinChannelEx(this.localUserInfo.userId.toString());
                }
            });
        }
        else if (this.currentChat.metadata.chatType === 'group')
        {
            this.messageService.sendGroupMessage(120, this.currentChat.alarmItem.dataId, 'start_voice').then(res => {
                if (res.success === true) {
                    this.view_mode = "wait_answer_1";
                    joinChannelEx(this.localUserInfo.userId.toString());
                }
            });
        }
    }

    /* 好友收到语音请求 */
    public openPanel() {
        console.log('收到语音请求...');
        this.view_mode = "wait_answer_2";
    }

    /* 接收语音请求 */
    receiveVoice() {
        console.log('接收语音请求...');
        joinChannelEx(this.localUserInfo.userId.toString());

        if (this.currentChat.metadata.chatType === 'friend') {
            this.messageService.sendMessage(120, this.currentChat.alarmItem.dataId, 'receive_voice').then(res => {
                if (res.success === true) {
                    this.view_mode = "had_receive_voice";
                }
            });
        }
        else if (this.currentChat.metadata.chatType === 'group') {
            this.messageService.sendGroupMessage(120, this.currentChat.alarmItem.dataId, 'receive_voice').then(res => {
                if (res.success === true) {
                    this.view_mode = "had_receive_voice";
                }
            });
        }
    }


    /* 接收语音请求之后，回调通知 */
    hadReceiveVoice() {
        console.log('接收语音请求之后，回调通知');
    }
}
