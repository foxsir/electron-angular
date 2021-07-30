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

interface Clipboard {
  write(ClipboardItem): Promise<void>;
  // Add any other methods you need here.
}

interface NavigatorClipboard {
  // Only available in a secure context.
  readonly clipboard?: Clipboard;
}

interface Clipboard extends NavigatorClipboard {
  readText(): Promise<string>;
  writeText(data: string): Promise<void>;
}
