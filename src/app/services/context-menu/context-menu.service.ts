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
import {GroupModel} from "@app/models/group.model";
import {GroupAdminModel} from "@app/models/group-admin.model";
import {LocalUserService} from "@services/local-user/local-user.service";

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
      someLimits: [this.limits.common],
      everyLimits: [],
      action: (chatting: AlarmItemInterface, chattingList: AlarmItemInterface[]) => {
        alert(chattingList.indexOf(chatting));
      }
    },
  };

  private actionCollection = {
    copyText: {
      label: "复制",
      someLimits: [this.limits.common],
      everyLimits: [],
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        return this.copyTextToClipboard(messageContainer);
      }
    },
    copyImage: {
      label: "复制",
      someLimits: [this.limits.common],
      everyLimits: [],
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.copyImageToClipboard(messageContainer);
      }
    },
    repeal: {
      label: "撤回",
      someLimits: [this.limits.common],
      everyLimits: [],
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        chat.msgType = this.msgType.TYPE_BACK;
      }
    },
    quote: {
      label: "回复",
      someLimits: [this.limits.common],
      everyLimits: [],
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        // chat.msgType = this.msgType.TYPE_BACK;
        this.quoteMessageService.setQuoteMessage(chat);
      }
    },
    download: {
      label: "下载",
      someLimits: [this.limits.common],
      everyLimits: [],
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
    private localUserService: LocalUserService,
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
        someLimits: [this.limits.common],
        everyLimits: [],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "查看资料",
        someLimits: [this.limits.common],
        everyLimits: [],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "@TA",
        someLimits: [this.limits.common],
        everyLimits: [],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "删除管理员",
        someLimits: [this.limits.owner],
        everyLimits: [this.limits.manage],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "设置备注",
        someLimits: [this.limits.common],
        everyLimits: [],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "从本群主中删除",
        someLimits: [this.limits.owner, this.limits.manage],
        everyLimits: [],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "添加好友",
        someLimits: [this.limits.notFriend],
        everyLimits: [],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "设置管理员",
        someLimits: [this.limits.owner],
        everyLimits: [],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "禁言",
        someLimits: [this.limits.owner, this.limits.manage],
        everyLimits: [],
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
        }
      },
      {
        label: "移除禁言",
        someLimits: [this.limits.owner, this.limits.manage],
        everyLimits: [],
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
        someLimits: [this.limits.common],
        everyLimits: [],
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
  private async generateLimitsForAvatar(alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel) {
    // 检查权限
    const common = true;
    let manage = false;
    let owner = false;
    let isFriend = false;
    let notFriend = false;
    let privacyClose = false;
    // 会话id
    const chattingId = alarmItem.alarmItem.dataId;
    // 会话类型 friend | group
    const chattingType = alarmItem.metadata.chatType;
    if(chattingType === 'group') {
      await this.cacheService.getCacheGroupAdmins().then(data => {
        if(data[chattingId] && data[chattingId][this.localUserService.localUserInfo.userId]) {
          manage = true; // 检查是否是管理员
        }
      });
      await this.cacheService.getCacheFriends().then(data => {
        if(data[chat.uid] || chat.uid.toString() === this.localUserService.localUserInfo.userId.toString()) {
          isFriend = true; // 检查是否是好友
        } else {
          notFriend = true;
        }
      });
      // 获取群信息/成员列表
      await this.cacheService.getCacheGroups().then(data => {
        const g: GroupModel = data[chattingId];
        if(g) {
          if(g.gownerUserUid.toString() === this.localUserService.localUserInfo.userId.toString()) {
            owner = true; // 检查是否是群主
          }
          if(g.allowPrivateChat.toString() === '0') {
            privacyClose = true; // 检查是否开启隐私
          }
          // 如果右键目标是自己
          if(g.gownerUserUid.toString() === chat.uid.toString()) {
            owner = false;
            privacyClose = false;
            manage = false;
            isFriend = true;
          }
        }
      });
    }

    return [
      (common ? 'common' : false),
      (manage ? 'manage' : false),
      (owner ? 'owner' : false),
      (isFriend ? 'isFriend' : false),
      (notFriend ? 'notFriend' : false),
      (privacyClose ? 'privacyClose' : false),
    ].filter(v => v) as string[];
  }

  /**
   * 根据权限获取允许的菜单
   * @param limits
   * @param menus
   * @private
   */
  private filterMenus(limits: string[], menus: BaseContextMenuModel[]): BaseContextMenuModel[] {
    const someMenu = [];
    this.contextMenuForAvatar.forEach(item => {
      const allow = limits.some(v => item.someLimits.includes(v));
      if(allow) {
        someMenu.push(item);
      }
    });
    const everyMenu = [];
    someMenu.forEach(item => {
      const allow = limits.every(v => item.everyLimits.includes(v));
      if(allow || item.everyLimits.length === 0) {
        everyMenu.push(item);
      }
    });

    return everyMenu;
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
    const limits: string[] = await this.generateLimitsForAvatar(alarmItem, chat);
    return this.filterMenus(limits, this.contextMenuForAvatar) as ContextMenuAvatarModel[];
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
