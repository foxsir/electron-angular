import {Subject} from 'rxjs';
import {BaseEntity} from 'typeorm';
import IpcResponseInterface from "@app/interfaces/ipc-response.interface";
import CommonTools from "@app/common/common.tools";
const { ipcRenderer } = window.require('electron');

interface QueryParams<T> {
  model: string;
  query: Partial<T>;
  orderBy?: string[];
  uuid?: string;
}

interface SaveParams<T> {
  model: string;
  data: Partial<T>;
  update?: Partial<T>;
  uuid?: string;
}

interface DeleteParams<T> {
  model: string;
  query: Partial<T>;
  uuid?: string;
}

export abstract class DatabaseService {
  private isConnected = false;

  private connectedSource = new Subject<any>();
  private connectedUpdate$ = this.connectedSource.asObservable();

  private sendDataSource = new Subject<any>();
  private sendDataUpdate$ = this.sendDataSource.asObservable();

  private queryDataSource = new Subject<any>();
  private queryDataUpdate$ = this.queryDataSource.asObservable();

  private deleteDataSource = new Subject<any>();
  private deleteDataUpdate$ = this.deleteDataSource.asObservable();

  private dropDBSource = new Subject<any>();
  private dropDBUpdate$ = this.dropDBSource.asObservable();

  constructor() {
    if(this.isConnected !== true) {
      this.listenReply();
    }
  }

  connectionDB(name: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(this.isConnected !== true) {
        ipcRenderer.send('connectionDB', name);
        const subscribe = this.connectedUpdate$.subscribe((connected: boolean) => {
          this.isConnected = connected;
          resolve(connected);
          subscribe.unsubscribe();
        });
      } else {
        resolve(true);
      }
    });
  }

  disconnectDB() {
    this.isConnected = false;
    ipcRenderer.send('closeDB');
  }


  listenReply() {
    ipcRenderer.on('connectionDB-reply', (event, arg: boolean) => {
      this.connectedSource.next(arg);
    });

    ipcRenderer.on('sendData-reply', (event, data) => {
      this.sendDataSource.next(data);
    });

    ipcRenderer.on('queryData-reply', (event, data) => {
      this.queryDataSource.next(data);
    });

    ipcRenderer.on('deleteData-reply', (event, data) => {
      this.deleteDataSource.next(data);
    });

    ipcRenderer.on('dropDB-reply', (event, data) => {
      this.dropDBSource.next(data);
    });
  }

  saveData<T extends BaseEntity>(data: SaveParams<T>): Promise<T> {
    return new Promise((resolve) => {
      data.uuid = CommonTools.uuid();
      ipcRenderer.send('sendData', data);

      const subscribe = this.sendDataUpdate$.subscribe((res) => {
        if(res.uuid === data.uuid) {
          resolve(res);
          subscribe.unsubscribe();
        }
      });
    });
  }

  /**
   * 查询数据库 uuid 请求并发是用来区分请求
   * @param data
   */
  queryData<T extends BaseEntity>(data: QueryParams<T>): Promise<IpcResponseInterface<T>> {
    return new Promise((resolve) => {
      data.uuid = CommonTools.uuid();
      ipcRenderer.send('queryData', data);

      const subscribe = this.queryDataUpdate$.subscribe((res: IpcResponseInterface<T>) => {
        if(res.uuid === data.uuid) {
          resolve(res);
          subscribe.unsubscribe();
        }
      });
    });
  }

  /**
   * 根据条件删除数据
   * @param data
   */
  deleteData<T extends BaseEntity>(data: DeleteParams<T>): Promise<IpcResponseInterface<T>> {
    return new Promise((resolve) => {
      data.uuid = CommonTools.uuid();
      ipcRenderer.send('deleteData', data);

      const subscribe = this.deleteDataUpdate$.subscribe((res: IpcResponseInterface<T>) => {
        if(res.uuid === data.uuid) {
          resolve(res);
          subscribe.unsubscribe();
        }
      });
    });
  }

  /**
   * 删除当前用户数据库（缓存）
   */
  dropDB() {
    return new Promise((resolve) => {
      const uuid = CommonTools.uuid();
      ipcRenderer.send('dropDB', {uuid: uuid});

      const subscribe = this.dropDBUpdate$.subscribe((res: IpcResponseInterface<{uuid: string}>) => {
        if(res.uuid === uuid) {
          resolve(res);
          subscribe.unsubscribe();
        }
      });
    });
  }
}
