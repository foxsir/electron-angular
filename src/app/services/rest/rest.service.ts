import {Injectable} from '@angular/core';
import {JobDispatchConst, MyProcessorConst, RBChatConfig, SysActionConst} from "@app/config/rbchat-config";

import {HttpService} from "@services/http/http.service";
import {Observable} from "rxjs";
import {LocalUserService} from "@services/local-user/local-user.service";
import {ImService} from "@services/im/im.service";
import {
    getAppConfig,
    generateAgoraToken,
  getMissuCollectById,
  deleteMissuCollectById,
  getMyBlackUser,
  getUserBaseById,
  updateUserBaseById,
  verifyCode,
  getPrivacyConfigById,
  updatePrivacyConfig,
  getUserJoinGroup,
  getGroupBaseById,
  getUserGroupTab,
  UpUserGroupTab,
  getGroupCustomerService,
  UpGroupCustomerService,
  updateGroupBaseById,
  getNewFriend,
  blackUser,
  getFriendGroupList,
  getFriendSearch,
  getGroupAdminInfo,
  updRemark,
    getRemark,
    getfriendList,
  updateGroupAdmin,
  addGroupSilence,
  deleteGroupSilenceById,
  getGroupSilenceById, addMissuCollect, UpdatePassword,
} from "@app/config/post-api";
import {HttpHeaders} from "@angular/common/http";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import DeviceID from "@app/DeviceID";

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private deviceInfo = "chrome 91.0.4472.124";
  private localUserService: LocalUserService;

  constructor(
    private http: HttpService,
    private imService: ImService,
  ) {
    this.localUserService = new LocalUserService(this);
  }

  private restServer(processorId: number, jobDispatchId: number, actionId: number, data: any): Observable<any> {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    const localUserUid = this.imService.getLoginInfo()?.loginUserId;
    const url = RBChatConfig.HTTP_REST_POST_URL;
    const postData = {
      newData: data,
      processorId: processorId.toString(),
      jobDispatchId: jobDispatchId.toString(),
      actionId: actionId.toString(),
      uid: localUserUid.toString(),
      token: this.localUserService.localUserInfo.token,
    };

    return this.http.post(url, JSON.stringify(postData));
  }

  /**
   * 【接口1009】HTTP登陆认证请求接口调用.
   *
   * 说明：一个典型的IM系统的登陆，通常会分为2步：即1）通过http的sso单点接口认证身份并返回合
   *      法身份数据（就像本接口所实现的一样）、2）将认证后的身份信息（主要是loginUserId和token）
   *      提交给IM服务器，再由IM服务器进行IM长连接的合法性检查，进而决定是否允许此次socket长连接的建立.
   *
   * @param loginNameStr
   * @param loginPswStr
   */
  submitLoginToServer(loginNameStr, loginPswStr) {
    // 要提交给服务端的参数
    const loginInfoObj = {
      loginName: loginNameStr,
      loginPsw: loginPswStr,
      // deviceInfo: this.deviceInfo,
      deviceId: DeviceID.id,
      osType: 2
    };

    return this.http.post(
      RBChatConfig._HTTP_LOGIN_URL,
      loginInfoObj
    );
  }

  /**
   * 【接口1008-2-7】获取本地用户的好友列表接口调用.
   *
   * 返回值为：ArrayList<RosterElementEntity>数组转JSON后的字符串.
   *
   */
  submitGetRosterToServer(uid) {
    // return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_ROSTER, SysActionConst.ACTION_APPEND1,uid);
    return this.http.get(RBChatConfig._HTTP_FRIEND_LIST_URL, {userId: uid});
  }

  /**
   * 【接口1008-5-7】删除指定的好友接口调用.
   *
   * @param localUserUid 本地用户uid
   * @param selectedFriendUid 要删除的好友uid
   */
  submitDeleteFriendToServer(localUserUid, selectedFriendUid) {

    // 要提交给服务端的参数
    const m = {
      local_uid: localUserUid,
      friend_uid: selectedFriendUid
    };

    return this.restServer(
      MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_DELETE$FRIEND, SysActionConst.ACTION_APPEND1,JSON.stringify(m)
    );
  }

  /**
   * 【接口1008-5-8】删除聊天消息记录接口调用.
   * 支持：删除一对一好友或陌生人聊天记录（即删除“我”与指定uid用户的记录）、群聊记录
   *
   * @param isDeleteGroupChatting true表示本次删除的是群聊记录，否则删除的是单聊记录
   * @param gid 要删除的群聊id（本参数只在isDeleteGroupChatting=true时有意义）
   * @param localUserUid 本地用户的uid（本参数在isDeleteGroupChatting=true时表示群成员uid，isDeleteGroupChatting=false时表示单聊中的“我”）
   * @param selectedUserUid 要删除的单聊“对方”uid（本参数只在isGroupChatting=false时有意义）
   * @since 4.5
   */
  submitDeleteChattingMsgToServer(isDeleteGroupChatting, gid, localUserUid, selectedUserUid) {

    // 要提交给服务端的参数
    let m = null;

    if (isDeleteGroupChatting) {
      // 要提交给服务端的参数
      m = {
        gid,          // 群id
        luid: localUserUid,    // 提起删除请求的群成员用户uid
      };
    } else {
      // 要提交给服务端的参数
      m = {
        luid: localUserUid,   // local uid（即“我”的uid）
        ruid: selectedUserUid,// 选中的 uid（即“对方”的uid）
      };
    }

    return this.restServer(
      MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_DELETE$FRIEND, SysActionConst.ACTION_APPEND2,JSON.stringify(m)
    );
  }

  /**
   * 【接口1008-26-7】查询首页历史“消息”数据的接口调用。
   *
   * @param localUserUid 被查询者的uid
   * @param startTime 数据查询范围的起始时间（此参数为空表示服务端查询时不区分时间范围），形如：“2019-01-01 10:02:02”
   */
  queryAlarmsHistoryFromServer(localUserUid, startTime) {

    // 要提交给服务端的参数
    const m = {
      uid: localUserUid,
      starttime: startTime
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_COMMON_QUERY_MGR, SysActionConst.ACTION_APPEND1
      ,JSON.stringify(m));
  }

  /**
   * 【接口1008-26-8】:查询聊天消息记录.
   * 支持：一对一聊天记录的返回（即“我”与指定uid用户的记录）、群聊记录的返回。
   *
   * @param isGroupChatting true表示本次查询的是群聊记录，否则查询的是单聊记录
   * @param gid 要查询的群聊id（本参数只在isGroupChatting=true时有意义）
   * @param localUserUid 本地用户的uid（本参数在isGroupChatting=true时表示群成员uid，isGroupChatting=false时表示单聊中的“我”）
   * @param friendUid 聊天对象的uid（即对方的uid）（本参数只在isGroupChatting=false时有意义）
   * @param orderby 排序方式： 1 表示按消息时间DESC逆序，0 表示按消息时间ASC顺序排序
   * @param starttime 聊天记录查询范围的起始时间（为空表示不区分时间范围），形如：“2019-01-01 10:02:02”
   * @param endtime 聊天记录查询范围的结束时间（为空表示查询截止当前时间），形如：“2019-01-01 10:02:02”
   */
  queryChattingHistoryFromServer(isGroupChatting
    , gid, localUserUid, friendUid, orderby, starttime, endtime) {

    let m = null;

    if (isGroupChatting) {
      // 要提交给服务端的参数
      m = {
        gid,          // 被查群id
        // 'luid'      : localUserUid, // local uid（即“我”的uid）
        luid: localUserUid, //111 设备需要 local uid（即“我”的uid）
        orderby,      // 排序方式： 1 表示按消息时间DESC逆序，0 表示按消息时间ASC顺序排序
        starttime,    // 聊天记录查询范围的起始时间（为空表示不区分时间范围），形如：“2019-01-01 10:02:02”
        endtime       // 聊天记录查询范围的结束时间（为空表示查询截止当前时间），形如：“2019-01-01 10:02:02”
      };
    } else {
      // 要提交给服务端的参数
      m = {
        // 'luid'      : localUserUid, // local uid（即“我”的uid）
        luid: localUserUid, //111 设备需要 local uid（即“我”的uid）

        ruid: friendUid,    // remote uid（即“对方”的uid）
        orderby,      // 排序方式： 1 表示按消息时间DESC逆序，0 表示按消息时间ASC顺序排序
        starttime,    // 聊天记录查询范围的起始时间（为空表示不区分时间范围），形如：“2019-01-01 10:02:02”
        endtime       // 聊天记录查询范围的结束时间（为空表示查询截止当前时间），形如：“2019-01-01 10:02:02”
      };
    }

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_COMMON_QUERY_MGR, SysActionConst.ACTION_APPEND2
      , JSON.stringify(m));
  }

  /**
   * 【接口1008-3-8】获取用户/好友的个人信息接口调用.
   *
   * @param use_mail true表示用好友的mail地址查找，否则表示用好友的uid查找
   * @param user_mail 用户或好友的mail地址（use_mail为true时本参数必须不为空哦）
   * @param user_uid 用户或好友的uid（use_mail为false时本参数必须不为空哦）
   * @param isShowLoadingToast true表示在进行网络请求时会自动显示一个“载入中”的Toast，并在请求完成或出错时取消显示
   */
  submitGetUserInfoToServer(use_mail, user_mail, user_uid, isShowLoadingToast, logTAG) {

    // 要提交给服务端的参数
    const m = {
      use_mail: use_mail ? "1" : "0", // "1"表示用好友的mail地址查找，否则表示用好友的uid查找
      friend_mail: user_mail,            // 用户或好友的mail地址（use_mail为true时本参数必须不为空哦）
      friend_uid: user_uid              // 用户或好友的uid（use_mail为false时本参数必须不为空哦）
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_SNS, SysActionConst.ACTION_APPEND2
      , JSON.stringify(m));
  }


  //111 新增 查询好友原始类型  邮箱好友 ACTION_APPEND2
  submitGetUserInfoToServer2(use_mail, user_mail, user_uid, isShowLoadingToast, logTAG) {
    // 要提交给服务端的参数
    const m = {
      use_mail: use_mail ? "1" : "0", // "1"表示用好友的mail地址查找，否则表示用好友的uid查找
      // 'friend_user': user_mail,            // 用户或好友的mail地址（use_mail为true时本参数必须不为空哦）
      friend_mail: user_mail,            // 用户或好友的mail地址（use_mail为true时本参数必须不为空哦）
      friend_uid: user_uid              // 用户或好友的uid（use_mail为false时本参数必须不为空哦）
    };
    //111 搜索好友修改  增加了 SysActionConst.ACTION_APPEND100 非邮箱好友
    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_SNS, SysActionConst.ACTION_APPEND100
      , JSON.stringify(m));
  }
  /**
   * 【接口1008-10-9】查询个人相册、个人介绍语音留言的完整数据列表（
   * 目前用于客户端个人信息查看界面中显示照片和语音完整列表时使用）的接口调用.
   *
   * @param resourceType 要查询的资源类型：0表示查询个人相册数据、1表示查询个人语音介绍数据
   * @return 返回结果是 2 维数组，子数组单元含义分别是:“resourceId、资源文件名、资源大小(人类可读)
   *          、资源大 小(单位:字节)、被查看数、上传时间”
   */
  queryPhotosOrVoicesListFromServer(resourceOfUid, resourceType) {

    // 要提交给服务端的参数
    const m = {
      user_uid: resourceOfUid,
      res_type: resourceType
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_MGR$PROFILE, SysActionConst.ACTION_APPEND3
      , JSON.stringify(m));
  }

  /**
   * 【接口1008-3-9】“密记密码”邮件请求接口调用.
   * <p>
   * 注意：因为发送邮件是个比较慢的过程，为了提升客户端体验，此次的接口调用时服务端
   * 返回了只是表示邮件请求已发到服务器，但至于服务器有没有成功发出，那就不知道了，
   * 否则需要等到服务端发送邮件完成的话，会等更多时间，这样就影响用户体验了。
   *
   * @param receiveProcessedMail 接收“忘记密码”处理邮件的邮箱地址
   */
  submitForgotPasswordToServer(receiveProcessedMail) {

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_SNS, SysActionConst.ACTION_APPEND3
      , receiveProcessedMail);
  }

  /**
   * 【接口1008-1-7】用户注册接口调用.
   */
  submitRegisterToServer(data: any) {
    return this.http.post(RBChatConfig._HTTP_REGISTER_URL, data);
  }

  /**
   * 校验验证码
   * @param data
   */
  submitVerifyCodeToServer(data: any) {
    return this.http.postForm(verifyCode, data);
  }

  /**
   * 检查用户名或者手机号是否存在
   * @param params
   * @param data
   */
  checkUsernameAndPhone(params: string, data: any) {
    return this.http.post(RBChatConfig._HTTP_CHECK_REPEAT_URL + params, data);
  }

  getAppConfig() {
    return this.http.get(getAppConfig);
  }

  /**
   * 【接口1008-1-25】更新昵称、性别、个性签名、个人其它说明的综合接口.
   */
  submitUserInfoModifiyToServer(newNickname, newSex, newWhatsup, newOthercaption, uid) {

    // 要提交给服务端的参数
    const m = {
      nickName: newNickname,    // 修改后的昵称
      sex: newSex,         // 修改后的性别
      whats_up: newWhatsup,     // 修改后的个性签名
      user_desc: newOthercaption,// 修改后的其它说明
      uid             // 被修改者的uid
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_REGISTER, SysActionConst.ACTION_APPEND7
      , JSON.stringify(m));
  }

  /**
   * 【接口1008-1-22】用户What'sUp（个性签名）修改接口调用.
   *
   * @param localUid 本地用户的uid
   * @param whats_up 要修改的个性签名内容
   * @fnForSucess DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   *            returnValue：1 表示更新成功，否则失败。具体返回值详见接口文档！
   */
  submitUserWhatsUpModifiyToServer(localUid, whats_up) {

    // 要提交给服务端的参数
    const m = {
      uid: localUid, // 本地用户uid
      whats_up, // 修改后的个性签名
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_REGISTER, SysActionConst.ACTION_APPEND4
      , JSON.stringify(m));
  }

  /**
   * 【接口1008-4-7】获取离线加好友请求接口.
   */
  submitGetOfflineAddFriendsReqToServer(localUid) {

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_GET_OFFLINE_ADD$FRIENDS$REQ, SysActionConst.ACTION_APPEND1
      , localUid);
  }

  /**
   * 【接口1008-4-9】获取未处理的加好友请求总数.
   */
  submitGetOfflineAddFriendsReqCountToServer(localUid) {

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_GET_OFFLINE_ADD$FRIENDS$REQ, SysActionConst.ACTION_APPEND3
      , localUid);
  }

  /**
   * 【接口1008-3-25】被添加者【同意】加好友请求的处理接口.
   */
  submitPROCESS_ADD$FRIEND$REQ_B$TO$SERVER_AGREE(srcUserUid, localUserUid, localUserNickName) {

    // 要提交给服务端的参数（本参数即CMDBody4ProcessFriendRequest对象，
    // 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/CMDBody4ProcessFriendRequest.html）
    const m = {
      srcUserUid,        // 发起好友请求的源用户（A）UID
      localUserUid,      // 接收好友请求的目标用户（B）UID，也是本次处理好友请求的发起方
      localUserNickName  // 处理者的昵称：此字段在"拒绝"操作时有用哦.
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_SNS, SysActionConst.ACTION_APPEND7
      , JSON.stringify(m));
  }

  /**
   * 【接口1008-3-25】被添加者【拒绝】加好友请求的处理接口.
   */
  submitPROCESS_ADD$FRIEND$REQ_B$TO$SERVER_REJECT(srcUserUid, localUserUid, localUserNickName) {

    // 要提交给服务端的参数（本参数即CMDBody4ProcessFriendRequest对象，
    // 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/CMDBody4ProcessFriendRequest.html）
    const m = {
      srcUserUid,        // 发起好友请求的源用户（A）UID
      localUserUid,      // 接收好友请求的目标用户（B）UID，也是本次处理好友请求的发起方
      localUserNickName  // 处理者的昵称：此字段在"拒绝"操作时有用哦.
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_SNS, SysActionConst.ACTION_APPEND8
      , JSON.stringify(m));
  }

  /**
   * 【接口1008-3-24】用户A发起的添加好友请求的处理接口.
   *
   * @param friendUid 将要被添加的好友uid
   * @param saySomethingToHim 加好友时的验证说明（由请求发出方填写，像QQ一样），为非必填项
   */
  submitAddFriendRequestToServer(friendUid, saySomethingToHim) {

    // 读取本地用户信息
    const localUserInfo = this.localUserService.getObj();

    // 本地用户的uid
    const localUserUid = localUserInfo.userId;

    // 要提交给服务端的参数（本参数即CMDBody4AddFriendRequest对象，
    // 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/CMDBody4AddFriendRequest.html）
    const m = {
      friendUserUid: friendUid,        // 将要被添加的好友uid
      localUserUid,     // 发起请求的好友uid（即本地用户）
      desc: saySomethingToHim, // 加好友时的验证说明（由请求发出方填写，像QQ一样）
      isForced: 0 // UIxuMyMobule.add_friend_super  //111  1 是强制加好友
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_SNS, SysActionConst.ACTION_APPEND6
      , JSON.stringify(m));
  }


  //111 新增强制加群
  submitJoinGroup(groupUid, inviteUid, saySomethingToHim) {
    // 读取本地用户信息
    const localUserInfo = this.localUserService.getObj();
    // 本地用户的uid
    const localUserUid = localUserInfo.userId;
    // 要提交给服务端的参数（本参数即CMDBody4AddFriendRequest对象，
    const m = {
      groupUid,
      'inviteUid ': inviteUid, //群主id
      localUserUid,     // 发起请求的好友uid（即本地用户）
      desc: saySomethingToHim, // 加好友时的验证说明（由请求发出方填写，像QQ一样）
      isForced: 0 // UIxuMyMobule.add_friend_super  //111  1是强制加好友
    };
    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_SNS, SysActionConst.ACTION_APPEND53
      , JSON.stringify(m));
  }


  /**
   * 【接口1008-4-8】获取离线聊天消息的接口调用.
   *
   * @param user_uid 离线消息所有者的uid
   * @param from_user_uid 离线消息由谁发送的uid。本参数为null表示取本地用户收到所有离线消息(不区分好友)，否则表示取指定好友发过来的离线消息！
   */
  submitGetOfflineChatMessagesToServer(user_uid, from_user_uid) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      user_uid,
      from_user_uid,
      osType:2 //新增离线
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_GET_OFFLINE_ADD$FRIENDS$REQ, SysActionConst.ACTION_APPEND2
      , JSON.stringify(m));
  }

  /**
   * 【接口1008-1-9】修改登陆密码接口调用.
   *
   * @param oldPassword 原密码（用于服务端验证原密码的正确性）
   * @param newPassword 新密码
   * @param localUid 本地用户的uid
   * @return DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   * returnValue：1 表示更新成功，0 表示失败，2 表示原密码不正确。具体返回值详见接口文档！
   */
  submitUserPasswordModifiyToServer(oldPassword, newPassword, localUid) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      uid: localUid,
      old_psw: oldPassword,
      psw: newPassword
    };

    return this.restServer(MyProcessorConst.PROCESSOR_LOGIC, JobDispatchConst.LOGIC_REGISTER, SysActionConst.ACTION_APPEND3
      , JSON.stringify(m));
  }

  /**
   * 【接口1016-25-7】获取用户的群组列表的接口调用.
   *
   * 返回值为：ArrayList<GroupEntity>数组转JSON后的字符串（
   * GroupEntity对象详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/GroupEntity.html）
   *
   * @param user_uid 要获取群组列表的用户uid
   */
  submitGetGroupsListFromServer(user_uid) {

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_QUERY_MGR, SysActionConst.ACTION_APPEND1
      , user_uid);
  }

  /**
   * 【接口1016-25-9】查询群成员列表的接口调用.
   *
   * 返回值为：ArrayList<GroupMemberEntity>数组转JSON后的字符串（
   * GroupEntity对象详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/GroupEntity.html）
   *
   * @param gid 要获取的目标群组id
   */
  submitGetGroupMembersListFromServer(gid) {
    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_QUERY_MGR, SysActionConst.ACTION_APPEND3,gid);
  }

  /**
   * 【接口1016-24-7】创建群组的接口调用.
   *
   * @param localUserUid 创建者（群主）的uid
   * @param localUserNickname 群主昵称
   * @param members 群成员(一维 GroupMemberEntity 对象数组)
   * @return DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   * returnValue：1 表示更新成功，0 表示失败，2 表示原密码不正确。具体返回值详见接口文档！
   */
  submitCreateGroupToServer(localUserUid, localUserNickname, members) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      // 创建者（群主）的uid
      owner_uid: localUserUid.toString(),
      // 群主昵称
      owner_nickname: localUserNickname,
      // 群成员
      members: members
    };

    const data = {
      jobDispatchId: JobDispatchConst.LOGIC_GROUP_BASE_MGR,
      newData: m,
      processorId: MyProcessorConst.PROCESSOR_GROUP_CHAT,
      token: this.localUserService.localUserInfo.token
    };

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_BASE_MGR, SysActionConst.ACTION_APPEND1
      , JSON.stringify(m));
    }

    /**
 * 用户好友相关 - 查看好友备注
 */
    getRemark(data: any): Observable<any> {
        const localUserInfo = this.localUserService.getObj();
        data.id = localUserInfo.userId.toString();

        return this.http.get(getRemark, data);
    }

    /**
      * 用户好友相关 - 获取好友列表
      */
    getfriendList(data: any): Observable<any> {
        const localUserInfo = this.localUserService.getObj();
        data.userId = localUserInfo.userId.toString();

        return this.http.get(getfriendList, data);
    }

    /**
     * 用户好友相关 - 修改好友备注
     */
    updRemark(data: any): Observable<any> {
        const localUserInfo = this.localUserService.getObj();
        data.id = localUserInfo.userId.toString();

        return this.http.postForm(updRemark, data);
    }

  /**
   * 【接口1016-24-23】删除群成员或退群接口调用.
   *
   * @param del_opr_uid 本次删除或退群的操作人uid（群主踢人时本参数为群主，如果是用户自已退出退路时本参数为退出者自已）
   * @param del_opr_nickname 本次删除或退群的操作人昵称
   * @param membersBeDelete 要删除或退群的群员（如果只是个人退群时，本参数就是只有一行的2维数组，数组数据内容详见接口文档或服务端代码）
   * @param gid 本次删除发生的群id
   * @return DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   * returnValue：1 表示更新成功，否则失败。具体返回值详见接口文档！
   */
  submitDeleteOrQuitGroupToServer(del_opr_uid
    , del_opr_nickname, gid, membersBeDelete) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      del_opr_uid,
      del_opr_nickname,
      gid,
      members: JSON.stringify(membersBeDelete)
    };

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_BASE_MGR, SysActionConst.ACTION_APPEND5
      , JSON.stringify(m));
  }

  /**
   * 【接口1016-24-24】邀请入群的接口调用.
   *
   * @param invite_uid 邀请发起人的uid
   * @param invite_nickname 邀请发起人的昵称
   * @param invite_to_gid 邀请至群
   * @param members 被邀请的成员（2维数组，数组数据内容详见接口文档或服务端代码）
   * @return DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   * returnValue：1 表示更新成功，否则失败。具体返回值详见接口文档！
   */
  submitInviteToGroupToServer(invite_uid, invite_nickname
    , invite_to_gid, members) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      invite_uid,
      invite_nickname,
      invite_to_gid,
      members: JSON.stringify(members)
    };

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_BASE_MGR, SysActionConst.ACTION_APPEND6
      , JSON.stringify(m));
  }

  /**
   * 【接口1016-24-25】转让本群（仅开放给群主）接口调用.
   *
   * @param old_owner_uid 原群主uid
   * @param new_owner_uid 新群主uid（即将被转让为群主）
   * @param new_owner_nickname 新群主的昵称
   * @param gid 转让发生的群
   * @return DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   * returnValue：1 表示更新成功，否则失败。具体返回值详见接口文档！
   */
  submitTransferGroupToServer(old_owner_uid, new_owner_uid
    , new_owner_nickname, gid) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      old_owner_uid,
      new_owner_uid,
      new_owner_nickname,
      g_id: gid
    };

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_BASE_MGR, SysActionConst.ACTION_APPEND7
      , JSON.stringify(m));
  }

  /**
   * 【接口1016-25-8】查询群基本信息的接口调用.
   *
   * @param gid 查询的群id
   * @param myUserId 非必须参数，如果本参数不为空，则表示要同时把”我“在该群中的昵称给查出来，否则不需要查
   */
  submitGetGroupInfoToServer(gid, myUserId) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      gid,
      my_user_id: myUserId
    };

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_QUERY_MGR, SysActionConst.ACTION_APPEND2
      , JSON.stringify(m));
  }

  /**
   * 【接口1016-24-26】解散群（仅开放给群主）接口调用.
   *
   * @param owner_uid 群主uid
   * @param gid 将要被解散的群
   * @return DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   * returnValue：1 表示更新成功，否则失败（其中2表示解散发起人已不是群主，本次解散失败）。具体返回值详见接口文档！
   */
  submitDismissGroupToServer(owner_uid, owner_nickname, gid) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      owner_uid,
      owner_nickname,
      g_id: gid
    };

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_BASE_MGR, SysActionConst.ACTION_APPEND8
      , JSON.stringify(m));
  }

  /**
   * 【接口1016-24-8】修改群名称接口调用.
   *
   * @param group_name 本次要修改成的新群名
   * @param gid 被修改的群id
   * @param modify_by_uid 修改者的uid
   * @param modify_by_nickname 修改者的昵称
   * @return DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   * returnValue：1 表示更新成功，否则失败。具体返回值详见接口文档！
   */
  submitGroupNameModifiyToServer(group_name
    , gid, modify_by_uid, modify_by_nickname) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      group_name,
      gid,
      modify_by_uid,
      modify_by_nickname
    };

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_BASE_MGR, SysActionConst.ACTION_APPEND2
      , JSON.stringify(m));
  }

  /**
   * 【接口1016-24-9】修改"我"的群昵称接口调用.
   *
   * @param nickname_ingroup 新的群内昵称
   * @param gid 我所在的群id
   * @param user_uid 被修改的用户uid
   * @return DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   * returnValue：1 表示更新成功，否则失败。具体返回值详见接口文档！
   */
  submitGroupNickNameModifiyToServer(nickname_ingroup
    , gid, user_uid) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      nickname_ingroup,
      gid,
      user_uid
    };

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_BASE_MGR, SysActionConst.ACTION_APPEND3
      , JSON.stringify(m));
  }

  /**
   * 【接口1016-24-22】修改群公告接口调用.
   *
   * @param g_notice 新的公告
   * @param g_notice_updateuid 本次公告修改人
   * @param gid 被修改的群id
   * @return DataFromServer中sucess参数：true表示本次接口成功完成、否则表失败，
   * returnValue：1 表示更新成功，否则失败。具体返回值详见接口文档！
   */
  submitGroupNoticeModifiyToServer(g_notice
    , g_notice_updateuid, gid) {

    // 要提交给服务端的参数（详见服务端接口代码或http rest接口文档中的说明）
    const m = {
      g_notice,
      g_notice_updateuid,
      g_id: gid
    };

    return this.restServer(MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_BASE_MGR, SysActionConst.ACTION_APPEND4
      , JSON.stringify(m));
  }

  //    111 退出登录
  loginOut() {
    const xum = {
      uid: "web" + this.localUserService.getObj().userId
    };

    return this.restServer(MyProcessorConst.PROCESSSOR_LOGOUT,-1 ,-1
      , JSON.stringify(xum));
  }

  /**
   * 获取我的收藏列表
   */
  getMyCollectList() {
    const localUser = this.localUserService.getObj();
    const data = {
      userId: localUser.userId,
    };
    return this.http.get(getMissuCollectById, data);
    }

    /**
     * s删除收藏
     */
    deleteMissuCollectById(id) {
        const localUser = this.localUserService.getObj();
        const data = {
            userId: localUser.userId,
        };
        return this.http.postForm(deleteMissuCollectById + '?id=' + id, {});
    }

  /**
   * 获取我的黑名单
   */
  getMyBlackList() {
    const localUser = this.localUserService.getObj();
    const data = {
      userId: localUser.userId,
    };
    return this.http.get(getMyBlackUser, data);
    }

    /**
       * 拉黑/取消拉黑
       */
    blackUser(data: any) {
        const localUserInfo = this.localUserService.getObj();
        data.userId = localUserInfo.userId;

        return this.http.postForm(blackUser, data);
    }

  /**
   * 查询用户资料
   * @param user_id
   */
  getUserBaseById(user_id: string): Observable<any> {
    return this.http.postForm(getUserBaseById, {userUid: user_id});
  }

    /**
     * 编辑个人信息
     * @param user_id
     */
    updateUserBaseById(data: any): Observable<any> {
        const localUserInfo = this.localUserService.getObj();
        data.userUid = localUserInfo.userId;

        return this.http.post(updateUserBaseById, data);
    }

    /**
    * 系统设置 - 获取声网Token
    * @param user_id
    */
    generateAgoraToken(touserid: any, islanch: boolean): Observable<any> {
        const localUserInfo = this.localUserService.getObj();

        var channelId = "";
        if (islanch == true) {
            channelId = localUserInfo.userId.toString() + '-' + touserid.toString();
        }
        else {
            channelId = touserid.toString() + '-' + localUserInfo.userId.toString();
        }

        return this.http.get(generateAgoraToken, { channelId: channelId });
    }

   /**
   * 隐私设置-隐私设置详情
   * @param user_id
   */
    getPrivacyConfigById(): Observable<any> {
        const localUserInfo = this.localUserService.getObj();
        return this.http.get(getPrivacyConfigById, { userId: localUserInfo.userId});
    }

    /**
     * 隐私设置-更新隐私设置
     * @param user_id
     */
    updatePrivacyConfig(data: any): Observable<any> {
        const localUserInfo = this.localUserService.getObj();
        data.userId = localUserInfo.userId;

        return this.http.post(updatePrivacyConfig, data);
    }

    /**
   * 用户相关-用户群聊列表
   * @param user_id
   */
    getUserJoinGroup(): Observable<any> {
        const localUserInfo = this.localUserService.getObj();
        return this.http.get(getUserJoinGroup, { userId: localUserInfo.userId });
    }

    /**
    * 群组相关 - 群页签列表
    */
    getUserGroupTab(clusterId): Observable<any> {
        return this.http.get(getUserGroupTab, { clusterId: clusterId });
    }

    /**
    * 群组相关 - 更新群页签
    */
    UpUserGroupTab(data: any): Observable<any> {
        return this.http.post(UpUserGroupTab, data);
    }

   /**
    * 群组相关 - 群客服列表
    */
    getGroupCustomerService(clusterId): Observable<any> {
        return this.http.get(getGroupCustomerService, { clusterId: clusterId });
    }

   /**
    * 群组相关 - 更新群客服
    */
    UpGroupCustomerService(data: any): Observable<any> {
        return this.http.post(UpGroupCustomerService, data);
    }

    /**
     * 通过id查询群的基本信息
     */
    getGroupBaseById(id) {
        const localUser = this.localUserService.getObj();
        const data = {
            userId: localUser.userId,
        };
        return this.http.get(getGroupBaseById, { id: id });
    }

    /**
     * 群组相关 - 更新群的基本信息
     * @param user_id
     */
    updateGroupBaseById(data: any): Observable<any> {
        //const localUserInfo = this.localUserService.getObj();
        //console.dir(localUserInfo)
        //data.userId = localUserInfo.userId;

        return this.http.post(updateGroupBaseById, data);
    }

    /*
     * 用户相关 - 新的朋友
     * @param user_id
     */
    getNewFriend(): Observable<any> {
        const localUserInfo = this.localUserService.getObj();
        return this.http.get(getNewFriend + localUserInfo.userId, {});
    }

    /**
    * 分组列表
    * @param user_id
    */
    getFriendGroupList(): Observable<any> {
        const localUserInfo = this.localUserService.getObj();
        return this.http.get(getFriendGroupList, { userId: localUserInfo.userId });
    }

  /**
   * 搜索好友
   * @param search [friendCornet 通讯号，friendAccount 账号]
   */
  getFriendSearch(search: {userId?: string; friendAccount: string}): Observable<any> {
    const localUserInfo = this.localUserService.getObj();
    search.userId = localUserInfo.userId.toString();
    return this.http.post(getFriendSearch, search);
  }

  /**
   * 获取群管理员列表
   * @param gid
   */
  getGroupAdminList(gid: string): Observable<any> {
    return this.http.get(getGroupAdminInfo, { clusterId: gid });
  }

  /**
   * 更新好友备注
   * @param data
   */
  updateFriendRemark(data: {id: string; toUserId: string; remark: string}): Observable<any> {
    return this.http.get(getGroupAdminInfo, data);
  }

  /**
   * 更新群管理员
   * @param clusterId
   * @param userIds string[]
   * @param type 0移除群管理员  1设为群管理员
   */
  updateGroupAdmin(clusterId: string, userIds: string[], type: 0|1) {
    const userIdString = userIds.join(",");
    return this.http.postForm(updateGroupAdmin, {
      clusterId: clusterId,
      userIds: userIdString,
      type: type
    });
  }

  /**
   * 退群/踢人
   * @param gid
   * @param del_opr_uid
   * @param members
   */
  removeGroupMembers(gid: string, del_opr_uid: string, members: unknown[]) {
    const post = {
      // del_opr_nickname: '', // 操作人昵称
      gid: gid, // 群id
      doInput: true,
      members: members,
      del_opr_uid: del_opr_uid, // 操作人id
    };
    return this.restServer(
      MyProcessorConst.PROCESSOR_GROUP_CHAT, JobDispatchConst.LOGIC_GROUP_BASE_MGR, SysActionConst.ACTION_APPEND5, JSON.stringify(post)
    );
  }

  /**
   * 对个人禁言
   * @param data
   */
  addGroupSilence(data: {clusterId: string; userId: string; durationTime: number; adminId: string}) {
    return this.http.post(addGroupSilence, data);
  }

  /**
   * 解除禁烟
   * @param data
   */
  deleteGroupSilenceById(data: {clusterId: string; userId: string; adminId: string}) {
    return this.http.post(addGroupSilence, data);
  }

  /**
   * 被禁言的人员列表
   * @param data
   */
  getGroupSilenceById(data: {clusterId: string}) {
    return this.http.post(addGroupSilence, data);
  }

  /**
   * 收藏消息
   * @param chat
   */
  addMissuCollect(chat: ChatmsgEntityModel) {
    const localUserInfo = this.localUserService.localUserInfo;
    const data = {
      content: chat.text,
      fromUserId: chat.uid,
      type: chat.msgType,
      userId: localUserInfo.userId,
    };
    return this.http.post(addMissuCollect, data);
  }

  /**
   * 更新密码
   * @param password
   */
  updatePassword(password: {oldPwd: string; newPwd: string}) {
    const localUserInfo = this.localUserService.localUserInfo;
    const data = {
      userId: localUserInfo.userId,
      ...password
    };
    return this.http.post(UpdatePassword, data);
  }

}

