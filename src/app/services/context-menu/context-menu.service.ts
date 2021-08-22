import { Injectable } from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {MsgType} from "@app/config/rbchat-config";
import {
  ContextMenuModel,
  ContextMenuChattingModel,
  ContextMenuAvatarModel,
  ContextMenuCollectModel, BaseContextMenuModel, MenuFilterData,
} from "@app/models/context-menu.model";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CacheService} from "@services/cache/cache.service";
import {GroupModel} from "@app/models/group.model";
import {GroupAdminModel} from "@app/models/group-admin.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import {DialogService} from "@services/dialog/dialog.service";
import {UserInfoComponent} from "@modules/user-dialogs/user-info/user-info.component";
import {SwitchChatService} from "@services/switch-chat/switch-chat.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {SetRemarkComponent} from "@modules/user-dialogs/set-remark/set-remark.component";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import HttpResponseInterface from "@app/interfaces/http-response.interface";
import {UserSilenceComponent} from "@modules/user-dialogs/user-silence/user-silence.component";

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
  // private limits = {
  //   common: "common",
  //   manage: "manage",
  //   owner: "owner",
  //   isFriend: "isFriend",
  //   notFriend: "notFriend",
  //   privacyClose: "privacyClose",
  // };

  private actionChattingCollection = {
    copyText: {
      label: "复制",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chatting: AlarmItemInterface, chattingList: AlarmItemInterface[]) => {
        alert(chattingList.indexOf(chatting));
      }
    },
  };

  private actionCollection = {
    copyText: {
      label: "复制",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        return this.copyTextToClipboard(messageContainer);
      }
    },
    copyImage: {
      label: "复制",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.copyImageToClipboard(messageContainer);
      }
    },
    repeal: {
      label: "撤回",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        chat.msgType = this.msgType.TYPE_BACK;
      }
    },
    quote: {
      label: "回复",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        // chat.msgType = this.msgType.TYPE_BACK;
        this.quoteMessageService.setQuoteMessage(chat);
      }
    },
    download: {
      label: "下载",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
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
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private switchChatService: SwitchChatService,
    private restService: RestService,
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
        visibility: function(filterData: MenuFilterData): boolean {
          console.dir(filterData.friends);
          return true;
        },
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
          this.switchChatService.switch({
            alarmItem: {
              alarmMessageType: 0, // 0单聊 1临时聊天/陌生人聊天 2群聊
              dataId: chat.uid,
              date: null,
              istop: true,
              msgContent: null,
              title: chat.name,
            },
            metadata: {chatType: 'friend'}
          });
        }
      },
      {
        label: "查看资料",
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
        action: (alarmItem, chat) => {
          console.dir(chat.uid);
          this.dialogService.openDialog(UserInfoComponent, {
            data: {userId: chat.uid}
          }).then();
        }
      },
      {
        label: "@TA",
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
        action: (alarmItem, chat) => {
          alert('@AT');
        }
      },
      {
        label: "删除管理员",
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
        action: (alarmItem, chat) => {
          this.dialogService.confirm({title: "删除管理员"}).then((ok) => {
            if(ok) {
              this.restService.updateGroupAdmin(
                alarmItem.alarmItem.dataId,
                [chat.uid],
                0).subscribe((res: NewHttpResponseInterface<any>) => {
                if(res.status === 200) {
                  this.snackBarService.openMessage(res.msg);
                } else {
                  this.snackBarService.openMessage(res.msg);
                }
              });
            }
          });
        }
      },
      {
        label: "设置备注",
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
        action: (alarmItem, chat) => {
          this.dialogService.openDialog(SetRemarkComponent, {
            data: {userId: chat.uid}
          }).then();
        }
      },
      {
        label: "从本群主中删除",
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
        action: (alarmItem, chat) => {
          this.dialogService.confirm({title: "从本群主中删除"}).then((ok) => {
            if(ok) {
              const userId = this.localUserService.localUserInfo.userId;
              this.restService.removeGroupMembers(alarmItem.alarmItem.dataId, userId.toString(), [
                [alarmItem.alarmItem.dataId, chat.uid, chat.name]
              ]).subscribe((res: HttpResponseInterface) => {
                if(res.success === true) {
                  this.snackBarService.openMessage('删除成功');
                } else {
                  this.snackBarService.openMessage('删除失败');
                }
              });
            }
          });
        }
      },
      {
        label: "添加好友",
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
        action: (alarmItem, chat) => {
          this.dialogService.confirm({title: "添加好友"}).then(() => {
            this.snackBarService.openMessage("test");
          });
        }
      },
      {
        label: "设置管理员",
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
        action: (alarmItem, chat) => {
          this.dialogService.confirm({title: "设置管理员"}).then((ok) => {
            if(ok) {
              this.restService.updateGroupAdmin(
                alarmItem.alarmItem.dataId,
                [chat.uid],
                1).subscribe((res: NewHttpResponseInterface<any>) => {
                if(res.status === 200) {
                  this.snackBarService.openMessage(res.msg);
                } else {
                  this.snackBarService.openMessage(res.msg);
                }
              });
            }
          });
        }
      },
      {
        label: "禁言",
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
        action: (alarmItem, chat) => {
          this.dialogService.openDialog(UserSilenceComponent, {
            data: {alarmItem: alarmItem, chat: chat}
          }).then();
        }
      },
      {
        label: "移除禁言",
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
        action: (alarmItem, chat) => {
          this.dialogService.confirm({title: "移除禁言"}).then((ok) => {
            if(ok) {
              const userId = this.localUserService.localUserInfo.userId;
              const data = {
                clusterId: alarmItem.alarmItem.dataId.toString(),
                userId: chat.uid,
                adminId: userId.toString()
              };
              this.restService.deleteGroupSilenceById(data).subscribe((res: NewHttpResponseInterface<any>) => {
                if(res.status === 200) {
                  this.snackBarService.openMessage(res.msg);
                } else {
                  this.snackBarService.openMessage(res.msg);
                }
              });
            }
          });
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
        visibility: function(filterData: MenuFilterData): boolean {
          return true;
        },
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

  // /**
  //  * 获取当前用户可用的群聊菜单权限
  //  * @param alarmItem
  //  * @param chat
  //  * @private
  //  */
  // private async generateLimitsForAvatar(alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel) {
  //   // 检查权限
  //   const common = true;
  //   let manage = false;
  //   let owner = false;
  //   let isFriend = false;
  //   let notFriend = false;
  //   let privacyClose = false;
  //   // 会话id
  //   const chattingId = alarmItem.alarmItem.dataId;
  //   // 会话类型 friend | group
  //   const chattingType = alarmItem.metadata.chatType;
  //   if(chattingType === 'group') {
  //     await this.cacheService.getCacheGroupAdmins().then(data => {
  //       if(data[chattingId] && data[chattingId][this.localUserService.localUserInfo.userId]) {
  //         manage = true; // 检查是否是管理员
  //       }
  //     });
  //     await this.cacheService.getCacheFriends().then(data => {
  //       if(data[chat.uid] || chat.uid.toString() === this.localUserService.localUserInfo.userId.toString()) {
  //         isFriend = true; // 检查是否是好友
  //       } else {
  //         notFriend = true;
  //       }
  //     });
  //     // 获取群信息/成员列表
  //     await this.cacheService.getCacheGroups().then(data => {
  //       const g: GroupModel = data[chattingId];
  //       if(g) {
  //         if(g.gownerUserUid.toString() === this.localUserService.localUserInfo.userId.toString()) {
  //           owner = true; // 检查是否是群主
  //         }
  //         if(g.allowPrivateChat.toString() === '0') {
  //           privacyClose = true; // 检查是否开启隐私
  //         }
  //         // 如果右键目标是自己
  //         if(g.gownerUserUid.toString() === chat.uid.toString()) {
  //           owner = false;
  //           privacyClose = false;
  //           manage = false;
  //           isFriend = true;
  //         }
  //       }
  //     });
  //   }
  //
  //   return [
  //     (common ? 'common' : false),
  //     (manage ? 'manage' : false),
  //     (owner ? 'owner' : false),
  //     (isFriend ? 'isFriend' : false),
  //     (notFriend ? 'notFriend' : false),
  //     (privacyClose ? 'privacyClose' : false),
  //   ].filter(v => v) as string[];
  // }

  /**
   * 过滤可见菜单
   * @param menus
   * @param alarmItem
   * @param chat
   * @private
   */
  // private filterMenus(menus: BaseContextMenuModel[], alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel): BaseContextMenuModel[] {
  //   return menus.filter(item => item.visibility(alarmItem, chat));
  // }

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
    let admins: unknown = null;
    let friends: unknown = null;
    let groups: unknown = null;
    await this.cacheService.getCacheGroupAdmins().then(data => {
      admins = data;
      // if(data[chattingId] && data[chattingId][this.localUserService.localUserInfo.userId]) {
      //   manage = true; // 检查是否是管理员
      // }
    });
    await this.cacheService.getCacheFriends().then(data => {
      friends = data;
      // if(data[chat.uid] || chat.uid.toString() === this.localUserService.localUserInfo.userId.toString()) {
      //   isFriend = true; // 检查是否是好友
      // } else {
      //   notFriend = true;
      // }
    });
    // 获取群信息/成员列表
    await this.cacheService.getCacheGroups().then(data => {
      groups = data;
      // const g: GroupModel = data[chattingId];
      // if(g) {
      //   if(g.gownerUserUid.toString() === this.localUserService.localUserInfo.userId.toString()) {
      //     owner = true; // 检查是否是群主
      //   }
      //   if(g.allowPrivateChat.toString() === '0') {
      //     privacyClose = true; // 检查是否开启隐私
      //   }
      //   // 如果右键目标是自己
      //   if(g.gownerUserUid.toString() === chat.uid.toString()) {
      //     owner = false;
      //     privacyClose = false;
      //     manage = false;
      //     isFriend = true;
      //   }
      // }
    });

    const filterData = {
      admins: admins,
      friends: friends,
      groups: groups,
      alarmItem: alarmItem,
      chat: chat
    };

    return this.contextMenuForAvatar.filter(item => item.visibility(filterData)) as ContextMenuAvatarModel[];
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
