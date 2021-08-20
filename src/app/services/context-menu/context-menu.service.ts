import { Injectable } from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {MsgType} from "@app/config/rbchat-config";
import {
  ContextMenuModel,
  ContextMenuChattingModel,
  ContextMenuAvatarModel,
  ContextMenuCollectModel, BaseContextMenuModel,
} from "@app/models/context-menu.model";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CacheService} from "@services/cache/cache.service";

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  public msgType = MsgType;

  // 消息上的右键
  private contextMenuForMessage: ContextMenuModel[][] = [];

  // 会话上的右键
  private contextMenuForChatting: ContextMenuChattingModel[] = [];

  // 对话中头像上的右键
  private contextMenuForAvatar: ContextMenuAvatarModel[] = [];

  // 收藏列表上的右键
  private contextMenuForCollect: ContextMenuCollectModel[] = [];

  // 权限是或的关系，只要满足其中一个条件即可
  private limits = {
    common: "common",
    manage: "manage",
    owner: "owner",
    isFriend: "isFriend",
    notFriend: "notFriend",
    privacyClose: "privacyClose",
  };

  private actionChattingCollection = {
    copyText: {
      label: "复制",
      limits: [this.limits.common],
      action: (chatting: AlarmItemInterface, chattingList: AlarmItemInterface[]) => {
        alert(chattingList.indexOf(chatting));
      }
    },
  };

  private actionCollection = {
    copyText: {
      label: "复制",
      limits: [this.limits.common],
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        return this.copyTextToClipboard(messageContainer);
      }
    },
    copyImage: {
      label: "复制",
      limits: [this.limits.common],
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.copyImageToClipboard(messageContainer);
      }
    },
    repeal: {
      label: "撤回",
      limits: [this.limits.common],
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        chat.msgType = this.msgType.TYPE_BACK;
      }
    },
    quote: {
      label: "回复",
      limits: [this.limits.common],
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        // chat.msgType = this.msgType.TYPE_BACK;
        this.quoteMessageService.setQuoteMessage(chat);
      }
    },
    download: {
      label: "下载",
      limits: [this.limits.common],
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        alert("下载文件");
        // chat.msgType = this.msgType.TYPE_BACK;
        // this.quoteMessageService.setQuoteMessage(chat);
      }
    },
  };

  constructor(
    private quoteMessageService: QuoteMessageService,
    private cacheService: CacheService,
  ) {
    this.initMsgMenu();
    this.initChattingMenu();
    this.initAvatarMenu();
    this.initCollectMenu(); // 收藏
  }

  // 初始化头像右键
  private initAvatarMenu() {
    this.contextMenuForAvatar = [
      {
        label: "发送消息",
        limits: [this.limits.common],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "查看资料",
        limits: [this.limits.common],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "@TA",
        limits: [this.limits.common],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "删除管理员",
        limits: [this.limits.owner],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "设置备注",
        limits: [this.limits.common],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "从本群主中删除",
        limits: [this.limits.owner, this.limits.manage],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "添加好友",
        limits: [this.limits.common],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "设置管理员",
        limits: [this.limits.owner],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "禁言",
        limits: [this.limits.owner, this.limits.manage],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "移除禁言",
        limits: [this.limits.owner, this.limits.manage],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
    ];
  }

  // 初始化会话右键
  private initChattingMenu() {
    this.contextMenuForChatting = [
      this.actionChattingCollection.copyText
    ];
  }

  // 初始化消息右键
  private initMsgMenu() {
    this.contextMenuForMessage[this.msgType.TYPE_TEXT] = [
      this.actionCollection.copyText,
      this.actionCollection.quote,
      this.actionCollection.repeal,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_FILE] = [
      this.actionCollection.download,
      this.actionCollection.quote,
      this.actionCollection.repeal,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_IMAGE] = [
      this.actionCollection.copyImage,
      this.actionCollection.quote,
      this.actionCollection.repeal,
    ];
  }

  // 初始化收藏右键
  private initCollectMenu() {
    this.contextMenuForCollect = [
      {
        label: "demo",
        limits: [this.limits.common],
        action: () => {
          alert("demo");
        }
      }
    ];
  }

  copyTextToClipboard(messageContainer) {
    try {
      const blob = new Blob([messageContainer.innerText], { type: 'text/plain' });
      return this.setToClipboard(blob);
    } catch (error) {
      console.error('Something wrong happened');
    }
  }

  copyImageToClipboard(messageContainer) {
    // take any image
    const img = messageContainer.querySelector("img");
    // make <canvas> of the same size
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const context = canvas.getContext('2d');

    // copy image to it (this method allows to cut image)
    context.drawImage(img, 0, 0);

    // toBlob is async operation, callback is called when done
    canvas.toBlob((blob) => {
      try {
        this.setToClipboard(blob);
      } catch (error) {
        console.error('Something wrong happened');
        console.error(error);
      }
    }, 'image/png'); // 只支持png
  }

  setToClipboard(blob) {
    const data = [new ClipboardItem({ [blob.type]: blob })];
    return navigator.clipboard.write(data);
  }

  /**
   * 获取当前用户可用的群聊菜单权限
   * @param alarmItem
   * @param chat
   * @private
   */
  private async generateLimitsForGroup(alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel) {
    // 检查权限
    // common: "common",
    // manage: "manage",
    // owner: "owner",
    // isFriend: "isFriend",
    // notFriend: "notFriend",
    // privacyClose: "privacyClose",
    // 会话id
    const chattingId = alarmItem.alarmItem.dataId;
    // 会话类型 friend | group
    const chattingType = alarmItem.metadata.chatType;
    if(chattingType === 'group') {
      // 获取群信息/成员列表
      await this.cacheService.getCacheGroups().then(data => {

      });
      await this.cacheService.getCacheGroupAdmins().then(data => {
        // console.dir(data);
      });
    }

    // 获取群管理员/检查是否是管理员

    // 获取群主/检查是否是群主

    // 获取好友列表/检查是否是好友
    // this.cacheService.getCacheFriends().then(res => {
    //   console.dir(res);
    // });

    return ['common'];
  }

  /**
   * 根据权限获取允许的菜单
   * @param limits
   * @param menus
   * @private
   */
  private filterMenus(limits: string[], menus: BaseContextMenuModel[]): BaseContextMenuModel[] {
    const newMenu = [];
    this.contextMenuForAvatar.forEach(item => {
      const allow = limits.some(v => item.limits.includes(v));
      if(allow) {
        newMenu.push(item);
      }
    });

    return newMenu;
  }

  /**
   * 消息
   * @param chat
   * @param chatOwner
   */
  getContextMenuForMessage(chat: ChatmsgEntityModel, chatOwner: any = null) {
    // chat.msgType
    return this.contextMenuForMessage[chat.msgType] || [];
  }

  /**
   * 会话
   * @param chatting
   * @param chatOwner
   */
  getContextMenuForChatting(chatting: AlarmItemInterface, chatOwner: any = null) {
    return this.contextMenuForChatting;
  }

  /**
   * 头像
   * @param alarmItem
   * @param chat
   */
  async getContextMenuForAvatar(alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel) {
    const limits: string[] = await this.generateLimitsForGroup(alarmItem, chat);
    return this.filterMenus(limits, this.contextMenuForAvatar);
  }

  /**
   * 收藏
   * @param chat
   * @param chatOwner
   */
  getContextMenuForCollect(chat: ChatmsgEntityModel, chatOwner) {
    return this.contextMenuForCollect;
  }

}
