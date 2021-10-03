import { Injectable } from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {MsgType} from "@app/config/rbchat-config";
import {
  ContextMenuModel,
  ContextMenuChattingModel,
  ContextMenuAvatarModel,
  ContextMenuCollectModel, MenuFilterData,
} from "@app/models/context-menu.model";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CacheService} from "@services/cache/cache.service";
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
import CommonTools from "@app/common/common.tools";
import FileMetaInterface from "@app/interfaces/file-meta.interface";
import {GroupMemberModel} from "@app/models/group-member.model";
import {GroupModel} from "@app/models/group.model";

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

  public muteMap: Map<string, boolean> = new Map();
  public topMap: Map<string, boolean> = new Map();

  private actionChattingCollection = {
    setTop: {
      label: "置顶消息",
      visibility: (filterData: MenuFilterData): boolean => {
        return !this.topMap.get(filterData.alarmItem.alarmItem.dataId);
      },
      action: (chatting: AlarmItemInterface) => {
        this.cacheService.setTop(chatting.alarmItem.dataId, chatting.metadata.chatType, true).then();
      }
    },
    unsetTop: {
      label: "取消置顶",
      visibility: (filterData: MenuFilterData): boolean => {
        return this.topMap.get(filterData.alarmItem.alarmItem.dataId) === true;
      },
      action: (chatting: AlarmItemInterface) => {
        this.cacheService.setTop(chatting.alarmItem.dataId, chatting.metadata.chatType, false).then();
      }
    },
    viewUser: {
      label: "查看个人信息",
      visibility: (filterData: MenuFilterData): boolean => {
        return filterData.alarmItem.metadata.chatType === 'friend';
      },
      action: (chatting: AlarmItemInterface) => {
        return this.dialogService.openDialog(UserInfoComponent, {
          data: {userId: Number(chatting.alarmItem.dataId)},
          panelClass: "padding-less-dialog",
        });
      }
    },
    closeSound: {
      label: "关闭消息声音通知",
      visibility: (filterData: MenuFilterData): boolean => {
        return this.muteMap.get(filterData.alarmItem.alarmItem.dataId) !== true;
      },
      action: (chatting: AlarmItemInterface) => {
        this.cacheService.setMute(chatting.alarmItem.dataId, chatting.metadata.chatType, true).then(() => {
          this.snackBarService.openMessage("关闭声音通知");
        });
      }
    },
    openSound: {
      label: "开启消息声音通知",
      visibility: (filterData: MenuFilterData): boolean => {
        return this.muteMap.get(filterData.alarmItem.alarmItem.dataId) === true;
      },
      action: (chatting: AlarmItemInterface) => {
        this.cacheService.setMute(chatting.alarmItem.dataId, chatting.metadata.chatType, false).then(() => {
          this.snackBarService.openMessage("开启声音通知");
        });
      }
    },
    contactCard: {
      label: "发送名片",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chatting: AlarmItemInterface) => {
        alert(chatting.metadata.unread);
      }
    },
    remove: {
      label: "删除会话",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chatting: AlarmItemInterface) => {
        this.dialogService.confirm({title: '删除会话'}).then((ok) => {
          if(ok) {
            this.cacheService.deleteChattingCache(chatting.alarmItem.dataId).then(() => {
              return this.currentChattingChangeService.switchCurrentChatting(null);
            });
          }
        });
      }
    },
    clearMessage: {
      label: "清除历史消息",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chatting: AlarmItemInterface) => {
        this.dialogService.confirm({title: '清除历史消息'}).then((ok) => {
          if(ok) {
            this.cacheService.clearChattingCache(chatting).then(() => {});
          }
        });
      }
    },
    setBackList: {
      label: "拉入黑名单",
      visibility: (filterData: MenuFilterData): boolean => {
        return filterData.alarmItem.metadata.chatType === 'friend';
      },
      action: (chatting: AlarmItemInterface) => {
        alert("拉入黑名单");
      }
    },
  };

  private actionCollection = {
    copyText: {
      label: "复制",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        return this.elementService.copyTextToClipboard(messageContainer);
      }
    },
    copyImage: {
      label: "复制",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.elementService.copyImageToClipboard(messageContainer.querySelector("img"));
      }
    },
    repeal: {
      label: "撤回",
      visibility: (filterData: MenuFilterData): boolean => {
        const time = new Date().getTime();
        const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
        if(filterData.alarmItem.metadata.chatType === 'friend') {
          if(time - filterData.chat.date > 2000 * 60) {
            return false;
          }
        } else {
          const my = filterData.members.get(localUserInfo.userId.toString());
          // 检查是否是群主/管理员
          let isAdmin = false;
          if(my) {
            isAdmin = my.groupOwner.toString() === localUserInfo.userId.toString() || my.isAdmin === 1;
            if(isAdmin) {
              return isAdmin;
            }
          }
        }
        return filterData.chat.uid.toString() === localUserInfo.userId.toString();
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        chat.msgType = this.msgType.TYPE_BACK;
        chat.text = [chat.name, '撤回一条消息'].join("");
        return this.cacheService.putChattingCache(
          this.currentChattingChangeService.currentChatting,
          chat
        ).then(() => {
          const chatting = this.currentChattingChangeService.currentChatting;
          if (chatting.metadata.chatType === 'friend') {
            return this.messageService.backFriendMessage(this.currentChattingChangeService.currentChatting, chat);
          } else {
            return this.messageService.backGroupMessage(this.currentChattingChangeService.currentChatting, chat);
          }
        });
      }
    },
    quote: {
      label: "回复",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        // chat.msgType = this.msgType.TYPE_BACK;
        this.quoteMessageService.setQuoteMessage(chat);
      }
    },
    download: {
      label: "保存到...",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        let file: FileMetaInterface;
        switch (chat.msgType) {
          case MsgType.TYPE_IMAGE:
            CommonTools.downloadLink(chat.text, chat.date.toString());
            break;
          case MsgType.TYPE_FILE:
            file = JSON.parse(chat.text);
            CommonTools.downloadLink(file.ossFilePath, file.fileName);
            break;
          case MsgType.TYPE_SHORTVIDEO:
            file = JSON.parse(chat.text);
            CommonTools.downloadLink(file.ossFilePath, file.fileName);
            break;
        }
      }
    },
    transmit: {
      label: "转发消息",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.dialogService.openDialog(TransmitMessageComponent, {data: [chat], width: '314px'}).then();
      }
    },
    delete: {
      label: "删除消息",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.dialogService.confirm({title: '删除消息', text: '是否删除该条消息？'}).then((ok) => {
          if(ok) {
            // 删除消息
            return this.cacheService.deleteMessageCache(this.currentChattingChangeService.currentChatting, [chat]).then(res => {
              // 刷新聊天数据
              this.cacheService.chatMsgEntityMap.delete(chat.fingerPrintOfProtocal);
            });
          }
        });
      }
    },
    select: {
      label: "选择消息",
      visibility: (filterData: MenuFilterData): boolean => {
        return true;
      },
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.elementService.selectMessage(true);
      }
    },
    collect: {
      label: "收藏",
      visibility: (filterData: MenuFilterData): boolean => {
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
    this.cacheService.getMute().then((list) => {
      if(list) {
        this.muteMap  = list;
      }
      this.cacheService.cacheUpdate$.subscribe(data => {
        if(data.muteMap) {
          this.muteMap = data.muteMap;
        }
      });
    });
    this.cacheService.getTop().then((list) => {
      if(list) {
        this.topMap  = list;
      }
      this.cacheService.cacheUpdate$.subscribe(data => {
        if(data.topMap) {
          this.topMap = data.topMap;
        }
      });
    });

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
        visibility: (filterData: MenuFilterData): boolean => {
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
                msgContent: "",
                title: chat.name,
                avatar: list[chat.uid]?.userAvatarFileName,
              },
              metadata: {chatType: 'friend'}
            }).then();
          });
        }
      },
      {
        label: "查看资料",
        visibility: (filterData: MenuFilterData): boolean => {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          return filterData.chat.uid.toString() !== localUserInfo.userId.toString();
        },
        action: (alarmItem, chat) => {
          this.dialogService.openDialog(UserInfoComponent, {
            data: {userId: chat.uid},
            panelClass: "padding-less-dialog",
          }).then();
        }
      },
      {
        label: "@TA",
        visibility: (filterData: MenuFilterData): boolean => {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          return filterData.chat.uid.toString() !== localUserInfo.userId.toString();
        },
        action: (alarmItem, chat) => {
          this.elementService.atMember(chat.uid);
        }
      },
      {
        label: "删除管理员",
        visibility: (filterData: MenuFilterData): boolean => {
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
                  this.cacheService.cacheGroupAdmins(alarmItem.alarmItem.dataId).then();
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
        visibility: (filterData: MenuFilterData): boolean => {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const noSelf = filterData.chat.uid.toString() !== localUserInfo.userId.toString();
          const isFriend = filterData.friends.get(filterData.chat.uid.toString());
          // 不能设置自己 and 必需是好友
          return noSelf && !!isFriend;
        },
        action: (alarmItem, chat) => {
          this.dialogService.openDialog(SetRemarkComponent, {
            data: {userId: chat.uid}
          }).then();
        }
      },
      {
        label: "从本群主中删除",
        visibility: (filterData: MenuFilterData): boolean => {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const admin = filterData.admins.get(filterData.alarmItem.alarmItem.dataId.toString());
          const chatUid = filterData.chat.uid.toString();
          const group = filterData.groups.get(filterData.alarmItem.alarmItem.dataId);
          const owner = group && group.gownerUserUid.toString() === localUserInfo.userId.toString();
          const manager = admin && admin.userUid.toString() === chatUid.toString();
          return owner || manager; // 是管理员或者群主
        },
        action: (alarmItem, chat) => {
          this.dialogService.confirm({title: "从本群主中删除"}).then((ok) => {
            if(ok) {
              const userId = Number(chat.uid);
              this.restService.removeGroupMembers(alarmItem.alarmItem.dataId, userId.toString(), [
                [alarmItem.alarmItem.dataId, chat.uid, chat.name]
              ]).subscribe((res: HttpResponseInterface) => {
                if(res.success === true) {
                  this.snackBarService.openMessage('删除成功');
                  this.cacheService.deleteData<GroupMemberModel>({model: 'groupMember', query: {userUid: userId}}).then(del => {
                    if(del.status === 200) {
                      this.cacheService.cacheGroupMembers(alarmItem.alarmItem.dataId).then();
                    }
                  });
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
        visibility: (filterData: MenuFilterData): boolean => {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const noSelf = filterData.chat.uid.toString() !== localUserInfo.userId.toString();
          const isFriend = filterData.friends[filterData.chat.uid];
          // 不能是自己 and 必需不是好友
          return noSelf && !isFriend;
        },
        action: (alarmItem, chat) => {
          this.dialogService.confirm({title: "添加好友"}).then((ok) => {
            if(ok) {
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
            }
          });
        }
      },
      {
        label: "设置管理员",
        visibility: (filterData: MenuFilterData): boolean => {
          const localUserInfo: LocalUserinfoModel = RBChatUtils.getAuthedLocalUserInfoFromCookie();
          const group = filterData.groups.get(filterData.alarmItem.alarmItem.dataId.toString());
          // 是群主
          return group && group.gownerUserUid.toString() === localUserInfo.userId.toString();
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
                  this.cacheService.cacheGroupAdmins(alarmItem.alarmItem.dataId).then();
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
        visibility: (filterData: MenuFilterData): boolean => {
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
        visibility: (filterData: MenuFilterData): boolean => {
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
    this.contextMenuForChatting = Object.values(this.actionChattingCollection);
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
      this.actionCollection.repeal,
      this.actionCollection.download,
      ...com,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_IMAGE] = [
      this.actionCollection.copyImage,
      this.actionCollection.quote,
      this.actionCollection.repeal,
      this.actionCollection.download,
      ...com,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_SHORTVIDEO] = [
      this.actionCollection.quote,
      this.actionCollection.repeal,
      this.actionCollection.download,
      ...com,
    ];

    this.contextMenuForMessage[this.msgType.TYPE_CONTACT] = [
      this.actionCollection.select,
      this.actionCollection.quote,
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
        visibility: (filterData: MenuFilterData): boolean => {
          return true;
        },
        action: () => {
          alert("demo");
        }
      }
    ];
  }

  /**
   * 消息
   * @param chat
   * @param chatOwner
   */
  async getContextMenuForMessage(chat: ChatmsgEntityModel, chatOwner: any = null) {
    // chat.msgType
    const currentChatting = this.currentChattingChangeService.currentChatting;
    let admins = new Map();
    let members: Map<string, GroupMemberModel> = new Map();
    if(currentChatting.metadata.chatType === 'group') {
      this.cacheService.getCacheGroupAdmins(currentChatting.alarmItem.dataId).then((as) => {
        admins = as;
      });
      await this.cacheService.getGroupMembers(currentChatting.alarmItem.dataId).then(data => {
        members = data;
      });
    }

    const filterData: Partial<MenuFilterData> = {
      admins: admins,
      friends: null,
      members: members,
      alarmItem: currentChatting,
      chat: chat
    };
    if(this.contextMenuForMessage[chat.msgType]) {
      return this.contextMenuForMessage[chat.msgType].filter(item => item.visibility(filterData)) || [];
    }
    return [];
  }

  /**
   * 会话
   * @param chatting
   * @param chatOwner
   */
  getContextMenuForChatting(chatting: AlarmItemInterface, chatOwner: any = null) {
    return this.contextMenuForChatting.filter(item => item.visibility({alarmItem: chatting}));
  }

  /**
   * 头像
   * @param alarmItem
   * @param chat
   */
  async getContextMenuForAvatar(alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel) {
    let admins;
    let friends;
    let groups: Map<string, GroupModel> = new Map();
    await this.cacheService.getCacheGroupAdmins(alarmItem.alarmItem.dataId).then((data) => {
      admins = data;
    });
    await this.cacheService.getCacheFriends().then(data => {
      friends = data;
    });
    // 获取群信息
    await this.cacheService.getCacheGroups().then(data => {
      groups = data;
    });

    const filterData: Partial<MenuFilterData> = {
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
