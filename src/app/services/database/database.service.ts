import {Subject} from 'rxjs';
import {BaseEntity} from 'typeorm';
import IpcResponseInterface from "@app/interfaces/ipc-response.interface";
import CommonTools from "@app/common/common.tools";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {ElectronService} from "@app/core/services";

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

  constructor(
    protected electronService: ElectronService,
  ) {
  }

  connectionDB(name: string): Promise<boolean> {
    if(this.isConnected !== true) {
      this.listenReply();
    }
    return new Promise((resolve) => {
      if(this.isConnected !== true) {
        const subscribe = this.connectedUpdate$.subscribe((connected: boolean) => {
          this.isConnected = connected;
          resolve(connected);
          subscribe.unsubscribe();
        });
        this.electronService.ipcRendererSend('connectionDB', name);
      } else {
        resolve(true);
      }
    });
  }

  disconnectDB() {
    this.isConnected = false;
    this.electronService.ipcRendererSend('closeDB');
  }


  listenReply() {
    this.electronService.ipcRendererOn('connectionDB-reply', (event, arg: boolean) => {
      this.connectedSource.next(arg);
    });

    this.electronService.ipcRendererOn('sendData-reply', (event, data) => {
      this.sendDataSource.next(data);
    });

    this.electronService.ipcRendererOn('queryData-reply', (event, data) => {
      this.queryDataSource.next(data);
    });

    this.electronService.ipcRendererOn('deleteData-reply', (event, data) => {
      this.deleteDataSource.next(data);
    });
  }

  saveData<T extends BaseEntity>(data: SaveParams<T>): void {
    data.uuid = CommonTools.uuid();
    this.electronService.ipcRendererSend('sendData', data);
  }

  /**
   * 具有回调的数据保存方法
   * @param data
   */
  saveDataSync<T extends BaseEntity>(data: SaveParams<T>): Promise<T> {
    return new Promise((resolve) => {
      data.uuid = CommonTools.uuid();
      this.electronService.ipcRendererSend('sendData', data);

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
      this.electronService.ipcRendererSend('queryData', data);

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
      this.electronService.ipcRendererSend('deleteData', data);

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
  clearDB() {
    return new Promise((resolve) => {
      this.deleteData<ChatmsgEntityModel>({model: 'chatmsgEntity', query: null}).then(() => {
        resolve(true);
      });
    });
  }

}
