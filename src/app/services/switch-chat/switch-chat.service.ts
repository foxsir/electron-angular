import { Injectable } from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SwitchChatService {

  private currentChatSource = new Subject<AlarmItemInterface>();
  public currentChat$ = this.currentChatSource.asObservable();

  constructor() { }

  switch(alarm: AlarmItemInterface) {
    this.currentChatSource.next(alarm);
  }
}
