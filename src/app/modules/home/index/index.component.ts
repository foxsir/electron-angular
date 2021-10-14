import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {LocalUserService} from "@services/local-user/local-user.service";
import {formatDate} from "@app/libs/mobileimsdk-client-common";
import {GroupChattingCacheService} from "@services/group-chatting-cache/group-chatting-cache.service";
import {SingleChattingCacheService} from "@services/single-chatting-cache/single-chatting-cache.service";
import {RBChatConfig} from "@app/config/rbchat-config";
import {RestService} from "@services/rest/rest.service";
import {MessageService} from "@services/message/message.service";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import {TempMessageService} from "@services/temp-message/temp-message.service";
import {GroupMessageService} from "@services/group-message/group-message.service";
import {GroupsProviderService} from "@services/groups-provider/groups-provider.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {ImService} from "@services/im/im.service";

import {ProtocalModel} from "@app/models/protocal.model";
import {MessageDistributeService} from "@services/message-distribute/message-distribute.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

// import svg
import chatting from "@app/assets/icons/chatting.svg";
import chattingActive from "@app/assets/icons/chatting-active.svg";
import addressList from "@app/assets/icons/address-list.svg";
import addressListActive from "@app/assets/icons/address-list-active.svg";
import {AvatarService} from "@services/avatar/avatar.service";
import {CacheService} from "@services/cache/cache.service";
import netConnect from "@app/assets/icons/net-connect.svg";
import netDisConnect from "@app/assets/icons/net-disconnect.svg";
import {UserModel} from "@app/models/user.model";
import {MiniUiService} from "@services/mini-ui/mini-ui.service";
import {FriendRequestModel} from "@app/models/friend-request.model";
import IpcResponseInterface from "@app/interfaces/ipc-response.interface";

// import svg end

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    chatting = chatting.toString();

    // 消息角标
    massageBadges =  new Map([
      ['message', 0],
      ['address-list', 0],
    ]);

    myAvatar: SafeResourceUrl = this.dom.bypassSecurityTrustResourceUrl(
        this.avatarService.defaultLocalAvatar
    );

    currentRouter: string = "";

    leftMenu = [
        {
            path: 'message',
            label: "消息",
            router: "/home/message",
            icon: this.dom.bypassSecurityTrustResourceUrl(chatting),
            iconUnActive: this.dom.bypassSecurityTrustResourceUrl(chatting),
            iconActive: this.dom.bypassSecurityTrustResourceUrl(chattingActive),
        },
        {
            path: 'address-list',
            label: "通讯录",
            router: "/home/address-list",
            icon: this.dom.bypassSecurityTrustResourceUrl(addressList),
            iconUnActive: this.dom.bypassSecurityTrustResourceUrl(addressList),
            iconActive: this.dom.bypassSecurityTrustResourceUrl(addressListActive),
        }
    ];

    leftMenuNet = {
        isOnline: true,
        iconUnActive: this.dom.bypassSecurityTrustResourceUrl(netDisConnect),
        iconActive: this.dom.bypassSecurityTrustResourceUrl(netConnect),
    };

  /************************************ 全局其它变量 ************************************/
  mCurrentSelectedAlarmType = -1;  // 左侧列表中当前选中的数据类型
  mCurrentSelectedAlarmDataId = null;  // 左侧列表中当前选中的数据主键id

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localUserService: LocalUserService,
    private groupChattingCacheService: GroupChattingCacheService,
    private singleChattingCacheService: SingleChattingCacheService,
    private restService: RestService,
    private messageService: MessageService,
    private tempMessageService: TempMessageService,
    private messageEntityService: MessageEntityService,
    private groupMessageService: GroupMessageService,
    private groupsProviderService: GroupsProviderService,
    private snackBarService: SnackBarService,
    private imService: ImService,
    private messageDistributeService: MessageDistributeService,
    private dom: DomSanitizer,
    private avatarService: AvatarService,
    private cacheService: CacheService,
    private miniUiService: MiniUiService,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentRouter = this.router.url;
      }
    });
    this.connectDB();
    this.messageDistributeService.USER_ONLINE_STATUS_CHANGE$.subscribe((res: ProtocalModel) => {
      // alert(res.typeu);
    });
  }

  connectDB() {
    const userInfo = this.localUserService.localUserInfo;
    this.cacheService.connectionDB(userInfo.userId.toString()).then((connect) => {
      console.dir("connect: " + connect);
    });
  }

  ngOnInit(): void {
    this.initAll();
    this.doLoginIMServer();

    // 缓存个人信息
    this.cacheService.cacheMyInfo().then(() => {
      // 使用缓存中的头像
      this.cacheService.getMyInfo().then((data: UserModel) => {
        console.dir(data);
        if(data.userAvatarFileName.length > 0) {
          this.myAvatar = this.dom.bypassSecurityTrustResourceUrl(data.userAvatarFileName);
        }
      });
    });

    this.messageDistributeService.MT03_OF_CHATTING_MESSAGE$.subscribe(data => {
      this.massageBadges.set("message", 1);
    });
    this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$.subscribe(data => {
      this.massageBadges.set("message", 1);
    });

    // 获取并缓存好友列表
    this.cacheService.cacheFriends().then();
    // 获取并缓存群列表
    this.cacheService.cacheGroups().then();
    // 缓存黑名单
    this.cacheService.cacheBlackList();
    // 监听黑名单变化
    this.messageDistributeService.PULLED_BLACK_LIST$.subscribe(() => {
      this.cacheService.cacheBlackList();
    });
    // 监听好友请求
    this.messageDistributeService.MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$B$.subscribe(() => {
      this.cacheService.cacheNewFriends();
    });

    // 缓存通讯录角标数量
    this.updateFriendRequestNumber();


    // 订阅新的好友通知
    this.cacheService.cacheUpdate$.subscribe(cacheData => {
      if (cacheData.newFriendMap) {
        this.updateFriendRequestNumber();
      }
      if (cacheData.myInfo) {
        this.myAvatar = cacheData.myInfo.userAvatarFileName;
      }
    });

    this.messageDistributeService.USER_INFO_UPDATE$.subscribe(user => {
      console.dir(user);
      // {
      //   "userCornet": "8A7EE65D",
      //   "userSex": 1,
      //   "latestLoginTime": "1633680311121",
      //   "nickname": "foxsir",
      //   "updateAvatarTimestamp": 1633680336710,
      //   "userAvatarFileName": "http://strawberry-im.oss-cn-shenzhen.aliyuncs.com/user_portrait/400340.jpg",
      //   "userId": 400340
      // }
    });

    this.listenNetStatus();
  }

  //#################################################################### 【1】初始化方面代码 START
  initAll() {
    // 初始化本地用户信息
    // this.localUserService.initFromCookie();
    // 初始化IMSDK
    this.initIMServer();
    const setUI = () => {
      if(document.body.clientWidth <= 500) {
        this.miniUiService.switchMiniUI(true);
      } else {
        this.miniUiService.switchMiniUI(false);
      }
    };
    setTimeout(() => {
      setUI();
    });
    window.addEventListener('resize', () => {
      setUI();
    });
  }

  initIMServer() {
    this.imService.setDebugCoreEnable(true);          // 开启框架的log输出
    this.imService.setDebugPingPongEnable(false); // 关闭底层socket.io的心跳Log输出，否则心跳Log会太频繁而干其它更重要的Log查看

    // 【WEBIM的SDK调用第1步：设置回调函数】
    this.imService.callback_onIMData = this.onIMData.bind(this);
    this.imService.callback_onIMLog = this.log.bind(this);
    this.imService.callback_onIMAfterLoginSucess = this.onIMAfterLoginSucess.bind(this);
    this.imService.callback_onIMDisconnected = this.onIMDisconnected.bind(this);
    this.imService.callback_onIMReconnectSucess = this.onIMReconnectSucess.bind(this);
    this.imService.callback_onIMPing = this.onIMPing.bind(this);
    this.imService.callback_onIMPong = this.onIMPong.bind(this);
    this.imService.callback_onIMShowAlert = this.onIMShowAlert.bind(this);
  }

  //#################################################################### 【1】初始化方面代码 END


  //#################################################################### 【2】UI界面功能的综合性组织代码 START

  /**
   * Log a message。
   *
   * @param message
   * @param toConsole
   */
  log(message, toConsole) {
    //添加系统消息
    var html = '[' + formatDate(new Date(), 'hh:mm:ss.S') + '] ' + message;
    console.info(html);
  }

  //#################################################################### 【2】UI界面功能的综合性组织代码 END


  /**
   * 一条消息的完整处理和UI显示逻辑。
   *
   * @param isme true表示是“我”发出的消息
   * @param isGroupChatting true表示是群聊消息
   * @param alarmMessageDTO 首页“消息”中的item对应的数据封装对象（即AlarmMessageDTO对象）
   * @param chatMsgEntity 聊天界面中的一条消息，对应的数据封装对象（即ChatMsgEntity对象）
   */
  processRecivedMessage(isme, isGroupChatting, alarmMessageDTO, chatMsgEntity, xuNoShow = null) {
    var needInsertToContentPane = false;
    var needShowUnreadNum = false;
    //// 这是列表中的首个到来的在线用户消息
    //var firstOnlineUser = false;

    //var alarmMessageDTO = AlarmsProvider.createAuto(p);

    this.log('【消息处理】[isme?' + isme + '] 一条新的消息正要显示到聊天面板里。。。。（普通消息:' + JSON.stringify(chatMsgEntity) + '）', true);

    //if (!isme) {
    // debugger
    if (!xuNoShow) {
      if (chatMsgEntity) {
        // 保证数据进入缓存数据列表
        if (isGroupChatting) {
          this.groupChattingCacheService.putChatCache(alarmMessageDTO.dataId, chatMsgEntity, false);
        } else {
          this.singleChattingCacheService.putChatCache(alarmMessageDTO.dataId, chatMsgEntity, false);
        }
      }
    }
    if (alarmMessageDTO) {
      // 插入或更新首页“消息”item
      // RBChatAlarmsUI.insertOrUpdate(alarmMessageDTO, true);
    }

    if (!isme) {
      // 如果现在收到的消息正是属于当前正在聊天着的用户，则不需要在左另用户列表上显示未读标识
      if (this.isCurrentSelectedAlarm(alarmMessageDTO.alarmMessageType, alarmMessageDTO.dataId)) {
        needInsertToContentPane = true;
      }
      // 否则显示未读标识
      else {
        needShowUnreadNum = true;
      }
    }
    // 自已发出的消息
    else {
      // 自已发出的消息（自已发出的时候肯定是处于当前聊天窗口焦点的时候，无条件放入聊天内容面板于以显示）
      needInsertToContentPane = true;
    }

    // ui上显示未读标识
    if (needShowUnreadNum) {
      //setOnlineVisitorUnread(p.from, 1);
      // RBChatAlarmsUI.addUnread(alarmMessageDTO.alarmMessageType, alarmMessageDTO.dataId, 1);
    }
    // ui上显示该条消息
    // 说明：当firstOnlineUser==true时会默认调用selectedOnlineVisitor()，而此方法会载
    //      入存在JS缓存中的聊天记录，所以此时就不需要以下硬插入到消息界面了，否则就重复了哦
    if (needInsertToContentPane) {//} && !firstOnlineUser) {
      if (chatMsgEntity) {
        // 插入一条消息显示到消息面板上
        // RBChatChattingContentPaneUI.insertChatItemWithP(chatMsgEntity);
      }
    }

    // 自动滚动底部（以便即时显示最新消息）
    // RBChatChattingContentPaneUI.scrollToBottom4IM();

    // 如果当前首页的"消息"tab处于不可见状态，则设置“在线队列”的ui上显示一个新消息提示红点点
    // if (!isme && !RBChatMainWindowUI.isAlarmsTabSelected()) {
    //   RBChatMainWindowUI.setAlarmsUIHasMsg(true);
    // }

    // 主界面的header上必要的时候显示一个大红点提示有新消息（提示的前提是聊天窗处理关闭时）
    if (!isme) {
      // RBChatMainWindowUI.setHeaderNotificatonNewMsgHint(true);
    }
  }


  //#################################################################### 【6】IM相关代码 START

  //function doStartupIM(){
  //}

  /**
   * 登陆/连接到IM服务器的实现方法。
   */
  doLoginIMServer() {
    let loginUserId;
    let loginToken;

    // 读取在登陆界面通过SSO单点登陆接口等方式认证后的完整用户身份信息，以便连接IM服务器时使用
    // 说明：一个典型的IM系统的登陆，通常会分为2步：即1）通过http的sso单点接口认证身份并返回合
    //      法身份数据、2）将认证后的身份信息（主要是loginUserId和token）提交给IM服务器，再由
    //      IM服务器进行IM长连接的合法性检查，进而决定是否允许此次socket长连接的建立.
    const localAuthedUserInfo = this.localUserService.getObj();//RBChatUtils.getAuthedLocalUserInfoFromCookie();

    // 具体对象字段，详见：
    // http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html
    if (localAuthedUserInfo) {
      loginUserId = localAuthedUserInfo.userId;
      loginToken = localAuthedUserInfo.token;

      if (!loginUserId) {
        this.log('【doLoginIMServer】虽读取到用户的http认证后身份信息，但字段 loginUserId 读取为空，' +
          '这是不合法的数据，即将跳转到登陆页面。。。', true);

        // 跳转到登陆页面，让用户首先完成http的sso单点身份证认证
        this.gotoLoginPage();
      } else {
        // 组织好要提交到im服务器的连接身份信息
        const loginIMServerInfo = {
          // loginUserId: loginUserId, // 本字段为RainbowChat系统中的用户唯id，是全系统的唯一标识
          loginUserId: loginUserId, //111  本字段为RainbowChat系统中的用户唯id，是全系统的唯一标识
          // loginUserId: "web" + loginUserId, //111  本字段为RainbowChat系统中的用户唯id，是全系统的唯一标识
          loginToken: loginToken,   // 此token为上一步中的http sso单点登陆接口返回，现提交给im服务器用于验证此次连接者的身份是否合法（不需要单独验证用户名和密码了，用上一步的token即可）
        };

        this.log("【doLoginIMServer】IM服务器连接中....", true);

        // 【WEBIM的SDK调用第2步：提交登陆/认证信息】
        this.imService.loginImpl(loginIMServerInfo, RBChatConfig.IM_SERVER_URL, false);
      }
    } else {
      this.log('【doLoginIMServer】没有读取到用户的http认证后身份信息，即将跳转到登陆页面。。。', true);

      // 跳转到登陆页面，让用户首先完成http的sso单点身份证认证
      this.gotoLoginPage();
    }
  }

  /**
   * 登出。
   */
  doLogout() {
    //原版退出 无 退出状态
    // 断开与IM服务器的网络连接
    // this.imService.disconnectSocket();
    // 从cookie中清除本地用户的个人数据
    // this.localUserService.clear();
    // // 跳转到登陆界面
    // gotoLoginPage();

    //    111 新增退出状态
    this.restService.loginOut().subscribe();
    this.imService.disconnectSocket();

    // (returnValue) {
    //   // 断开与IM服务器的网络连接
    //   this.imService.disconnectSocket();
    //   // 从cookie中清除本地用户的个人数据
    //   this.localUserService.clear();
    //   // 跳转到登陆界面
    //   this.gotoLoginPage();
    // }, (errorThrownStr) {
    //
    // }

  }

  /**
   * 收到的IM聊天信息或指令。
   * 此方法为IMSDK的回调方法，请勿修改方法名哦（准确地说，本方法名应为“receivedMessage4IM”最佳，目前暂不修改）！
   *
   * @param pFromServer Protocal对象（对象字段请见：http://docs.52im.net/extend/docs/api/mobileimsdk/server/net/openmob/mobileimsdk/server/protocal/Protocal.html）
   * @param options
   */
  onIMData(pFromServer: ProtocalModel) {
    // const typeu = pFromServer.typeu;
    // console.dir(pFromServer);
    // const msgBody = JSON.parse(pFromServer.dataContent);
    // console.dir(msgBody);

    this.messageDistributeService.inceptMessage(pFromServer);
  }


  /**
   * 登陆/连接IM服务器成功后要做的事（即表示首次登陆IM服务器成功时）。
   */
  onIMAfterLoginSucess() {
    console.log('【onIMAfterLoginSucess】首次登陆/连接IM服务器成功了！', true);

    // 将登出框隐藏并显示登陆成功后的聊天界面
    // $("#im-panel-loginbox").hide();
    // $("#im-panel-around").show();

    // 注意：以下初始化文件上传方法之所以没有放在RBChatChattingContentPaneUI中调用，原因为
    //      uplodify中要拿到本地用户的loginUserId，而且不能动态拿，所以只能在用户成功登陆
    //      后再初始化之，以便拿到loginUserId
    // RBChatChattingContentPaneUI.initFileUplodifive5('image_msg');  // 图片消息的图片文件上传按钮及功能初始化
    // RBChatChattingContentPaneUI.initFileUplodifive5('file_msg');   // 大文件消息的文件上传按钮及功能初始化


    // RBChatChattingContentPaneUI.initFileUplodifive5("jietu_msg");   //111
    // RBChatChattingContentPaneUI.initFileUplodifive5("image_msg", "jietu_msg");   //111 截图

    // 载入相关数据
    // 说明：因需要连接IM成功后才能调用，所以以下调用不方便放在总init方法里执行
    // this.loadAllDatas();

    // 刷新本地用户的在线状态显示
    // RBChatLocalUserUI.refreshOnlineStatus();
    // 刷新网络连接情况的ui显录
    // RBChatLocalUserUI.refreshConnectionStatus();
  }

  /**
   * 与IM服务端的网络连接断开时要调用的函数。
   *
   * 【补充说明】：在当前的代码中，本函数将被MobileIMSDK-Web框架回调，请见this.imService.callback_disconnected 回调函数的设置。
   * 【建议用途】：开发者可在此回调中处理掉线时的界面状态更新等，比如设置将界面上的“在线”文字更新成“离线”。
   */
    onIMDisconnected() {
        this.leftMenuNet.isOnline = false;
        this.log('[IM] Sorry，你掉线了 ...', true);

        // 刷新本地用户的在线状态显示
        // RBChatLocalUserUI.refreshOnlineStatus();
        // // 刷新网络连接情况的ui显录
        // RBChatLocalUserUI.refreshConnectionStatus();
    }

    /**
    * 掉线重连成功时要调用的函数。
    *
    * 【补充说明】：在当前的代码中，本函数将被MobileIMSDK-Web框架回调，请见this.imService.callback_reconnectSucess 回调函数的设置。
    * 【建议用途】：开发者可在此回调中处理掉线重连成功后的界面状态更新等，比如设置将界面上的“离线”文字更新成“在线”。
    */
    onIMReconnectSucess() {
        this.leftMenuNet.isOnline = true;
        this.log('[IM] 掉线自动重连成功了！', true);

        // 网络掉线重连成功后，即时重新载入相关数据（如离线消息等）
        this.loadAllDatas();

        // 刷新本地用户的在线状态显示
        // RBChatLocalUserUI.refreshOnlineStatus();
        // // 刷新网络连接情况的ui显录
        // RBChatLocalUserUI.refreshConnectionStatus();
    }

  /**
   * 本地发出心跳包后的回调通知（本回调并非MobileIMSDK-Web核心逻辑，开发者可以不需要实现！）。
   *
   * 调用时传入的参数：无参数；
   *
   * 【补充说明】：在当前的代码中，本函数将被MobileIMSDK-Web框架回调，请见this.imService.callback_onIMPing 回调函数的设置。
   * 【建议用途】：开发者可在此回调中处理底层网络的活动情况。
   */
  onIMPing() {
    // this.log('[IM] 本地心跳包已发出。', true);
  }

  /**
   * 收到服务端的心跳包反馈的回调通知（本回调并非MobileIMSDK-Web核心逻辑，开发者可以不需要实现！）。
   *
   * 调用时传入的参数：无参数；
   *
   * 【补充说明】：在当前的代码中，本函数将被MobileIMSDK-Web框架回调，请见this.imService.callback_onIMPong 回调函数的设置。
   * 【建议用途】：开发者可在此回调中处理底层网络的活动情况。
   */
  onIMPong() {
    // this.log('[IM] 收到服务端的心中包反馈！', true);

    // 绿色呼吸灯效果（表示心跳在后面正常工作中...）
    // RBChatLocalUserUI.setConnectionStatusIconLight(true);
    // setTimeout(function () {
    //   RBChatLocalUserUI.setConnectionStatusIconLight(false);
    // }, 500);
  }

  /**
   * MobileIMSDK-Web框架层的一些提示信息显示回调（本回调并非MobileIMSDK-Web核心逻辑，开发者可以不需要实现！）。
   *
   * 调用时传入的参数1（必填）；文本类型，表示提示内容
   *
   * 【补充说明】：在当前的代码中，本函数将被MobileIMSDK-Web框架回调，请见this.imService.callback_onIMShowAlert 回调函数的说明。
   * 【建议用途】：开发者不设置的情况下，框架默认将调用window.alert()显示提示信息，否则将使用开发者设置的回调——目的主要是给
   *           开发者自定义这种信息的UI显示，提升UI体验，别无它用。*/
  onIMShowAlert(alertContent) {
    this.snackBarService.openMessage(alertContent);
  }

  //#################################################################### 【6】IM相关代码 END


  //#################################################################### 【7】数据载入和处理相关代码 END
  /**
   * 载入相关数据。
   */
  loadAllDatas() {
    //loadOnchatVisitorsFromServer();
    //loadHistorychatVisitorsFromServer();

    // 刷新本地用户信息的UI显示
    // RBChatLocalUserUI.refresh();

    // 载入好友列表（载入数据并UI显示）
    // this.rosterProviderService.refreshRosterAsync(function () {
    //   RBChatRosterUI.reloadFromCache();
    //
    //   // 载入首页历史“消息”列表（载入数据并UI显示）：确保在好友列表
    //   // 加载完成后加载首页“消息”数据，防止出现误判“陌生人”的情况
    //   RBChatAlarmsUI.reload(null);
    // });

    // 载入群组列表（载入数据并UI显示）
    // this.groupsProviderService.refreshGroupsListAsync(function () {
    //   RBChatGroupsUI.reloadFromCache();
    // });

    // 从服务端加载最新的本地用户信息（及时保持本地用户信息数据为最新版）
    // this.localUserService.reloadFromServer(function () {
    //   // 刷新本地用户信息的UI显示
    //   RBChatLocalUserUI.refresh();
    // });
  }

  //#################################################################### 【7】数据载入和处理相关代码 END


  //#################################################################### 【7】一些实用方法 START
  gotoLoginPage() {
    // window.location.href = './login.html';
    this.router.navigate(["/"]).then(() => {
      this.snackBarService.openMessage("请重新登陆后再使用");
    });
  }

  getCurrentSelectedAlarmType() {
    return this.mCurrentSelectedAlarmType;
  }

  getCurrentSelectedAlarmDataId() {
    return this.mCurrentSelectedAlarmDataId;
  }

  setCurrentSelectedAlarm(alarmType, dataId) {
    this.mCurrentSelectedAlarmType = alarmType;
    this.mCurrentSelectedAlarmDataId = dataId;
  }

  /**
   * 当前收到的Protocal，是否是当前正在聊天中的On chat访客发出的。
   *
   * @param p
   * @returns {*|boolean}
   */
  isCurrentSelectedAlarm(alarmType, dataId) {
    return (this.mCurrentSelectedAlarmType === alarmType)
      && (this.mCurrentSelectedAlarmDataId === dataId);
  }

  switchRouter(menu: {path: string; router: string}) {
    this.router.navigate([menu.router]).then(() => {
      if(menu.path === 'message') {
        this.miniUiService.switchMessage();
      } else if(menu.path === 'address-list') {
        this.miniUiService.switchAddressList();
      }
    });
  }

  /**
   * 监听网络断开
   */
  listenNetStatus() {
    const updateOnlineStatus = () => {
      this.leftMenuNet.isOnline = navigator.onLine;
    };
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  /**
   * 更新通讯录角标数量
   */
  updateFriendRequestNumber() {
    this.cacheService.queryData<FriendRequestModel>({
      model: 'friendRequest', query: {}
    }).then((res: IpcResponseInterface<FriendRequestModel>) => {
      let friendRequestCount = 0;
      console.log("本地的好友请求:",res.data);
      res.data.forEach(item => {
        if (item.agree == null) {
          friendRequestCount += 1;
        }
      });
      this.zone.run(() => {
        this.massageBadges.set("address-list", friendRequestCount);
        this.changeDetectorRef.detectChanges();
      });
      console.log("新的好友请求数量:",this.massageBadges.get("address-list"));
    });
  }

}
