import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Component({
    selector: 'app-message-voice-call',
    templateUrl: './message-voice-call.component.html',
    styleUrls: ['./message-voice-call.component.scss']
})
export class MessageVoiceCallComponent implements OnInit {
    @Input() chatMsg: ChatmsgEntityModel;
    public msg_data = {
        duration: '',
    };

    constructor() { }

    ngOnInit(): void {
        this.msg_data = JSON.parse(this.chatMsg.text);
    }
}
