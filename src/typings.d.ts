/* SystemJS module definition */
declare const nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  process: any;
  require: any;
}

declare class ClipboardItem {
  constructor(data: { [mimeType: string]: Blob });
}
