import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {ProtocalModelDataContent} from "@app/models/protocal.model";
import {InputAreaService} from "@services/input-area/input-area.service";

@Component({
  selector: 'app-silence-count-down',
  templateUrl: './silence-count-down.component.html',
  styleUrls: ['./silence-count-down.component.scss']
})
export class SilenceCountDownComponent implements OnInit {
  @Input() timestamp: number;
  @Output() silenceDone = new EventEmitter<boolean>();

  public days: number = 0;
  public hours: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;

  private interval: any;

  constructor(
    private inputAreaService: InputAreaService,
  ) { }

  ngOnInit(): void {
    this.updateTimer();
    this.inputAreaService.disableToTime(this.timestamp);
    this.interval = setInterval(() => {
      if(this.days + this.hours + this.minutes + this.seconds === 0) {
        clearInterval(this.interval);
        this.silenceDone.emit(true);
      } else {
        this.updateTimer();
      }
    }, 1000);
  }

  updateTimer() {
    const future = new Date(this.timestamp).getTime();
    const now = new Date().getTime();
    const diff = future - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    const secs = Math.floor(diff / 1000);

    this.days = days;
    this.hours = hours - days * 24;
    this.minutes = mins - hours * 60;
    this.seconds = secs - mins * 60;
  }

}
