/**
 * 回复消息的结构
 */
export class ChatmsgReplyTextModel {
  duration: number;
  fileLength: number;
  msg: string; // "{\"msgType\":0,\"msgContent\":\"pppp\"}";
  msgType: number;
  reply: string;
  replyFriendUid: string;
  userName: string;
}

export class ChatmsgReplyOriginModel {
  downloadStatus: number;
  fileLength: number;
  fileMd5: string;
  fileName: string;
  localPath: string; // "/var/mobile/Containers/Data/Application/CF23B07C-D7EE-4787-A7C8-D470AAC56C70/Documents/rainbowchat_pro/file//肥胖性高血压患者资料合并.xlsx"
  remotePath: string;
  sendStatusSecondary: number;
  sendStatusSecondaryProgress: number;
  showMsg: boolean; // 无需解析
  text: string; // "{\"fileMd5\":\"a01a1d24ee2a36376944beb496840c3e\",\"fileName\":\"肥胖性高血压患者资料合并.xlsx\",\"ossFilePath\":\"http:\\/\\/strawberry-im.oss-cn-shenzhen.aliyuncs.com\\/message_file\\/2021-08-30-肥胖性高血压患者资料合并.xlsx\",\"fileLength\":13164}"
  type: number;
  ossFilePath: string;
  videoCoverPath: string;
}
