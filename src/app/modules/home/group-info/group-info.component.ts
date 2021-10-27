import {ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import { MatDrawer } from "@angular/material/sidenav";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import backspaceIcon from "@app/assets/icons/backspace.svg";
import backspaceActiveIcon from "@app/assets/icons/backspace-active.svg";
import arrowRightIcon from "@app/assets/icons/arrow-right.svg";
import { RestService } from "@services/rest/rest.service";
import { DemoDialogComponent } from "@modules/setting-dialogs/demo-dialog/demo-dialog.component";
import { DialogService } from "@services/dialog/dialog.service";
import { GroupInfoDialogComponent } from "@modules/user-dialogs/group-info-dialog/group-info-dialog.component";
import { UserInfoComponent } from "@modules/user-dialogs/user-info/user-info.component";
import { LocalUserService } from "@services/local-user/local-user.service";
import { CacheService } from "@services/cache/cache.service";
import { SelectFriendContactComponent } from "@modules/user-dialogs/select-friend-contact/select-friend-contact.component";
import { TransmitMessageComponent } from "@modules/user-dialogs/transmit-message/transmit-message.component";
import { MessageService } from "@services/message/message.service";
import { CurrentChattingChangeService } from "@services/current-chatting-change/current-chatting-change.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import GroupInfoModel from "@app/models/group-info.model";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {GroupModel} from "@app/models/group.model";
import {UploadedFile} from "@app/factorys/upload/upload-file/upload-file.component";
import {Subscription} from "rxjs";
import {AvatarService} from "@services/avatar/avatar.service";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {RBChatConfig, MsgType,UserProtocalsType} from "@app/config/rbchat-config";
import FriendModel from "@app/models/friend.model";

import {InputAreaComponent} from "@app/modules/home/input-area/input-area.component";
import {ProtocalModel} from "@app/models/protocal.model";
import {GroupMemberModel} from "@app/models/group-member.model";
import HttpResponseInterface from "@app/interfaces/http-response.interface";
import SubscribeManage from "@app/common/subscribe-manage";
import {GroupNoticeComponent} from "@modules/user-dialogs/group-notice/group-notice.component";

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent implements OnInit, OnDestroy {
  @Input() currentChat: AlarmItemInterface; // 测试群ID：0000000642
  @Input() drawer: MatDrawer;
  @ViewChild('groupConfig') private groupConfig: MatDrawer;

  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
  public backspaceIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceIcon);
  public backspaceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(backspaceActiveIcon);
  public arrowRightIcon = this.dom.bypassSecurityTrustResourceUrl(arrowRightIcon);

  myAvatar: SafeResourceUrl = null;

  public userinfo: any;
  public user_role: string; /*当前用户在这个群的角色：owner, admin, common*/
  public groupData: Partial<GroupInfoModel> = {
    gmute: 0,
    invite: 0,
    allowPrivateChat: 0,
    gmemberCount: 0,
    createTime: '',
    gownerUserUid: 0,
    gnotice: '',
  };
  public user_clu_info = {
    groupOwnerName: '',
    showNickname: '',
    groupOwner: '',
    isAdmin: 0,
  };

  public setting_data = {
    gmute: false, /*全体禁言*/
    allowPrivateChat: false, /*成员互相添加好友*/
    no_disturb: false, /*消息免打扰*/
    top_chat: false, /*置顶聊天*/
    invite: false, /*普通成员邀请好友入群*/
    talkInterval: 3, /*发言时间间隔*/
    gnotice: '', /*群公告*/
    gnotice_temp: '', /*群公告，编辑，临时存放*/
  };

  /*
   * switch_default: 默认
   * group_notice: 群公告编辑
   */
  public view_mode = "switch_default";
  public view_title_object = {
    switch_default: '群组信息',
    group_notice: '群公告编辑',
    customer_service: '专属客服配置',
    group_tab: '群页签配置',
    manage_group_member: '群成员管理',
    manage_group_admin: '群管理员管理',
  };

  public group_notice_view_mode = "view"; /*view 或者 edit*/

  public group_member_list: any[] = [];
  public group_admin_list: any[] = [];

  public oriNotice=""; //存储初始群公告，用于比对编辑后是否有变化

  constructor(
    private dom: DomSanitizer,
    private restService: RestService,
    private avatarService: AvatarService,
    private dialogService: DialogService,
    private localUserService: LocalUserService,
    private cacheService: CacheService,
    private messageService: MessageService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private snackBarService: SnackBarService,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.userinfo = this.localUserService.localUserInfo;
    SubscribeManage.run(this.currentChattingChangeService.currentChatting$, currentChat => {
      if(currentChat && this.currentChat.alarmItem.dataId !== currentChat.alarmItem.dataId) {
        console.log('群聊会话切换...');
        console.log("当前会话id:"+this.currentChat.alarmItem.dataId+",切换到的会话id:"+currentChat.alarmItem.dataId);
        this.currentChat = currentChat;
        this.view_mode = 'switch_default';
        this.groupConfig.close().then();
        this.initGroupData();
      }
    });

    SubscribeManage.run(this.cacheService.cacheUpdate$, res => {
      if(res.groupAdminMap) {
        this.loadGroupAdminList();
      }
      if(res.groupMemberMap) {
        this.cacheService.getGroupMembers(this.currentChat.alarmItem.dataId).then(members => {
          this.group_member_list = [];
          members.forEach(member => {
            this.group_member_list.push(member);
          });
        });
      }
      if(res.groupMap){
        this.initGroupData();
      }
    });
  }

  ngOnInit(): void {
    this.initGroupData();
  }

  loadGroupAdminList() {
    /* 获取群管理员列表 */
    this.cacheService.getCacheGroupAdmins(this.currentChat.alarmItem.dataId).then(members => {
      console.dir(members)
      // this.zone.run(() => {
      this.group_admin_list = [];
      members.forEach(member => {
        this.group_admin_list.push(member);
      });
      console.log('群管理员列表 01：', members);
      this.initUserCluInfo();
      //   this.changeDetectorRef.detectChanges();
      // })
    });
  }

  /* 个人的在群状态 */
  initUserCluInfo(){
    this.userinfo = this.localUserService.localUserInfo;
    this.restService.getUserClusterVo(this.userinfo.userId.toString(), this.currentChat.alarmItem.dataId).subscribe(res => {
      if (res.status !== 200)
        return;

      this.user_clu_info = res.data;
      if (this.user_clu_info.groupOwner == this.userinfo.userId.toString()) {
        this.user_role = 'owner';
      }
      else if (this.user_clu_info.isAdmin == 1) {
        this.user_role = 'admin';
      }
      else {
        this.user_role = 'common';
      }

      console.log('当前用户在这个群的角色: ', this.user_role);
    });
  }

  /*
  载入群成员信息
   */
  loadGroupMember(){
    this.cacheService.getGroupMembers(this.currentChat.alarmItem.dataId).then(members => {
      this.group_member_list = [];
      members.forEach(member => {
        this.group_member_list.push(member);
      });
    });
  }
  initGroupData() {
    this.myAvatar = null;
    console.log('currentChat:'+this.currentChat+"当前页面:群组信息页面");
    if (this.currentChat.metadata.chatType === 'friend') {
      return;
    }

    /*获取群基本信息*/
    this.restService.getGroupBaseById(this.currentChat.alarmItem.dataId).subscribe((res: NewHttpResponseInterface<GroupInfoModel>) => {
      if (res.status !== 200)
        return;

      if(res.status === 200 && res.data) {
        this.groupData = res.data;
        this.groupData.gid=this.currentChat.alarmItem.dataId;
        this.setting_data.gmute = this.groupData.gmute === 1;
        this.setting_data.invite = this.groupData.invite === 1;
        this.setting_data.allowPrivateChat = this.groupData.allowPrivateChat === 1;
        this.setting_data.gnotice = this.groupData.gnotice;

        this.currentChat.alarmItem.title=this.groupData.gname;
        this.oriNotice = this.setting_data.gnotice;

        //群头像
        var avatar;
        if(this.groupData.avatar.length > 0) {
          avatar = this.dom.bypassSecurityTrustResourceUrl(this.groupData.avatar);
        } else {
          avatar = this.dom.bypassSecurityTrustResourceUrl(this.avatarService.defaultLocalAvatar);
        }

        this.zone.run(() => {
          this.myAvatar=avatar;
        })

      }
    });

    /* 获取群成员列表 */
    this.cacheService.getGroupMembers(this.currentChat.alarmItem.dataId).then(members => {
      this.group_member_list = [];
      members.forEach(member => {
        this.group_member_list.push(member);
      });
    });

    this.loadGroupAdminList();
    //this.initUserCluInfo();

    /* 查看免打扰状态 */
    this.restService.noDisturbDetail(this.userinfo.userId.toString(), this.currentChat.alarmItem.dataId).subscribe(res => {
      if (res.status !== 200)
        return;

      this.setting_data.no_disturb = parseInt(res.data, 10) === 1;
    });

    /* 查看置顶状态 */
    this.restService.topDetail(this.userinfo.userId.toString(), this.currentChat.alarmItem.dataId).subscribe(res => {
      if (res.status !== 200)
        return;

      this.setting_data.top_chat = parseInt(res.data, 10) === 1;
    });
  }

  /**
   * 开关设置
   * @param key
   */
  bySwitch(key) {
    if (key == 'no_disturb') {
      this.cacheService.setMute(this.currentChat.alarmItem.dataId, this.currentChat.metadata.chatType, this.setting_data[key]).then(() => {
        //this.snackBarService.openMessage("关闭声音通知");
      });
    }
    else if (key == 'top_chat') {
      this.cacheService.setTop(this.currentChat.alarmItem.dataId, this.currentChat.metadata.chatType, this.setting_data[key]).then();
    }
    else {
      var data = {
        gid: this.currentChat.alarmItem.dataId
      };
      data[key] = this.setting_data[key] == true ? 1 : 0;
      this.restService.updateGroupBaseById(data).subscribe();
      // 如果开启了全体禁言,需要单独发个消息
      if (key == 'gmute') {
        const notificationContent = this.setting_data[key]?"全体已被禁言":"全体已被解禁了";
        const messageText = {
          isBanned:this.setting_data[key],
          banTime:0,
          sendId: this.localUserService.localUserInfo.userId,
          msg:this.setting_data[key]?"全体已被禁言":"全体已被解禁",
          adminId:this.localUserService.localUserInfo.userId,
          uuid:0
        };
        this.messageService.sendGroupMessage(MsgType.TYPE_NOTALK, this.currentChat.alarmItem.dataId, JSON.stringify(messageText), []).then(res => {
          if(res.success === true) {
            // 暂时不做任何处理
          }
        });
      }
    }
  }

  back() {
    switch (this.view_mode) {
      case "switch_default":
        this.drawer.close();
        break;

      default:
        this.view_mode = "switch_default";
        break;
    }
  }

  /**
   * 切换视图
   * @param view
   */
  changeView(view) { console.dir(this.user_role)
    switch (view){
      case 'group_notice':
        if(this.user_role === 'admin' || this.user_role === 'owner'){
          this.group_notice_view_mode = 'view';
          this.view_mode = view;
        }else{
          var data={
            title:'群组公告',
            txt:this.groupData.gnotice,
          }
          this.dialogService.openDialog(GroupNoticeComponent, { data: data,width: '314px',panelClass: "padding-less-dialog" }).then((res: any) => {
            if (res.ok === false) {
              return;
            }
          });
        }
        break;
      default:
        this.view_mode = view;
        break;
    }
  }

  editGroupNotice() {
    this.group_notice_view_mode = 'edit';
    this.setting_data.gnotice_temp = this.setting_data.gnotice;
  }

  cancelGroupNotice() {
    this.group_notice_view_mode = 'view';
  }

  saveGroupNotice() {
    this.group_notice_view_mode = 'view';
    if (this.oriNotice === this.setting_data.gnotice_temp) return;

    var post_data = {
      g_notice: this.setting_data.gnotice_temp,
      g_notice_updateuid: this.userinfo.userId,
      g_id: this.currentChat.alarmItem.dataId,
    };

    this.restService.changeGroupNotice(post_data).subscribe(res => {
      if (res.success === false) {
        return;
      }
      this.cacheService.putChattingCache(this.currentChat).then(() => {});
      this.setting_data.gnotice = this.setting_data.gnotice_temp;
      this.oriNotice=this.setting_data.gnotice;

      if (this.setting_data.gnotice_temp ==="") return;

      console.log('修改群公告成功，发送通知消息...');
      this.dialogService.confirm({ title: '通知确认', text: '群公告修改成功，是否通知全部群成员？' }).then((ok) => {
        if (ok) {
          console.log('确认通知...');

          var msgContent="@所有人【群消息】"+this.setting_data.gnotice;
          this.messageService.sendGroupMessage(MsgType.TYPE_AITE,
            this.currentChat.alarmItem.dataId,
            msgContent,
            ["ALL"]).then( res => {
            if (res.success === true) {
            }
          });
        }
      });
    });
  }

  /*修改发言间隔*/
  changetalkInterval() {
    var data = {
      two: 'xxx',
      talkInterval: this.setting_data.talkInterval
    };

    this.dialogService.openDialog(DemoDialogComponent, { data: data }).then((res: any) => {
      if (res.ok == true) {

        var post_data = {
          gid: this.currentChat.alarmItem.dataId,
          talkInterval: res.talkInterval
        };

        this.restService.updateGroupBaseById(post_data).subscribe(res => {
          this.setting_data.talkInterval = post_data.talkInterval;
        });
      }
    });
  }

  /*
   * 编辑群信息： 群组名称、群内昵称
   */
  editGroupInfo(column) {
    var data = {
      dialog_type: 'edit_' + column,
      toUserId: this.currentChat.alarmItem.dataId,
      chatType: this.currentChat.metadata.chatType,
      group_name: this.currentChat.alarmItem.title,
      txt_value: column == 'group_name' ? this.currentChat.alarmItem.title : this.user_clu_info.showNickname,
    };

    this.dialogService.openDialog(GroupInfoDialogComponent, { data: data }).then((res: any) => {
      if (res.ok == false) {
        return;
      }

      if (column == 'group_name') {
        this.currentChat.alarmItem.title = res.new_name;
        this.cacheService.putChattingCache(this.currentChat).then(() => {});
      }
      else if (column == 'group_nickname') {
        this.user_clu_info.showNickname = res.new_name;
        console.dir(this.user_clu_info.showNickname)
        this.cacheService.saveDataSync<GroupMemberModel>({model: 'groupMember', data: this.user_clu_info, update: {groupId: this.currentChat.alarmItem.dataId, userUid:this.userinfo.userid}}).then(() => {
          setTimeout(() => {
            return this.cacheService.cacheGroupMembers(this.currentChat.alarmItem.dataId).then();
          }, 100);
        })
      }
    });
  }


  /**
   * 单选群成员 / 群转让
   * @param choose_type: transfer
   */
  chooseGroupPeople(choose_type,popup_title) {
    var data = {
      dialog_type: 'choose_group_member',
      toUserId: this.currentChat.alarmItem.dataId,
      chatType: this.currentChat.metadata.chatType,
      count: '',
      popup_title: popup_title,
      choose_type:choose_type
    };
    this.dialogService.openDialog(GroupInfoDialogComponent, { data: data,width: '314px',panelClass: "padding-less-dialog" }).then((res: any) => {
      if (res && res.ok === true) {
        if (choose_type == 'transfer') {
          this.drawer.close().then();
          this.restService.submitTransferGroupToServer(this.userinfo.userId.toString(), res.item.userUid, res.item.showNickname, this.currentChat.alarmItem.dataId).subscribe(res => {
            this.user_role = 'common';
          });
        }
      }
    });
  }

  /**
   * 多选群成员/增加管理员
   * @param choose_type: transfer, add_group_admin
   */
  mulChooseGroupPeople(choose_type,popup_title) {
    var data = {
      dialog_type: 'mul_choose_group_member',
      toUserId: this.currentChat.alarmItem.dataId,
      chatType: this.currentChat.metadata.chatType,
      count: '',
      popup_title: popup_title,
      choose_type:choose_type,
    };
    this.dialogService.openDialog(GroupInfoDialogComponent, { data: data,width: '314px',panelClass: "padding-less-dialog" }).then((res: any) => {
      if (res.ok === false) {
        return;
      }

      if(res.selectfriends.length <= 0) return;

      if (choose_type === 'add_group_admin') {
        this.restService.updateGroupAdmin(this.currentChat.alarmItem.dataId, res.selectfriends, 1).subscribe(res => {
          setTimeout(() => {
            this.cacheService.cacheGroupAdmins(this.currentChat.alarmItem.dataId).then(members => {
              this.loadGroupAdminList();
            });
          }, 1000);
        });
      }
    });
  }

  /*
  移除群成员 群主/管理员可操作，群主不能移除，管理员不能移除自己
  */
  removeMember(item){
    this.dialogService.confirm({title: '成员移除', text: "确定要將「 "+item.showNickname+" 」移出群吗？"}).then(ok => {
      if(ok) {
        const userId = Number(item.userUid);
        this.restService.removeGroupMembers(this.currentChat.alarmItem.dataId, this.localUserService.localUserInfo.userId.toString(),
          this.localUserService.localUserInfo.nickname,[[this.currentChat.alarmItem.dataId, userId.toString(), item.showNickname]]
        ).subscribe((res: HttpResponseInterface) => {
          if(res.success === true) {
            this.snackBarService.openMessage('删除成功');
            this.cacheService.deleteData<GroupMemberModel>({model: 'groupMember', query: {userUid: userId}}).then(del => {
              if(del.status === 200) {
                this.cacheService.cacheGroupMembers(this.currentChat.alarmItem.dataId).then();
                //如果被删的是管理员
                for(const user of this.group_admin_list){
                  if(userId === user.userUid){
                    this.restService.updateGroupAdmin(this.currentChat.alarmItem.dataId, [userId.toString()], 0).subscribe(re => {
                      setTimeout(() => {
                        this.cacheService.cacheGroupAdmins(this.currentChat.alarmItem.dataId).then(members => {
                          this.loadGroupAdminList();
                        });
                      }, 100);
                    });
                    break;
                  }
                }
              }
            });
          } else {
            this.snackBarService.openMessage('删除失败');
          }
        });
      }
    })
  }
  /*
   * 删除管理员
   */
  deleteGroupAdmin() {
    if(this.group_admin_list.length===0) return;
    var data = {
      dialog_type: 'delete_group_admin',
      toUserId: this.currentChat.alarmItem.dataId,
      chatType: this.currentChat.metadata.chatType,
      admin_list: this.group_admin_list
    };

    this.dialogService.openDialog(GroupInfoDialogComponent, { data: data }).then((res: any) => {
      if (res.ok === false) {
        return;
      }

      this.restService.updateGroupAdmin(this.currentChat.alarmItem.dataId, res.selectfriends, 0).subscribe(re => {
        setTimeout(() => {
          this.cacheService.cacheGroupAdmins(this.currentChat.alarmItem.dataId).then(members => {
            this.loadGroupAdminList();
            console.log('更新管理员缓存，并重新加载');
          });
        }, 100);
      });
    });
  }

  /*
   * 解散本群
   */
  dismissGroup() {
    this.dialogService.confirm({ title: "解散群组", text: "此操作不可逆，请慎重操作呦" }).then((ok) => {
      if (ok == false) {
        return;
      }

      console.log('确认解散...');
      var post_data = {
        g_id: this.currentChat.alarmItem.dataId,
        //owner_uid: this.userinfo.userId,
        //owner_nickname: this.userinfo.nickname,
        owner_uid: this.groupData.gownerUserUid,
        owner_nickname: this.user_clu_info.groupOwnerName,
      };

      this.restService.jieSangGroup(post_data).subscribe(res => {
        if (res.success === false) {
          return this.snackBarService.openMessage("解散失败,请重试") ;
        } else {
          // 清空历史消息, 一定要嵌套在then里面
          this.cacheService.clearChattingCache(this.currentChat).then(() => {
            // 删除会话
            this.cacheService.deleteChattingCache(this.currentChat.alarmItem.dataId).then(() => {});
            // 从我的群组列表中删除
            this.cacheService.deleteData<GroupModel>({model: 'group', query: {gid: this.currentChat.alarmItem.dataId}}).then();
            this.drawer.close().then();
            this.dialogService.alert({ title: '解散成功！'}).then(() => {});
          });
        }
      });
    });
  }

  /* 邀请好友 */
  inviteFriend() {
    // 先查询出来群内已有的人
    const filterFriendId: number[] = [];
    this.group_member_list.forEach(item=>{
      filterFriendId.push(Number(item.userUid));
    });
    this.dialogService.openDialog(SelectFriendContactComponent, { width: '314px',panelClass: "padding-less-dialog", data : filterFriendId}).then((friend) => {
      if(friend.selectfriends.length==0) return;
      if (friend.ok) {
        this.dialogService.confirm({ title: "消息提示", text: "确定邀请好友入群吗？" }).then((ok) => {
          if (ok == false) {
            return;
          }

          var members=new Array();
          friend.selectfriends.forEach(data => {
            members.push([this.currentChat.alarmItem.dataId, data.friendUserUid.toString(), data.nickname]);
          });

          var post_data = {
            invite_to_gid: this.currentChat.alarmItem.dataId,
            invite_uid: this.userinfo.userId,
            invite_nickname: this.userinfo.nickname,
            members: members
          };

          this.restService.inviteFriendToGroup(post_data).subscribe(res => {
            if (res.success == false) {
              return this.snackBarService.openMessage(res.msg);
            }
            this.dialogService.alert({ title: '邀请成功！'}).then(() => {
              setTimeout(() => {
                return this.cacheService.cacheGroupMembers(this.currentChat.alarmItem.dataId).then();
              }, 1000);
            });
          });
        });
      }
    });
  }

  /*
   * 退出本群
   */
  exitGroup() {
    this.dialogService.confirm({ title: "退出本群", text: "确定退出本群吗？" }).then((ok) => {
      if (ok == false) {
        return;
      }
      const alarmItem = this.currentChat.alarmItem;
      console.log('确认退出...');
      var post_data = {
        del_opr_nickname: this.userinfo.nickname,
        gid: alarmItem.dataId,
        members: [
          [alarmItem.dataId, this.userinfo.userId.toString(), this.userinfo.nickname]
        ],
        del_opr_uid: this.userinfo.userId.toString()
      };

      // 退群调用接口即可,不用发送消息
      this.restService.exitGroup(post_data).subscribe(res => {
        if (res.success == false) {
          return this.snackBarService.openMessage("退群失败,请重试");
        }else {
          this.snackBarService.openMessage("退群成功");
          // 清空历史消息
          this.cacheService.clearChattingCache(this.currentChat).then(() => {});
          // 删除会话
          this.cacheService.deleteData<GroupModel>({model: 'group', query: {gid: this.currentChat.alarmItem.dataId}}).then(() => {
            // 从我的群组列表中删除
            this.cacheService.deleteChattingCache(this.currentChat.alarmItem.dataId).then(() => {});
          });
          this.drawer.close().then();
        }
      });
    });
  }

  ngOnDestroy() {
  }

  public setAvatar(upload: UploadedFile) {
    this.restService.updateGroupBaseById({
      gid: this.currentChat.alarmItem.dataId,
      avatar: upload.url.href,
    }).subscribe(res => {
      this.cacheService.cacheGroups().then();
      this.cacheService.getChattingList().then(list =>{
        const item = list.get(this.currentChat.alarmItem.dataId);
        if(item) {
          item.alarmData.alarmItem.avatar = upload.url.href;
          this.cacheService.putChattingCache(item.alarmData).then();
        }

      })
    });
  }

  //联系群主，弹出群主个人信息窗
  contactGroupOwner() {
    return this.dialogService.openDialog(UserInfoComponent, {
      data: {userId: Number(this.groupData.gownerUserUid)},
      panelClass: "padding-less-dialog",
    });
  }
}
