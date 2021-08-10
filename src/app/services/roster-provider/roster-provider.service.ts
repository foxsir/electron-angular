import { Injectable } from '@angular/core';
import {LocalUserService} from "@services/local-user/local-user.service";
import {RestService} from "@services/rest/rest.service";
import RBChatUtils from "@app/libs/rbchat-utils";
import NewHttpResponseModel from "@app/models/new-http-response.model";

/**
 * 好友列表数据提供者（即好友列表全局数据模型）.
 */
@Injectable({
  providedIn: 'root'
})
export class RosterProviderService {
  public rosterData = [];

  constructor(
    private localUserService: LocalUserService,
    private restServiceService: RestService
  ) { }

  /**
   * 刷新好友列表(异步方式从服务端加载最新好友列表数据并缓存起来).
   *
   * @param fn_callback_for_success 回调函数，当本参数不为空时，数据加载成后后会通知此回函数，此回调函数里可以实现UI的刷新逻辑等
   */
  refreshRosterAsync() {
    const localUserUid = this.localUserService.getObj().userId;
    // return this.restServiceService.submitGetRosterToServer(localUserUid);
    // 通过rest接口获取好友列表数据
    this.restServiceService.submitGetRosterToServer(localUserUid).subscribe((res: NewHttpResponseModel<any>) => {
      // 服务端返回的是一维RosterElementEntity对象数组
      if(res.status === 200) {
        const rosterList = res.data;

        if (rosterList.length > 0) {
          RBChatUtils.logToConsole('【refreshRosterAsync】服务端返回的好友数据行数：' + rosterList.length);

          // 用最新的好友表数据刷新好友列表
          this.putFriends(rosterList);
        } else {
          RBChatUtils.logToConsole('【refreshRosterAsync】服务端返回的好友数据为空，本次拉取已结束。');
        }
      } else {
        RBChatUtils.logToConsole_ERROR("refreshRosterAsync: 获取好友列表失败");
      }
    });
  }

  /**
   * 加入一个新的好友信息对象.
   *
   * @param index
   * @param reeObj RosterElementEntity对象（详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro
   *                          /com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html）
   */
  putFriend(index, reeObj) {
    // 如果该好友已经存在于好友列表中（此种情况可能是服务端处理出错了
    // ，重复把好友信息发过来了，理论上此种边界问题不太可能存在），则
    // 发过来的对象覆盖上去（怎么说也算是最新数据了）
    if (this.isUserInRoster(reeObj.user_uid)) {
      // 用splice实现替换
      this.rosterData.splice(this.getIndex(reeObj.user_uid), 1, reeObj);
      return;
    }

    // 否则就是直接add到指定引位置（注意：splice函数的用法哦）
    this.rosterData.splice(index, 0, reeObj);
  }

  /**
   * @see #putFriend(int, RosterElementEntity)
   *
   * @param reeObj RosterElementEntity对象（详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro
   *                          /com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html）
   */
  putFriendWithRee(reeObj) {
    // 默认将新好友加到列表头部
    this.putFriend(0, reeObj);
  }

  /**
   * 用新的好友列表数据集合覆盖原有的数据。
   *
   * @param newDatas 一维RosterElementEntity对象数组
   */
  putFriends(newDatas) {
    // 先清空原先的数组（注意splice的用法和参数的含义哦）
    this.rosterData.splice(0, this.rosterData.length);

    // 再逐个放入数组元素
    for (let i = 0; i < newDatas.length; i++) {
      const ree = newDatas[i];
      // 注意splice函数的用法（向i索引处放入元素）
      this.rosterData.splice(i, 0, ree);
    }
  }

  /**
   * 移除列表中指定单元的元素.
   *
   * @param index 要删除的数组引位置
   * @return true表示删除成功，否则表示失败或者不存在
   */
  remove(index) {
    //return rosterData.remove(index, notifyObserver) != null;
    if (index >= 0 && index < this.rosterData.length) {
      this.rosterData.splice(index, 1); // 删除index位置的1个元素
    } else {
      alert('不合法的index：' + index + ', 清除好友缓存失败。');
    }
  }

  /**
   * 返回好友列表数据集合.
   * <p>
   * <b>注意：</b>如果好友列表为null则本方法将尝试先去服务端读取，然后再返回.
   *
   * @return 一维RosterElementEntity对象数组（RosterElementEntity对象详见：
   *          http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/
   *              x52im/rainbowchat/http/logic/dto/RosterElementEntity.html）
   */
  getRosterData() {
    return this.rosterData;
  }

  /**
   * 根据好友在业务系统中定义的UID找到它在好友列表中暂存的详细信息.
   *
   * @param uid
   * @return 如果存在则返回指定好友的信息封装RosterElementEntity对象，否则返回null（
   *          如果存在则返回指定好友的信息封装RosterElementEntity对象详见：
   *          http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/
   *              x52im/rainbowchat/http/logic/dto/RosterElementEntity.html)
   */
  getFriendInfoByUid(uid) {
    if (this.rosterData) {
      for (const ree of this.rosterData) {
        // 数组元素便是RosterElementEntity对象
        if (Number(ree.friendUserUid) === Number(uid)) {return ree;}
      }
    }

    return null;
  }

  /**
   * 指定uid用户是否在好友列表中.
   *
   * @param uid
   */
  isUserInRoster(uid): boolean {
    if (this.rosterData) {
      for (var i = 0; i < this.rosterData.length; i++) {
        // 数组元素便是RosterElementEntity对象
        var ree = this.rosterData[i];
        if (ree.user_uid == uid)
          return true;
      }
    }
    return false;
  }

  /**
   * 返回指定用户所在好友列表中的索引位置.
   *
   * @param uid
   */
  getIndex(uid): number {
    let index = -1;
    if (this.rosterData) {
      for (var i = 0; i < this.rosterData.length; i++) {
        // 数组元素便是RosterElementEntity对象
        var ree = this.rosterData[i];
        if (ree.user_uid === uid) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  /**
   * 返回指定用户所在好友列中的索引位置.
   *
   * @param ree RosterElementEntity对象（详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro
   *                          /com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html）
   * @return
   */
  getIndexByRee(ree) {
    return this.getIndex(ree.user_uid);
  }

  /**
   * 当前在线的好友数。
   *
   * @return
   */
  onlineCount(): number {
    let count = 0;
    if (this.rosterData) {
      for (const ree of this.rosterData) {
        // RosterElementEntity对象
        if (ree.liveStatus === 1) {count += 1;}
      }
    }
    return count;
  }

  /**
   * 返回当前好友列表的好友总数。
   *
   * @returns
   */
  size(): number {
    return this.rosterData.length;
  }

  /**
   * 设置所有好友离线.
   * <p>
   * 此方法的应用场景目前是在网络掉线（准确地说是与服务端断开连接）时，
   * 目的是模仿QQ在掉线时的体验，在本APP中好久是设置离线后，本地用户就不可以发出消息了，
   * 否则在目前UDP的聊天框架下，这样也可以作为告之本地用户掉线的一种间接方式，否则怎么好
   * 提示他本地掉线了呢？之前的Toast方式太难看了。
   */
  offlineAll() {
    if (this.rosterData) {
      for (const ree of this.rosterData) {
        // RosterElementEntity对象
        ree.liveStatus = 0;
      }
    }
  }
}
