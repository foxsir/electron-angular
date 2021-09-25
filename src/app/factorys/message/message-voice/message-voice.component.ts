import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import BenzAMRRecorder from 'benz-amr-recorder';
import {FileService} from "@services/file/file.service";

@Component({
  selector: 'app-message-voice',
  templateUrl: './message-voice.component.html',
  styleUrls: ['./message-voice.component.scss']
})
export class MessageVoiceComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  @Input() wrapDiv: HTMLDivElement;
  public resource: SafeResourceUrl;

  private amr: BenzAMRRecorder = null;

  public amr_data = {
    status: 'stop', /* stop/playing */
    current: "0.00",
    all: "0.00",
    pro_width: 0,
  };

  constructor(
    private dom: DomSanitizer,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.wrapDiv.style.background = 'transparent';
    this.amrInit();
  }

  async amrInit() {
    this.amr = new BenzAMRRecorder();
    await this.amr.initWithUrl(this.chatMsg.text.split("_Voice_")[1]).then(() => {
      this.amr_data.all = this.amr.getDuration().toString();
    });
  }

  async amrPLay(): Promise<any> {
    if(this.amr_data.pro_width === 0) {
      await this.amrInit();
      this.amr.play();
      this.amr_data.status = "playing";
      const progress = setInterval(() => {
        const position = this.amr.getCurrentPosition().toFixed(2);
        this.amr_data.current = position;
        this.amr_data.pro_width = (parseFloat(position) / this.amr.getDuration()) * 100;
        if (position === '0.00') {
          clearInterval(progress);
          console.log('clear');
          this.amr_data.status = "stop";
        }
      }, 10);

      this.amr.onAutoEnded(() => {
        console.log('Event: autoEnded');
      });
      this.amr.onStartRecord(() => {
        console.log('Event: startRecord');
      });
      this.amr.onFinishRecord(() => {
        console.log('Event: finishRecord');
      });
      this.amr.onCancelRecord(() => {
        console.log('Event: cancelRecord');
      });
    } else {
      this.amr.play();
      this.amr_data.status = "playing";
    }
  }

  stop() {
    this.amr.stop();
  }

}
