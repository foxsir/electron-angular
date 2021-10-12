import { Injectable } from '@angular/core';
import content from './workerContent';
import MBDataReciever from "@app/client/mb_data_reciever";

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private worker: Worker = null;
  private mbDataReciever = new MBDataReciever();

  constructor() {
    if(this.worker === null) {
      const response = content.toString();

      const blob = new Blob([response], {type: 'application/javascript'});
      this.worker = new Worker(URL.createObjectURL(blob));
      this.onMessage();
    }
  }

  login(url: string, data: string) {
    this.worker.postMessage({type: 'login', data: {url: url, data: data}});
  }

  logout(data: string) {
    this.worker.postMessage({type: 'logout', data: data});
    this.worker = null;
  }

  post(data: string) {
    this.worker.postMessage({type: 'message', data: data});
  }

  private onMessage() {
    this.worker.onmessage = (e) => {
      // e.data
      this.mbDataReciever.handleProtocal(JSON.parse(e.data.event));
    };
  }

}
