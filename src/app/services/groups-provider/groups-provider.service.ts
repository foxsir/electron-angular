import {Injectable} from '@angular/core';
import RBChatUtils from "@app/libs/rbchat-utils";
import {LocalUserService} from "@services/local-user/local-user.service";
import {RestService} from "@services/rest/rest.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";

/**
 * "我"的群组列表数据提供者（即我的群组列表全局数据模型）.
 *
 * @since 1.3
 */
@Injectable({
  providedIn: 'root'
})
export class GroupsProviderService {
  /**
   * BBS聊天（即世界频道）所对应的群组聊天id（因为世界频道是个特殊
   * 的群聊，属系统默认无需创建，所以给它一个默认的固定id，以便跟普
   * 通群聊区分开来）.
   *
   * 注：世界频道功能目前仅在APP版产品中存在，且未来可能将删除，web版产品中暂不打算实现之。
   */
  DEFAULT_GROUP_ID_FOR_BBS = "-1";

  groupsListData = [];

  constructor(
    private localUserService: LocalUserService,
    private restService: RestService,
    private snackBarService: SnackBarService,
  ) { }

  /**
   * 刷新群组列表(异步方式从服务端加载最新好友列表数据并缓存起来).
   *
   * @param fn_callback_for_success 回调函数，当本参数不为空时，数据加载成后后会通知此回函数，此回调函数里可以实现UI的刷新逻辑等
   */
  refreshGroupsListAsync(fn_callback_for_success) {
    const localUserUid = this.localUserService.getObj().userId;
    // 通过rest接口获取群组列表数据
    return this.restService.submitGetGroupsListFromServer(localUserUid);
  }

  /**
   * 更新指定群组的信息（如果老的群信息不存在则本方法什么也不做）。
   *
   * @param newGe GroupEntity对象（
   * 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/GroupEntity.html）
   */
  updateGroup(newGe) {
    if (newGe) {
      const oldGe = this.getGroupInfoByGid(newGe.g_id);
      if (oldGe != null) {
        oldGe.g_id = newGe.g_id;
        oldGe.g_status = newGe.g_status;
        oldGe.g_name = newGe.g_name;
        oldGe.g_owner_user_uid = newGe.g_owner_user_uid;
        oldGe.g_notice = newGe.g_notice;
        oldGe.max_member_count = newGe.max_member_count;
        oldGe.g_member_count = newGe.g_member_count;
        oldGe.g_owner_name = newGe.g_owner_name;
        oldGe.nickname_ingroup = newGe.nickname_ingroup;

        oldGe.g_notice_updateuid = newGe.g_notice_updateuid;
        oldGe.g_notice_updatenick = newGe.g_notice_updatenick;
        oldGe.g_notice_updatetime = newGe.g_notice_updatetime;

        // 把oldGe对象重新put进去（完成对象内容更新）
        const index = this.getIndex(oldGe.g_id);
        if (this.checkIndexValid(index)) {
          this.putGroup(index, oldGe);
        }
      }
    }
  }

  /**
   * 更新缓存中的群组成员数量。
   * 注意：因成员数不是普通的文本字段，本函数单独出来，就是为了能更好地处理这个数据的边界等合法性问题。
   *
   * @param deltaCount 变动的群成员总数，负数表示减成员、正数表示加了群员数（本参数为空表示不更新此字段）
   */
  updateGroupMemberCount(gid, deltaCount) {
    const oldGe = this.getGroupInfoByGid(gid);
    if (oldGe != null) {

      //if (newGroupName)
      //    oldGe.g_name = newGroupName;

      if (deltaCount) {
        // 该群删除成员前的总成员数
        let currentMemberCount = 1;
        const currentMemberCountStr = oldGe.g_member_count;
        if (currentMemberCountStr) {
          currentMemberCount = parseInt(currentMemberCountStr, 10);
        }
        if (currentMemberCount < 1) {
          currentMemberCount = 1;
        }

        // 新的总数
        oldGe.g_member_count = currentMemberCount + parseInt(deltaCount);
      }

      // 把oldGe对象重新put进去（完成对象内容更新）
      const index = this.getIndex(oldGe.g_id);
      if (this.checkIndexValid(index)) {
        this.putGroup(index, oldGe);
      }
    }
  }

  /**
   * 加入一个新的群组信息对象.
   *
   * @param index
   * @param geObj GroupEntity对象（
   * 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/GroupEntity.html）
   */
  putGroup(index, geObj) {
    // 如果该群基本信息已经存在于列表中那就用最新的覆盖
    if (this.isInGroupList(geObj.g_id)) {
      // 用splice实现替换
      this.groupsListData.splice(this.getIndex(geObj.g_id), 1, geObj);
      return;
    }

    // 否则就是直接add到指定引位置（注意：splice函数的用法哦）
    this.groupsListData.splice(index, 0, geObj);
  }

  /**
   * 用新的群组列表数据集合覆盖原有的数据。
   *
   * @param newDatas  一维GroupEntity对象数组
   */
  putGroups(newDatas) {
    // 先清空原先的数组（注意splice的用法和参数的含义哦）
    this.groupsListData.splice(0, this.groupsListData.length);

    // 再逐个放入数组元素
    for (let i = 0; i < newDatas.length; i++) {
      const ree = newDatas[i];
      // 注意splice函数的用法（向i索引处放入元素）
      this.groupsListData.splice(i, 0, ree);
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
    if (index >= 0 && index < this.groupsListData.length) {
      this.groupsListData.splice(index, 1); // 删除index位置的1个元素
    } else {
      alert('不合法的index：' + index + ', 清除群组缓存失败。');
    }
  }

  /**
   * 移除列表中指定群id的元素.
   *
   * @param gid 群id
   */
  removeByGid(gid) {
    const index = this.getIndex(gid);
    if (this.checkIndexValid(index))
      {this.remove(index);}
    else
      {console.info('【WARN】removeByGid时，index无效！(index=' + index + ')');}
  }

  /**
   * 指定gid群组是否在群组列表中.
   *
   * @param gid
   */
  isInGroupList(gid) {
    if (this.groupsListData) {
      for (const ree of this.groupsListData) {
        // 数组元素便是GroupEntity对象
        if (ree.g_id === gid) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 根据gid找到群组列表数据模型中的群组基本信息数据。
   *
   * @param gid
   * @return 如果存在则返回指定群组的信息封装对象GroupEntity（
   * 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/GroupEntity.html
   * ），否则返回null
   */
  getGroupInfoByGid(gid) {
    if (this.groupsListData) {
      for (const ree of this.groupsListData) {
        // 数组元素便是GroupEntity对象
        if (ree.g_id === gid) {
          return ree;
        }
      }
    }

    return null;
  }

  /**
   * 返回指定群组所在群组列表中的索引位置.
   *
   * @param gid
   * @return 索引值
   */
  getIndex(gid) {
    let index = -1;
    if (this.groupsListData) {
      for (let i = 0; i < this.groupsListData.length; i++) {
        // 数组元素便是RosterElementEntity对象
        const ree = this.groupsListData[i];
        if (ree.g_id === gid) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  /**
   * 检查索引值是否合法（有无超过数据合法索引）。
   *
   * @param index 数据所在数组的索引位置
   * @return true表示此索引值没有越界，否则已越界或不合法
   */
  checkIndexValid(index) {
    return (index >= 0 && index <= (this.groupsListData.length - 1));
  }

  /**
   * 返回"我"群组列表数据集合.
   * <p>
   * <b>注意：</b>如果群组列表为null则本方法将尝试先去服务端读取，然后再返回.
   *
   * @return 一维GroupEntity对象数组（GroupEntity对象详见：
   *          http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/GroupEntity.html）
   */
  getGroupsListData() {
    return this.groupsListData;
  }

  /**
   * 返回当前群组列表的群总数。
   *
   * @returns
   */
  size() {
    return this.groupsListData.length;
  }


  /**
   * 本地用户是否群主。
   *
   * @param ownerUid 群主的uid
   * @return
   */
  isGroupOwner(ownerUid) {
    const localUserUid = this.localUserService.getUid();
    return localUserUid && (localUserUid == ownerUid);
  }

  /**
   * 返回"我"在群内的昵称(如果参数不为空，就直接返回，否则返回"我"的默认昵称作为群内昵称)。
   *
   * @param context
   * @param nickname_ingroup
   * @return
   */
  getMyNickNameInGroup(nickname_ingroup) {
    if (!RBChatUtils.isStringEmpty(nickname_ingroup))
      {return nickname_ingroup;}
    else {
      // RosterElementEntity 对象
      const localUser = this.localUserService.getObj();
      ;
      if (localUser)
        {return localUser.nickname;}

      return "";
    }
  }

  /**
   * 返回群内昵称（如果群内昵称为空，则返回默认昵称，否则返回群内昵称）。
   *
   * @param nickName
   * @param nickname_ingroup
   * @return
   */
  getMickNameInGroup(nickName, nickname_ingroup) {
    if (!RBChatUtils.isStringEmpty(nickname_ingroup))
      {return nickname_ingroup;}
    else
      {return nickName;}
  }

  /**
   * 指定id是否是“世界频道”（或者说是bbs聊天）。
   *
   * 注：世界频道功能目前仅在APP版产品中存在，且未来可能将删除，web版产品中暂不打算实现之。
   *
   * @param gid 群id
   * @return true表示是世界频道，否则不是
   */
  isWorldChat(gid) {
    return this.DEFAULT_GROUP_ID_FOR_BBS == gid;
  }

}
