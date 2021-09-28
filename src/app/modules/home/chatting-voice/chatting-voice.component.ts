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
import callAccept from "@app/assets/icons/call_accept.svg";
import callHangup from "@app/assets/icons/call_hangup.svg";

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
    public callAccept = this.dom.bypassSecurityTrustResourceUrl(callAccept);
    public callHangup = this.dom.bypassSecurityTrustResourceUrl(callHangup);

    public view_mode = "default";
    public localUserInfo: LocalUserinfoModel;
    public chatUserid = "";

    public joinChannelEx = window['joinChannelEx'];
    public leaveChannel = window['leaveChannel'];

    public imres: any;
    public datacontent: any;

    constructor(
        private dom: DomSanitizer,
        private restService: RestService,
        private dialogService: DialogService,
        private messageService: MessageService,
        private localUserService: LocalUserService,
    ) {

    }

    ngOnInit(): void {
        console.log('语音聊天 初始化: ', this.currentChat, this.currentChat.alarmItem.dataId);
        this.chatUserid = this.currentChat.alarmItem.dataId;

        this.localUserInfo = this.localUserService.localUserInfo;
    }

    /* 向好友发起语音请求 */
    startVoice() {
        console.log('发起语音聊天...');

        //if (this.currentChat.metadata.chatType === 'friend') {
        //    this.messageService.sendMessage(120, this.currentChat.alarmItem.dataId, 'start_voice').then(res => {
        //        if (res.success === true) {
        //            this.view_mode = "wait_answer_1";
        //            this.restService.generateAgoraToken(this.chatUserid, true).subscribe(res => {
        //                console.log('生成声网Token：', res.data.accessToken);
        //                this.joinChannelEx(JSON.stringify({ userid: this.localUserInfo.userId.toString(), token: res.data.accessToken, touserid: this.chatUserid, islanch: true }));
        //            });
        //        }
        //    });
        //}
        //else if (this.currentChat.metadata.chatType === 'group') {
        //    this.messageService.sendGroupMessage(120, this.currentChat.alarmItem.dataId, 'start_voice').then(res => {
        //        if (res.success === true) {
        //            this.view_mode = "wait_answer_1";
        //            this.restService.generateAgoraToken(this.chatUserid, true).subscribe(res => {
        //                console.log('生成声网Token：', res.data.accessToken);
        //                this.joinChannelEx(JSON.stringify({ userid: this.localUserInfo.userId.toString(), token: res.data.accessToken, touserid: this.chatUserid, islanch: true }));
        //            });
        //        }
        //    });
        //}

        //xxx
        //console.log('本地用户信息：', this.localUserInfo);
        //return;

        this.restService.generateAgoraToken(this.chatUserid, true).subscribe(res => {
            console.log('生成声网Token：', res.data.accessToken);
            let fromuserid = this.localUserInfo.userId.toString();
            let touserid = this.chatUserid.toString();

            var dataContent = {
                Mode: 1,
                Conference: false,
                ChanId: fromuserid + '-' + touserid,
                toUserId: touserid,
                fromUserId: fromuserid,
                from_name: this.localUserInfo.nickname,
                from_avatar: this.localUserInfo.userAvatarFileName,
                to_name: this.currentChat.alarmItem.avatar,
                to_avatar: this.currentChat.alarmItem.title,
                token: res.data.accessToken,
            };
            var imdata = {
                bridge: false,
                type: 2,
                dataContent: JSON.stringify(dataContent),
                from: fromuserid,
                to: touserid,
                fp: '1d3c8f2c-2d0e-4d5e-b9b8-6b9860059596',
                QoS: true,
                sm: 0,
                typeu: 17,
            };

            this.imres = imdata;
            this.datacontent = dataContent;

            console.log('发送语音请求，data：', imdata, dataContent);
            this.messageService.sendCustomerMessage(imdata).then(res => {
                if (res.success === true) {
                    console.log('等待中...');
                    this.view_mode = "wait_answer_1";
                    this.joinChannelEx(JSON.stringify({
                        userid: imdata.from,
                        token: dataContent.token,
                        touserid: this.chatUserid,
                        islanch: true
                    }));
                }
            });
        });
    }

    /* 好友收到语音请求 */
    public openPanel(imres:any, datacontent:any) {
        console.log('收到语音请求...');
        this.view_mode = "wait_answer_2";
        this.imres = imres;
        this.datacontent = datacontent;
    }

    /* 接收语音请求 */
    receiveVoice() {
        console.log('接收语音请求...');

        this.imres.typeu = 19;
        this.messageService.sendCustomerMessage(this.imres).then(res => {
            if (res.success === true) {
                this.view_mode = "had_receive_voice";

                var jstoken = {
                    userid: this.localUserInfo.userId.toString(),
                    token: this.datacontent.token,
                    touserid: this.chatUserid,
                    islanch: false
                };
                this.joinChannelEx(JSON.stringify(jstoken));
            }
        });

        //this.restService.generateAgoraToken(this.chatUserid, false).subscribe(res => {
        //    console.log('生成声网Token：', res.data.accessToken);
        //    this.joinChannelEx(JSON.stringify({ userid: this.localUserInfo.userId.toString(), token: res.data.accessToken, touserid: this.chatUserid, islanch: false }));
        //});

        //if (this.currentChat.metadata.chatType === 'friend') {
        //    this.messageService.sendMessage(120, this.currentChat.alarmItem.dataId, 'receive_voice').then(res => {
        //        if (res.success === true) {
        //            this.view_mode = "had_receive_voice";
        //        }
        //    });
        //}
        //else if (this.currentChat.metadata.chatType === 'group') {
        //    this.messageService.sendGroupMessage(120, this.currentChat.alarmItem.dataId, 'receive_voice').then(res => {
        //        if (res.success === true) {
        //            this.view_mode = "had_receive_voice";
        //        }
        //    });
        //}
    }


    /* 接收语音请求之后，回调通知 */
    hadReceiveVoice() {
        console.log('接收语音请求之后，回调通知');
    }

    /* 挂断语音: 主动（发起者或者接收者都可以主动挂断语音） */
    endVoice(end_type) {
        //if (this.currentChat.metadata.chatType === 'friend') {
        //    this.messageService.sendMessage(120, this.currentChat.alarmItem.dataId, 'end_voice').then(res => {
        //        if (res.success === true) {
        //            this.leaveChannel('');
        //            this.view_mode = "default";
        //            this.drawer.close();
        //        }
        //    });
        //}

        this.imres.typeu = end_type == 'refuse' ? 18 : 21;
        this.messageService.sendCustomerMessage(this.imres).then(res => {
            if (res.success === true) {
                this.view_mode = "default";
                this.leaveChannel('');
                this.drawer.close();
            }
        });
    }

    /* 挂断语音：被动（对方挂断语音，通知对方） */
    endVoiceCallback() {
        console.log('关闭语音...');

        this.leaveChannel('');
        this.view_mode = "default";
        this.drawer.close();
    }
}
