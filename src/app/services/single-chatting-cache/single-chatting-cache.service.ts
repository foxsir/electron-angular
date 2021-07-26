import { Injectable } from '@angular/core';
import RBChatUtils from "@app/libs/rbchat-utils";
import {LocalUserService} from "@services/local-user/local-user.service";
import {RestService} from "@services/rest/rest.service";

/**
 * 一对一聊天数据缓存（即一对一好友聊天、一对一陌生人聊天的全局数据缓存）.
 */
@Injectable({
  providedIn: 'root'
})
export class SingleChattingCacheService {

  // 一对一聊天数据缓存Map(key=用户的uid, value=当前聊天记录数组（数组单元是ChatMsgEntity对象）)，
  // ChatMsgEntity对象的字段定义请见：rbchat_cache.js中的ChatMsgEntity对象定义部分
  private _usersMsgCache = {};

  constructor(
    private localUserService: LocalUserService,
    private restService: RestService,
  ) { }

  /**
   * 加载离线聊天消息完整数据(异步方式从服务端加载历史数据).
   *
   * 注意：因单聊和群聊的离线消息格式完全一致，因而群聊没有单独的离线加载代码，重用本方法即可。
   *
   * @param from_user_uid 本参数为null表示不区分好友地取所有未读的离线消息，否则只取指定uid发过来的离线聊天消息
   * @param fn_callback_for_success(offlineMessagesList) 回调函数，当本参数不为空时，数据加载成后后会通知此
   * 回调函数，此回调函数里可以实现UI的刷新逻辑等
   */
  loadOfflineMessagesAsync(from_user_uid, fn_callback_for_success) {

    const localUserUid = this.localUserService.getUid();

    // 通过rest接口获取离线聊天数据（详见：“【接口1008-4-8】获取离线聊天消息的接口”的文档或服务端源码）
    return this.restService.submitGetOfflineChatMessagesToServer(localUserUid, from_user_uid);
  }

  /**
   * 在缓存列表中加入一组新的用户聊天数据（如果
   * 之前不存在该访客则新建一个，否则在原先的聊天记录上附加上）。
   *
   * @param uid
   * @param chatMsgEntitys对象，为null表示仅在缓存列表中加入新用户（无聊天消息）
   * @param isAddToHead true表示添加到对应人员缓存数据（数组）的开头，否则默认添加到末尾
   */
  putChatCaches(uid, chatMsgEntitys, isAddToHead) {
    if (chatMsgEntitys && chatMsgEntitys.length > 0) {
      for (let i = 0; i < chatMsgEntitys.length; i++) {
        // 111
        if (chatMsgEntitys[i].xu_isRead_type !== "57") {
          this.putChatCache(uid, chatMsgEntitys[i], isAddToHead);
        }
        //原版
        // this.putChatCache(uid, chatMsgEntitys[i], isAddToHead);
      }
    } else {
      RBChatUtils.logToConsole('[SingleChattingCache.putChatCaches中]要放入的缓存数据是空的，本次无数据要放入！(chatMsgEntitys='
        + chatMsgEntitys + ')');
    }
  }

  /**
   * 在缓存列表中加入一条新的聊天数据（如果
   * 之前不存在该用户的缓存记录则新建一个，否则在原先的聊天记录上附加上）。
   *
   * @param uid
   * @param chatMsgEntity ChatMsgEntity对象，为null表示仅在缓存列表中加入新用户（无聊天消息）
   * @param isAddToHead true表示添加到对应人员缓存数据（数组）的开头，否则默认添加到末尾
   * @returns Any
   */
  putChatCache(uid, chatMsgEntity, isAddToHead) {
    try {
      //if(this.length >= this.maxLength)
      //    throw new Error("[Error HashMap] : Map Datas' count overflow !");
      if (uid != "") {
        for (const vid in this._usersMsgCache) {
          if (vid == uid) {
            // 只有当要插入的对象不为空时才加入到数组中（为空的情况，可能是仅
            // 仅想在缓存里增加该访客的记录，虽然暂无聊天数据）
            if (chatMsgEntity) {
              // 以经存在聊天列表则在原先的记录（ChatMsgEntity数组）数据上Push进去新的一条消息
              const lastData = this._usersMsgCache[uid];
              // 是否需要放入到开头
              if (isAddToHead) {
                lastData.unshift(chatMsgEntity);
              }
              // 否则放入到末尾
              else {
                lastData.push(chatMsgEntity);
              }

              this._usersMsgCache[uid] = lastData;
            }
            return;
          }
        }

        // 聊天记录是一个ChatMsgEntity对象为元素的数据
        const data = new Array();
        if (chatMsgEntity) {
          data.push(chatMsgEntity);// 注意：此ChatMsgEntity对象可能是空的，为空时表示只想在缓存列表上把用户加
                                   // 入（而无聊天信息），以便后绪的逻辑中可以知道该用户是否已存在于列表中
        }
        // 参数oneChatProtocalObj如果是空的，就相当于给在线列表加一个聊天消息是空的的用户
        this._usersMsgCache[uid] = data;
      }
    } catch (e) {
      return e;
    }
  }

  /**
   * 覆盖指定uid的聊天数据。
   *
   * @param uid
   * @param chatMsgEntityArrays Array[ChatMsgEntity对象]数组
   * @returns Any
   */
  coverChatCache(uid, chatMsgEntityArrays) {
    try {
      if (uid != "") {
        // 如果存在则直接覆盖（替换）成最新的
        this._usersMsgCache[uid] = chatMsgEntityArrays;
      }
    } catch (e) {
      return e;
    }
  }

  /**
   * 返回指定用户的聊天缓存数据。
   *
   * @param uid
   * @returns Array[ChatMsgEntity对象]
   */
  getChatCache(uid) {// 就是获取聊天记录数组Array对象
    try {
      if (this._usersMsgCache[uid])
        {return this._usersMsgCache[uid];}
    } catch (e) {
      return e;
    }
  }

  /**
   * 返回指定用户的聊天缓存数据行数。
   *
   * @param uid
   * @returns Number[大于等于0的整数]
   */
  getChatCacheLength(uid) {
    try {
      if (this._usersMsgCache[uid]) {
        return this._usersMsgCache[uid].length;
      } else {
        return 0;
      }
    } catch (e) {
      return e;
    }
  }

  /**
   * 返回指定用户的聊天缓存数据中的“第一条”。
   *
   * @param uid
   * @returns ChatMsgEntity对象（如果存在的话）
   */
  getChatCacheFirst(uid) {// 就是获取聊天记录数组Array对象中的第0单元
    try {
      const datas = this._usersMsgCache[uid];
      if (datas && datas.length > 0)
        {return datas[0];}
    } catch (e) {
      return e;
    }
  }

  /**
   * 指定用户是否已经存在聊天数据的缓存。
   *
   * @param uid
   * @returns true表示是，否则表示否
   */
  containsChatCache(uid) {
    try {
      for (const vid in this._usersMsgCache) {
        if (vid === uid)
          {return true;}
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  /**
   * 判断给定的指纹id（消息唯一id）是否已经存在于与该用户的聊天数据缓存中。
   *
   * @param uid
   * @param fp
   * @returns true表示是，否则表示否
   * @author add by JackJiang 20170918
   */
  containsFingerPrintInChatCache(uid, fp) {

    if (fp) {

      if (this.containsChatCache(uid)) {

        // 取出聊天列表的缓存的记录（ChatMsgEntity数组）
        const lastData = this._usersMsgCache[uid];

        // 遍历缓存数组中的消息，看看该指纹码对应的消息是否存在，如存在则返回true
        if (lastData) {

          //标准的for循环：遍历 Array[ChatMsgEntity对象] 数组
          for (let i = 0; i < lastData.length; i++) {
            const cachedP = lastData[i];

            if (cachedP) {
              if (cachedP.fingerPrintOfProtocal === fp) {
                RBChatUtils.logToConsole('【DEBUG】[消息重复判断]已经成功匹配用户 ' + uid + '(目标：' + fp + '的聊天缓存！【OK】');
                return true;
              }
            }
          }
        }
      } else {
        RBChatUtils.logToConsole('【DEBUG】[消息重复判断]用户 ' + uid + '(目标：' + fp + ')的聊天缓存不存在，本次匹配结束！【NO】');
      }
    }

    return false;
  }

  /**
   * 从JS缓存中移除与指定用户的所有聊天数据。
   *
   * @param uid
   * @returns
   */
  removeChatCache(uid) {
    try {
      if (this._usersMsgCache[uid]) {
        delete this._usersMsgCache[uid];
        return true;
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  /**
   * 清空与该用户的聊天消息缓存数据。
   *
   * @returns
   */
  removeAllChatCache() {
    try {
      delete this._usersMsgCache;
      this._usersMsgCache = {};
    } catch (e) {
      return e;
    }
  }

  showAllCacheForDebug() {
    RBChatUtils.logToConsole("【单聊】[hashmap.js_showAll()] 正在输出HashMap内容(列表长度 "
      + JSON.stringify(this._usersMsgCache) + ") ------------------->");
    //遍历
    for (const uid in this._usersMsgCache) {
      if (this._usersMsgCache[uid]) {
        RBChatUtils.logToConsole("【单聊】[hashmap.js_showAll()]       > key=" + uid + ", value="
          + JSON.stringify(this._usersMsgCache[uid]));
      }
    }
  }
}
