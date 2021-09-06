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
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {SetRemarkComponent} from "@modules/user-dialogs/set-remark/set-remark.component";
import {RestService} from "@services/rest/rest.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import HttpResponseInterface from "@app/interfaces/http-response.interface";
import {UserSilenceComponent} from "@modules/user-dialogs/user-silence/user-silence.component";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import RBChatUtils from "@app/libs/rbchat-utils";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {ElementService} from "@services/element/element.service";
import {TransmitMessageComponent} from "@modules/user-dialogs/transmit-message/transmit-message.component";
import {FriendAddWay} from "@app/config/friend-add-way";
import {MessageService} from "@services/message/message.service";

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
        return this.elementService.copyTextToClipboard(messageContainer);
      }
    },
    copyImage: {
      label: "复制",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.elementService.copyImageToClipboard(messageContainer.querySelector("img"));
      }
    },
    repeal: {
      label: "撤回",
      visibility: function(filterData: MenuFilterData): boolean {
        const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
        return filterData.chat.uid.toString() === localUserInfo.userId.toString();
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        chat.msgType = this.msgType.TYPE_BACK;
        return this.cacheService.putChattingCache(
          this.currentChattingChangeService.currentChatting,
          chat
        ).then(() => {
          const chatting = this.currentChattingChangeService.currentChatting;
          if (chatting.metadata.chatType === 'friend') {
            this.messageService.backFriendMessage(this.currentChattingChangeService.currentChatting, chat);
          } else {
            this.messageService.backGroupMessage(this.currentChattingChangeService.currentChatting, chat);
          }
        });
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
    transmit: {
      label: "转发消息",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.dialogService.openDialog(TransmitMessageComponent, {data: [chat], width: '314px'}).then();
      }
    },
    delete: {
      label: "删除消息",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.dialogService.confirm({title: '删除消息', text: '是否删除该条消息？'}).then((ok) => {
          if(ok) {
            // 删除消息
            return this.cacheService.deleteChattingCache(this.currentChattingChangeService.currentChatting, [chat]).then(res => {
              // 刷新聊天数据
              this.currentChattingChangeService.switchCurrentChatting(this.currentChattingChangeService.currentChatting);
            });
          }
        });
      }
    },
    select: {
      label: "选择消息",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.elementService.selectMessage(true);
      }
    },
    collect: {
      label: "收藏",
      visibility: function(filterData: MenuFilterData): boolean {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.restService.addMissuCollect(chat).subscribe((res: NewHttpResponseInterface<any>) => {
          this.snackBarService.openMessage(res.msg);
        });
      }
    },
  };

  constructor(
    private quoteMessageService: QuoteMessageService,
    private cacheService: CacheService,
    private localUserService: LocalUserService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private restService: RestService,
    private elementService: ElementService,
    private messageService: MessageService,
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
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          return filterData.chat.uid.toString() !== localUserInfo.userId.toString();
        },
        action: (alarmItem, chat) => {
          this.cacheService.getCacheFriends().then(list => {
            this.currentChattingChangeService.switchCurrentChatting({
              alarmItem: {
                alarmMessageType: 0, // 0单聊 1临时聊天/陌生人聊天 2群聊
                dataId: chat.uid,
                date: null,
                istop: true,
                msgContent: null,
                title: chat.name,
                avatar: list[chat.uid]?.userAvatarFileName,
              },
              metadata: {chatType: 'friend'}
            });
          });
        }
      },
      {
        label: "查看资料",
        visibility: function(filterData: MenuFilterData): boolean {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          return filterData.chat.uid.toString() !== localUserInfo.userId.toString();
        },
        action: (alarmItem, chat) => {
          this.dialogService.openDialog(UserInfoComponent, {
            data: {userId: chat.uid}
          }).then();
        }
      },
      {
        label: "@TA",
        visibility: function(filterData: MenuFilterData): boolean {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          return filterData.chat.uid.toString() !== localUserInfo.userId.toString();
        },
        action: (alarmItem, chat) => {
          this.elementService.atMember(chat.uid);
        }
      },
      {
        label: "删除管理员",
        visibility: function(filterData: MenuFilterData): boolean {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const group = filterData.groups[filterData.alarmItem.alarmItem.dataId];
          // 检查是否是群主
          return group && group.gownerUserUid.toString() === localUserInfo.userId;
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
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const noSelf = filterData.chat.uid.toString() !== localUserInfo.userId.toString();
          const isFriend = filterData.friends[filterData.chat.uid];
          // 不能设置自己 and 必需是好友
          return noSelf && isFriend;
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
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const caches = filterData.admins[filterData.alarmItem.alarmItem.dataId];
          const chatUid = filterData.chat.uid.toString();
          const group = filterData.groups[filterData.alarmItem.alarmItem.dataId];
          const owner = group && group.gownerUserUid.toString() === localUserInfo.userId;
          const manager = caches && caches[filterData.chat.uid] === chatUid;
          return owner || manager; // 是管理员或者群主
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
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const noSelf = filterData.chat.uid.toString() !== localUserInfo.userId.toString();
          const isFriend = filterData.friends[filterData.chat.uid];
          // 不能是自己 and 必需不是好友
          return noSelf && !isFriend;
        },
        action: (alarmItem, chat) => {
          this.dialogService.confirm({title: "添加好友"}).then(() => {
            this.cacheService.getCacheFriends().then(data => {
              if(data[chat.uid]) {
                this.snackBarService.openMessage("已经是好友");
              } else {
                this.messageService.addFriend(FriendAddWay.group, {
                  friendUserUid: Number(chat.uid),
                  desc: "来自群"
                }).then(res => {
                  if(res.success) {
                    this.snackBarService.openMessage("已经发送请求");
                  } else {
                    this.snackBarService.openMessage("请稍后重试");
                  }
                });
              }
            });
          });
        }
      },
      {
        label: "设置管理员",
        visibility: function(filterData: MenuFilterData): boolean {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const group = filterData.groups[filterData.alarmItem.alarmItem.dataId];
          // 是群主
          return group && group.gownerUserUid.toString() === localUserInfo.userId;
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
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const caches = filterData.admins[filterData.alarmItem.alarmItem.dataId];
          const chatUid = filterData.chat.uid.toString();
          const group = filterData.groups[filterData.alarmItem.alarmItem.dataId];
          const owner = group && group.gownerUserUid.toString() === localUserInfo.userId;
          const manager = caches && caches[filterData.chat.uid] === chatUid;
          return owner || manager; // 是管理员或者群主
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
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const caches = filterData.admins[filterData.alarmItem.alarmItem.dataId];
          const chatUid = filterData.chat.uid.toString();
          const group = filterData.groups[filterData.alarmItem.alarmItem.dataId];
          const owner = group && group.gownerUserUid.toString() === localUserInfo.userId;
          const manager = caches && caches[filterData.chat.uid] === chatUid;
          return owner || manager; // 是管理员或者群主
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
    const com = [
      this.actionCollection.delete,
      this.actionCollection.transmit,
      this.actionCollection.select,
      this.actionCollection.collect,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_TEXT] = [
      this.actionCollection.copyText,
      this.actionCollection.quote,
      this.actionCollection.repeal,
      ...com,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_FILE] = [
      this.actionCollection.quote,
      this.actionCollection.repeal,
      // this.actionCollection.download,
      ...com,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_IMAGE] = [
      this.actionCollection.copyImage,
      this.actionCollection.quote,
      this.actionCollection.repeal,
      // this.actionCollection.download,
      ...com,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_SHORTVIDEO] = [
      this.actionCollection.quote,
      this.actionCollection.repeal,
      // this.actionCollection.download,
      ...com,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_CONTACT] = [
      this.actionCollection.quote,
      this.actionCollection.select,
      this.actionCollection.delete,
      this.actionCollection.collect,
      ...com,
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
    const filterData = {
      admins: null,
      friends: null,
      groups: null,
      alarmItem: null,
      chat: chat
    };
    return this.contextMenuForMessage[chat.msgType].filter(item => item.visibility(filterData)) || [];
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
