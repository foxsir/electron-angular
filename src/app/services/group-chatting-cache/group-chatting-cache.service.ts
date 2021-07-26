import { Injectable } from '@angular/core';
import RBChatUtils from "@app/libs/rbchat-utils";

/**
 * 群聊数据缓存（即群组聊天的全局数据缓存）.
 *
 *   【补充说明】：
 *   > 考虑到未来的扩展性，以及JS语言面向对象设计的局限性，本缓存类
 *   没有直接重用单聊缓存类SingleChattingCache，目的是保证本类的未来扩展性，
 *   以及代码的可读性。但因此带来的部分代码冗余，在可接授范围内。
 *   > 另一方面，重用代码带来的代码复杂性增加，以及接下来版本的拆分等，都是不方便，
 *   所以两边单独维护是目前的最佳方法。
 *
 * @since 1.3
 */
@Injectable({
  providedIn: 'root'
})
export class GroupChattingCacheService {
  private _groupsMsgCache = {};

  constructor() { }

  /**
   * 在缓存列表中加入一组新的群组聊天数据（如果
   * 之前不存在该访客则新建一个，否则在原先的聊天记录上附加上）。
   *
   * @param gid
   * @param chatMsgEntitys对象，为null表示仅在缓存列表中加入新群组（无聊天消息）
   * @param isAddToHead true表示添加到对应群组缓存数据（数组）的开头，否则默认添加到末尾
   */
  putChatCaches(gid, chatMsgEntitys, isAddToHead) {
    if (chatMsgEntitys && chatMsgEntitys.length > 0) {
      for (var i = 0; i < chatMsgEntitys.length; i++) {
        //111
        if (chatMsgEntitys[i].xu_isRead_type != "57") {
          // console.log(chatMsgEntitys[i])
          this.putChatCache(gid, chatMsgEntitys[i], isAddToHead);
        }
        //原版
        // this.putChatCache(gid, chatMsgEntitys[i], isAddToHead);
      }
    } else {
      RBChatUtils.logToConsole('[GroupChattingCache.putChatCaches中]要放入的缓存数据是空的，本次无数据要放入！(chatMsgEntitys='
        + chatMsgEntitys + ')');
    }

  }

  /**
   * 在缓存列表中加入一条新的聊天数据（如果
   * 之前不存在该群组的缓存记录则新建一个，否则在原先的聊天记录上附加上）。
   *
   * @param gid
   * @param chatMsgEntity ChatMsgEntity对象，为null表示仅在缓存列表中加入新群组（无聊天消息）
   * @param isAddToHead true表示添加到对应群组缓存数据（数组）的开头，否则默认添加到末尾
   * @returns Any
   */
  putChatCache(gid, chatMsgEntity, isAddToHead) {
    try {
      if (gid != "") {
        // console.log(this._groupsMsgCache)
        for (var vid in this._groupsMsgCache) {


          if (vid == gid) {
            // 只有当要插入的对象不为空时才加入到数组中（为空的情况，可能是仅
            // 仅想在缓存里增加该群聊的记录，虽然暂无聊天数据）
            if (chatMsgEntity) {
              // 以经存在聊天列表则在原先的记录（ChatMsgEntity数组）数据上Push进去新的一条消息
              var lastData = this._groupsMsgCache[gid];
              // 是否需要放入到开头
              if (isAddToHead) {
                lastData.unshift(chatMsgEntity);
              }
              // 否则放入到末尾
              else {
                lastData.push(chatMsgEntity);
              }

              this._groupsMsgCache[gid] = lastData;
              // debugger
            }
            return;
          }
        }

        // 聊天记录是一个ChatMsgEntity对象为元素的数据
        var data = new Array();
        if (chatMsgEntity) {
          data.push(chatMsgEntity);// 注意：此ChatMsgEntity对象可能是空的，为空时表示只想在缓存列表上把群组加
                                   // 入（而无聊天信息），以便后绪的逻辑中可以知道该群组是否已存在于列表中
        }
        // 参数oneChatProtocalObj如果是空的，就相当于给在线列表加一个聊天消息是空的的群组
        this._groupsMsgCache[gid] = data;
      }
    } catch (e) {
      return e;
    }
  }

  /**
   * 返回指定群组的聊天缓存数据。
   *
   * @param gid
   * @returns Array[ChatMsgEntity对象]
   */
  getChatCache(gid) {// 就是获取聊天记录数组Array对象
    try {
      if (this._groupsMsgCache[gid])
        // debugger
        return this._groupsMsgCache[gid];
    } catch (e) {
      return e;
    }
  }

  /**
   * 返回指定群组的聊天缓存数据行数。
   *
   * @param gid
   * @returns Number[大于等于0的整数]
   */
  getChatCacheLength(gid) {
    try {
      if (this._groupsMsgCache[gid])
        return this._groupsMsgCache[gid].length;
      else
        return 0;
    } catch (e) {
      return e;
    }
  }

  /**
   * 返回指定群组的聊天缓存数据中的“第一条”。
   *
   * @param gid
   * @returns ChatMsgEntity对象（如果存在的话）
   */
  getChatCacheFirst(gid) {// 就是获取聊天记录数组Array对象中的第0单元
    try {
      var datas = this._groupsMsgCache[gid];
      if (datas && datas.length > 0)
        return datas[0];
    } catch (e) {
      return e;
    }
  }

  /**
   * 指定群组是否已经存在聊天数据的缓存。
   *
   * @param gid
   * @returns {boolean} true表示是，否则表示否
   */
  containsChatCache(gid) {
    try {
      for (var vid in this._groupsMsgCache) {
        if (vid === gid)
          return true;
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  /**
   * 判断给定的指纹id（消息唯一id）是否已经存在于与该群的聊天数据缓存中。
   *
   * @param gid
   * @param fp
   * @returns {boolean} true表示是，否则表示否
   * @author add by JackJiang 20170918
   */
  containsFingerPrintInChatCache(gid, fp) {

    if (fp) {

      if (this.containsChatCache(gid)) {

        // 取出聊天列表的缓存的记录（ChatMsgEntity数组）
        var lastData = this._groupsMsgCache[gid];

        // 遍历缓存数组中的消息，看看该指纹码对应的消息是否存在，如存在则返回true
        if (lastData) {

          //标准的for循环：遍历 Array[ChatMsgEntity对象] 数组
          for (var i = 0; i < lastData.length; i++) {
            var cachedP = lastData[i];

            if (cachedP) {
              if (cachedP.fingerPrintOfProtocal === fp) {
                RBChatUtils.logToConsole('【DEBUG】[消息重复判断]已经成功匹配群组 ' + gid + '(目标：' + fp + '的聊天缓存！【OK】');
                return true;
              }
            }
          }
        }
      } else {
        RBChatUtils.logToConsole('【DEBUG】[消息重复判断]群组 ' + gid + '(目标：' + fp + ')的聊天缓存不存在，本次匹配结束！【NO】');
      }
    }

    return false;
  }

  /**
   * 从JS缓存中移除与指定群组的所有聊天数据。
   *
   * @param gid
   * @returns Any
   */
  removeChatCache(gid) {
    try {
      if (this._groupsMsgCache[gid]) {
        delete this._groupsMsgCache[gid];
        return true;
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  /**
   * 清空群组的聊天消息缓存数据。
   *
   * @returns Any
   */
  removeAllChatCache() {
    try {
      delete this._groupsMsgCache;
      this._groupsMsgCache = {};
    } catch (e) {
      return e;
    }
  }

  showAllCacheForDebug() {
    RBChatUtils.logToConsole("【群聊】[hashmap.js_showAll()] 正在输出HashMap内容(列表长度 "
      + JSON.stringify(this._groupsMsgCache) + ") ------------------->");
    //遍历
    for (var gid in this._groupsMsgCache) {
      RBChatUtils.logToConsole("【群聊】[hashmap.js_showAll()]       > key=" + gid + ", value="
        + JSON.stringify(this._groupsMsgCache[gid]));
    }
  }

}
