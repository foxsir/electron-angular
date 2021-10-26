import { Injectable } from '@angular/core';
// import {RestService} from "@services/rest/rest.service";
import RBChatUtils from "@app/libs/rbchat-utils";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {UserModel} from "@app/models/user.model";

/**
 * 缓存管理类。
 *
 * 使用面向对向的方式调用实现方法，是为了规范代码的引用和调用，否则浏览器端引用的JS一多，
 * 各种交叉调用会让代码看起来异常混乱。
 *
 * @author Jack Jiang(http://www.52im.net/space-uid-1.html)
 * @version 1.0
 */
/**
 * 当前登陆用户的个人信息全局对象。
 * 本对象在用户登陆成功后被设置，后绪的个人信息显示、更新等统一使用本对象来完成即可。
 *
 * 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html
 */
@Injectable({
  providedIn: 'root'
})
export class LocalUserService {
  public localUserInfo: LocalUserinfoModel;
  public token;

  constructor(
    // private restService: RestService
  ) {
    this.localUserInfo = RBChatUtils.getAuthedLocalUserInfoFromCookie();
  }

  /**
   * 获取本地用户地uid。
   *
   * @returns
   * @see getObj_AlertIfNotExist()
   */
  getUid() {
    return this.getObj()?.userId;
    // return this.getObj_AlertIfNotExist()?.user_uid;
  }

  /**
   * 获取本地用户的个人信息（这个信息是在登陆时获取到的）。
   *
   * @returns
   */
  // 如不使用prototype则相当于静态方法，否则如果使用prototype则相当于实例方法，需要new了才能使用哦！
  getObj() {
    //return RBChatUtils.getAuthedLocalUserInfoFromCookie();
    return this.localUserInfo;
  }

  /**
   * 获取本地用户的个人信息（这个信息是在登陆时获取到的），本方法将在读取到本地用户信息为空时给一个alert提示给用户。
   *
   * @returns
   * @see getObj()
   */
  // 如不使用prototype则相当于静态方法，否则如果使用prototype则相当于实例方法，需要new了才能使用哦！
  getObj_AlertIfNotExist() {
    //var localUserInfo = this.getObj();
    if (this.localUserInfo) {
      return this.localUserInfo;
    } else {
      // alert('本地用户数据不存在，请重新登陆后再使用！');
      return null;
    }
  }

  /**
   * 保存最新的本地用户个人信息
   *
   * @param localUserInfoObj
   */
  // 如不使用prototype则相当于静态方法，否则如果使用prototype则相当于实例方法，需要new了才能使用哦！
  update(localUserInfoObj) {
    if (!localUserInfoObj) {
      console.info('【LocalUserInfo.save()】要save的localUserInfo是空的？localUserInfo=' + localUserInfoObj);
    }

    // 将新的用户信息对象更新到缓存中
    const oldLoginUserToken = this.token;
    const newLoginUserToken = localUserInfoObj.token;
    this.localUserInfo = localUserInfoObj;
    if (!newLoginUserToken) {
      this.localUserInfo.token = oldLoginUserToken;
    }

    // 同时存一份到cookie中
    RBChatUtils.saveAuthedLocalUserInfoToCookie(localUserInfoObj);
  }

  /**
   * 从Cookie中清除上次登陆获取到的个人信息（切换账号或重新登陆的情况下，请调用本函数）。
   */
  clear() {
    this.localUserInfo = null;
    // save空内容，即表示从本地cookie中删除本地用户的个人信息数据
    RBChatUtils.saveAuthedLocalUserInfoToCookie(null);
  }

  /**
   * 从服务端加载最新的本地用户信息（并保存到本地缓存、cookie中）。
   *
   * @param fn_callback_ok 本地用户信息加载成功后将调用本回调，本参数为空时将不调用
   */
  // reloadFromServer(fn_callback_ok) {
  //   const that = this;
  //
  //   // 调用HTTP REST接口：“【接口1008-3-8】获取用户/好友的个人信息”，接口返回值详细情况，详见接口文档或服务端代码。
  //   // 开始从服务端查询指定uid的用户基本信息，同时尝试在ui上显示之
  //   // this.getUid() 注意此id为本地用户的uid
  //   // 数据读取成功后的回调
  //   this.restService.submitGetUserInfoToServer(false, null, this.getUid(),function(returnValue) {
  //       // 服务端返回的是java对象RosterElementEntity的JSON文本
  //       const ree = JSON.parse(returnValue);
  //
  //       if (ree) {
  //         that.update(ree);
  //
  //         if (fn_callback_ok)
  //         {fn_callback_ok();}
  //       } else {
  //         RBChatUtils.logToConsole_WARN('[前端-GET-【接口1008-3-8】[reloadFromServer]本地用户个人信息获取接口返回值解析后] 数据为空，' +
  //           '无需进入ui处理代码。(returnValue=' + returnValue + ')');
  //       }
  //     },
  //     // 数据读取失败后的回调
  //     function(errorThrownStr) {
  //       RBChatUtils.logToConsole_ERROR('[前端-GET-【接口1008-3-8】[reloadFromServer]本地用户的基本信息数据读取出错，可能是网络故障，请稍后再试！');
  //     }
  //   );
  // }

  /**
   * @param data
   */
  updateLocalUserInfo(data: UserModel) {
    const local: Partial<LocalUserinfoModel> = {
      latest_login_ip: data.latestLoginIp,
      latest_login_time: null,
      login: true,
      maxFriend: data.maxFriend,
      nickname: data.nickname,
      online: data.online,
      userAvatarFileName: data.userAvatarFileName,
      userDesc: data.whatSUp,
      userType: data.userType,
      user_mail: data.userMail,
      user_phone: data.userPhone,
      user_sex: data.userSex,
      whatSUp: data.whatSUp,
    };
    this.update( Object.assign(this.localUserInfo, local) );
  }



}
