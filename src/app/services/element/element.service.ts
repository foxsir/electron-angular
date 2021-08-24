import { Injectable } from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ElementService {

  // 选择消息
  private selectMessageSource = new Subject<boolean>();
  selectMessage$ = this.selectMessageSource.asObservable();

  constructor() { }

  selectMessage(directive: boolean) {
    this.selectMessageSource.next(directive);
  }
}
