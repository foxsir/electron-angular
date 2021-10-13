import content from './workerContent';

export class WorkerService {
  private static worker: Worker = null;
  private static instance: WorkerService = null;

  public openHandle: (event: Event) => void;
  public closeHandle: (event: CloseEvent) => void;
  public errorHandle: (event: ErrorEvent) => void;
  public messageHandle: (event: MessageEvent) => void;

  /**
   0 (WebSocket.CONNECTING)
   正在链接中
   1 (WebSocket.OPEN)
   已经链接并且可以通讯
   2 (WebSocket.CLOSING)
   连接正在关闭
   3 (WebSocket.CLOSED)
   连接已关闭或者没有链接成功
   */
  public readyState: number = 0;


  private constructor() {}

  public static getInstance(): WorkerService {
    if(WorkerService.worker) {
      return WorkerService.instance;
    } else {
      const instance = new WorkerService();
      WorkerService.instance = instance;
      instance.init();
      return instance;
    }
  }

  init() {
    if(WorkerService.worker === null) {
      const response = content.toString();

      const blob = new Blob([response], {type: 'application/javascript'});
      WorkerService.worker = new Worker(URL.createObjectURL(blob));
      this.onMessage();
    }
  }

  createSocket(url: string) {
    WorkerService.worker.postMessage({type: 'socket', data: {url: url}});
  }

  login(data: string) {
    WorkerService.worker.postMessage({type: 'login', data: {data: data}});
  }

  logout(data: string) {
    WorkerService.worker.postMessage({type: 'logout', data: data});
    WorkerService.worker = null;
  }

  post(data: string) {
    WorkerService.worker.postMessage({type: 'message', data: data});
  }

  close() {
    WorkerService.worker.postMessage({type: 'close'});
  }

  private onMessage() {
    WorkerService.worker.onmessage = (e: any) => {
      switch (e.data.type) {
        case 'open':
          this.readyState = 1;
          this.openHandle(e.data);
          break;
        case 'close':
          this.readyState = 3;
          this.closeHandle(e.data);
          break;
        case 'error':
          this.readyState = 3;
          this.errorHandle(e.data);
          break;
        case 'message':
          this.messageHandle(e.data);
          break;
      }
    };
  }

}
