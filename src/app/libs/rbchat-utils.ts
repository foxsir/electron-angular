import {RBChatConfig} from "../config/rbchat-config";
import IMSDK from "@app/libs/mobileimsdk-client-sdk";
import CommonTools from "@app/common/common.tools";

/**
 * 实用工具类。
 *
 * 使用面向对向的方式调用实现方法，是为了规范代码的引用和调用，否则浏览器端引用的JS一多，
 * 各种交叉调用会让代码看起来异常混乱。
 *
 * @author Jack Jiang(http://www.52im.net/space-uid-1.html)
 * @version 1.0
 * @since 1.0
 */

export default class RBChatUtils {

  public static imSDK = new IMSDK();

  /** 用于存储登陆认证成功后服务端返回的本地用户完整信息到本地cookie，以便在意外关闭网页等情况下能恢复此用户数据 */
  public static COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID = 'aluiid';
  /** 存储登陆认证成功后服务端返回的本地用户完整信息的cookie过期时间 */
  public static COOKIE_KEY_AUTHED_LOCAL_USER_INFO_$EXPIRETIME = 2 * 24 * 60 * 60 * 1000;// 单位：毫秒，目前是保存2*24小时
  /** 用于存储“声音提醒开关”的配置信息到本地cookie，以便在意外关闭网页等情况下能恢复此用户数据 */
  public static COOKIE_KEY_MSG_TONE_ID = 'mtid';
  /** 存储“声音提醒开关”的配置信息的cookie过期时间 */
  public static COOKIE_KEY_MSG_TONE_$EXPIRETIME = 999 * 24 * 60 * 60 * 1000;// 单位：毫秒，目前是保存999*24小时

  /**
   * 设置文本组件获得焦点（并让光标显示在最后一个字符末尾）。
   *
   * 说明：因为使用jquery对象的.focus()方法在Mac的Safari这
   * 样的浏览器上，可以获得焦点但不能将光标移到末尾，所以干脆用本函数实现的这种通用方法，就不会出现浏览器兼容问题了。
   *
   * @param jqueryTextObj
   * @private
   */
  public static setTextFocus(jqueryTextObj) {
    if (jqueryTextObj) {
      const t = jqueryTextObj.val();
      jqueryTextObj.val("").focus().val(t);
    }
  }

  /**
   * 获得下载指定用户头像的完整http地址.
   * <p>
   * 形如：“http://192.168.88.138:8080/UserAvatarDownloadController?action=ad&user_uid=400007&enforceDawnload=1”。
   *
   * @param userUid 要下载头像的用户uid
   * @param dontUseCache true表示将在URL尾巴上加一个时间戳，从而实现浏览器显示时不缓存的作用
   * @return 完整的http文件下载地址
   */
  public static getUserAvatarDownloadURL(userUid, dontUseCache) {
    return RBChatConfig.AVATAR_DOWNLOAD_CONTROLLER_URL_ROOT + "?action=ad" + "&user_uid="
      + userUid + "&enforceDawnload=1&one_pixel_transparent_if_no=1"
      + (dontUseCache ? "&dontcache=" + RBChatUtils.getCurrentUTCTimestamp() : "");
  }

  /**
   * 获得下载指定群组头像的完整http地址.
   * <p>
   * 形如：“http://192.168.88.138:8080/BinaryDownloader?
   * action=gavartar_d&user_uid=400007&file_name=0000000152.jpg”。
   *
   * @param gid 要下载群头像的群id
   * @param dontUseCache true表示将在URL尾巴上加一个时间戳，从而实现浏览器显示时不缓存的作用
   * @return 完整的http文件下载地址
   */
  public static getGroupAvatarDownloadURL(gid, dontUseCache) {
    return RBChatConfig.BBONERAY_DOWNLOAD_CONTROLLER_URL_ROOT + "?action=gavartar_d"
      + "&file_name=" + gid + ".jpg&one_pixel_transparent_if_no=1"
      + (dontUseCache ? "&dontcache=" + RBChatUtils.getCurrentUTCTimestamp() : "");
  }

  /**
   * 获得下载指定图片消息的图片2进制数据的完整http地址.
   * <p>
   * 形如：“http://192.168.88.138:8080/BinaryDownloader?
   * action=image_d&user_uid=400007&file_name=91c3e0d81b2039caa9c9899668b249e8.jpg”。
   *
   * @param context
   * @param file_name 要下载的图片文件名
   * @param needDump 是否需要转储：true表示需要转储，否则不需要. 转储是用于图片消息接收方在打开了该图片消息完整图后
   * 通知服务端将此图进行转储（转储的可能性有2种：直接删除掉、移到其它存储位置），转储的目的是防止大量用户的大量图片
   * 被读过后还存储在服务器上，加大了服务器的存储压力。<b>注意：</b><u>读取缩略图时无需转储！</u>
   * @return 完整的http文件下载地址
   */
  public static getImageDownloadURL(file_name, needDump) {
    return RBChatConfig.BBONERAY_DOWNLOAD_CONTROLLER_URL_ROOT
      + "?action=image_d"
      // 要下载图片的本地用户uid（非必须参数）
      + "&user_uid=" + RBChatUtils.imSDK.getLoginInfo().loginUserId
      + "&file_name=" + file_name
      + "&need_dump=" + (needDump ? "1" : "0");
  }

  /**
   * 获得下载指定语音留言消息的声音2进制数据的完整http地址.
   * <p>
   * 形如：“http://192.168.88.138:8080/BinaryDownloader?
   * action=voice_mp3_d&user_uid=400007&file_name=1200_91c3e0d81b2039caa9c9899668b249e8.amr”。
   *
   * @param context
   * @param file_name 要下载的语音留言文件名
   * @param needDump 是否需要转储：true表示需要转储，否则不需要. 转储是用于语音留言消息接收方在打开了该语音留言消息后
   * 通知服务端将语音留言进行转储（转储的可能性有2种：直接删除掉、移到其它存储位置），转储的目的是防止大量用户的大量语音留言
   * 被读过后还存储在服务器上，加大了服务器的存储压力。
   * @return 完整的http文件下载地址
   */
  public static getVoiceDownloadURL(file_name, needDump) {
    const fileURL = RBChatConfig.BBONERAY_DOWNLOAD_CONTROLLER_URL_ROOT
      + "?action=voice_mp3_d"
      // 要下载文件的本地用户uid（非必须参数）
      + "&user_uid=" + RBChatUtils.imSDK.getLoginInfo().loginUserId
      + "&file_name=" + file_name
      + "&need_dump=" + (needDump ? "1" : "0");
    return fileURL;
  }

  /**
   * 获得大文件下载服务的完整http地址.
   * <p>
   * 形如：“http://192.168.1.195:8080/rainbowchat/BigFileDownloader?user_uid=400007
   * &file_md5=1aa7e1cc0405e3d5a52ae25d9eb6fbbb&skip_length=100”。
   *
   * @param context
   * @param fileMd5 要下载的文件md5码
   * @param file_name 要保存时的文件名
   * @return 完整的http文件下载地址
   */
  public static getBigFileDownloadURL(fileMd5, file_name) {
    const fileURL = RBChatConfig.BIG_FILE_DOWNLOADER_CONTROLLER_URL_ROOT
      + "?"
      // 要下载文件的本地用户uid（非必须参数）
      + "user_uid=" + RBChatUtils.imSDK.getLoginInfo().loginUserId
      + "&file_md5=" + fileMd5
      + "&file_name=" + file_name
      + "&skip_length=0";
    return fileURL;
  }

  /**
   * 获得短视频消息的视频文件下载服务的完整http地址.
   * <p>
   * 形如：“http://192.168.1.195:8080/rainbowchat/ShortVideoDownloader?user_uid=400007
   * &file_name=8990_dsjdsdsdjskdskdkj2232.mp4&file_md5=1aa7e1cc0405e3d5a52ae25d9eb6fbbb”。
   *
   * @param context
   * @param file_name 要下载的视频文件名
   * @param fileMd5 要下载的文件md5码
   * @return 完整的http文件下载地址
   */
  public static getShortVideoDownloadURL(file_name, fileMd5) {
    const fileURL = RBChatConfig.SHORTVIDEO_DOWNLOADER_CONTROLLER_URL_ROOT
      + "?"
      // 要下载文件的本地用户uid（非必须参数）
      + "user_uid=" + RBChatUtils.imSDK.getLoginInfo().loginUserId
      + "&file_name=" + file_name
      + "&file_md5=" + fileMd5;
    return fileURL;
  }

  /**
   * 获得短视频消息的视频首帧预览图片文件下载服务的完整http地址.
   * <p>
   * 形如：“http://192.168.1.195:8080/rainbowchat/ShortVideoDownloader?user_uid=400007
   * &file_name=1aa7e1cc0405e3d5a52ae25d9eb6fbbb.jpg&file_md5=1aa7e1cc0405e3d5a52ae25d9eb6fbbb”。
   *
   * @param thumbImageFileName 要下载的图片文件名
   * @param videofileMd5 要下载的视频文件md5码
   * @return 完整的http文件下载地址
   */
  public static getShortVideoThumbDownloadURL(thumbImageFileName, videofileMd5) {
    return RBChatConfig.SHORTVIDEO_THUMB_DOWNLOADER_CONTROLLER_URL_ROOT
      + "?"
      // 要下载文件的本地用户uid（非必须参数）
      + "user_uid=" + RBChatUtils.imSDK.getLoginInfo().loginUserId
      + "&thumb_image_file_name=" + thumbImageFileName
      + "&video_file_md5=" + videofileMd5
      + "&default_thumb_if_no=1";
  }

  /**
   * 获得消息聊天中“位置”消息的预览图（用于聊天气泡中）。
   *
   * 见高德地图官方文档：http://lbs.amap.com/api/webservice/guide/api/staticmaps
   *
   * @param longitude 经度（double值，形如：120.646825）
   * @param latitude 纬度（double值，形如：31.404756）
   * @retrun
   * 返回形如：
   * “https://restapi.amap.com/v3/staticmap?location=120.646825,31.404756&zoom=14&scale=2&size=283*100&key=4fb238d0544f80f40fb3cd057d268a5f”
   */
  public static getLocationPreviewImgDownloadURL(longitude, latitude) {
    return "https://restapi.amap.com/v3/staticmap?location=" + longitude + "," + latitude
      + "&zoom=14&scale=2&size=283*100&key=" + RBChatConfig.GAODE_MAP_WEB_STATIC_MAP_KEY;
  }

  /**
   * 获得下载指定个人照片的2进制数据的完整http地址.
   * <p>
   * 形如：“http://192.168.88.138:8080/BinaryDownloader?
   * action=photo_d&user_uid=400007&file_name=91c3e0d81b2039caa9c9899668b249e8.jpg”。
   *
   * @param file_name 要下载的照片文件名
   * @return 完整的http文件下载地址
   */
  public static getPhotoDownloadURL(file_name) {
    return RBChatConfig.BBONERAY_DOWNLOAD_CONTROLLER_URL_ROOT
      + "?action=photo_d"
      // 要下载图片的用户uid
      + "&user_uid=" + RBChatUtils.imSDK.getLoginInfo().loginUserId
      + "&file_name=" + file_name
      + "&one_pixel_black_if_no=1";
  }

  /**
   * 获得下载指定个人介绍语音留言文件的声音2进制数据的完整http地址.
   * <p>
   * 形如：“http://192.168.88.138:8080/BinaryDownloader?
   * action=pvoice_d&user_uid=400007&file_name=120_91c3e0d81b2039caa9c9899668b249e8.amr”。
   *
   * @param file_name 要下载的语音留言文件名
   */
  public static getPVoiceDownloadURL(file_name) {
    return RBChatConfig.BBONERAY_DOWNLOAD_CONTROLLER_URL_ROOT
      + "?action=pvoice_mp3_d"
      // 要下载语音文件的用户uid
      + "&user_uid=" + RBChatUtils.imSDK.getLoginInfo().loginUserId
      + "&file_name=" + file_name;
  }

  /**
   * 保存或清空本地用户的完整个人信息到cookie中。
   *
   * 说明：一个典型的IM系统的登陆，通常会分为2步：即1）通过http的sso单点接口认证身份并返回合
   *      法身份数据、2）将认证后的身份信息（主要是loginUserId和token）提交给IM服务器，再由
   *      IM服务器进行IM长连接的合法性检查，进而决定是否允许此次socket长连接的建立.
   *
   * @param userInfoObj 本参数为空则表示清除，否则表示保存，本对象对应于服务端Java
   * 类RosterElementEntity (http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro
   *                          /com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html)
   */
  public static saveAuthedLocalUserInfoToCookie(userInfoObj) {
    // 保存本地用户完整认证信息
    // if(userInfoObj) {
    //     const expireDateTime = new Date();
    //     expireDateTime.setTime(expireDateTime.getTime() + COOKIE_KEY_AUTHED_LOCAL_USER_INFO_$EXPIRETIME);
    //     // 保存至cookie
    //     $.cookie(COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID
    //         , JSON.stringify(userInfoObj), { expires: expireDateTime, path: '/' }); // 所有路径都能读取
    //
    //
    //
    // }
    // // 清除本地用户信息
    // else {
    //     $.removeCookie(COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID, { path: '/' });
    //     //location.reload();
    // }

    ////　debug
    //var localUerInfo = getAuthedLocalUserInfoFromCookie();
    //if(localUerInfo)
    //    RBChatUtils.logToConsole('>>>>>>>>>>>>>>>>>>>>>>>>>>> '+localUerInfo.whatSUp);


    //    1111为了适应electron 改造成sessionStorage
    if (userInfoObj) {

      const expireDateTime = new Date();
      expireDateTime.setTime(expireDateTime.getTime() + RBChatUtils.COOKIE_KEY_AUTHED_LOCAL_USER_INFO_$EXPIRETIME);
      // 保存至cookie

      sessionStorage.setItem(RBChatUtils.COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID, JSON.stringify(userInfoObj));


      //111 获取个人信息
      // UIxuMyMobule.getUserMsg(JSON.stringify(userInfoObj))

      // $.cookie(COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID
      //     , JSON.stringify(userInfoObj), { expires: expireDateTime, path: '/' }); // 所有路径都能读取
    }
    // 清除本地用户信息
    else {
      // $.removeCookie(COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID, { path: '/' });

      sessionStorage.removeItem(RBChatUtils.COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID);
      window.location.href = "/";

      //location.reload();
    }

  }

  /**
   * 获得cookie中保存的本地用户完整信息对象。
   *
   * 说明：一个典型的IM系统的登陆，通常会分为2步：即1）通过http的sso单点接口认证身份并返回合
   *      法身份数据、2）将认证后的身份信息（主要是loginUserId和token）提交给IM服务器，再由
   *      IM服务器进行IM长连接的合法性检查，进而决定是否允许此次socket长连接的建立.
   *
   * @returns 如果成功取出，则返回的是对应于服务端Java
   * 类RosterElementEntity对象 (http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro
   *                          /com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html)
   */
  public static getAuthedLocalUserInfoFromCookie() {
    // var localUserInfoJSONString = $.cookie(COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID);

    //1111为了适应electron 改造成sessionStorage
    const localUserInfoJSONString = sessionStorage.getItem(RBChatUtils.COOKIE_KEY_AUTHED_LOCAL_USER_INFO_ID);

    if (localUserInfoJSONString)
      {return JSON.parse(localUserInfoJSONString);}

    // 读取本地用户完整认证信息
    return null;
  }

  /**
   * 设置的应用全局“是否开启声音提醒”开关值。
   * 注意：本开关是全局开关，一旦关闭，所有声音提示都会无条件被关闭。
   *
   * @param msgToneOpen true表示开启，false表示关闭
   */
  public static setMsgToneOpenToCookie(msgToneOpen) {
    // 保存配置信息
    // var expireDateTime = new Date();
    // expireDateTime.setTime(expireDateTime.getTime() + COOKIE_KEY_MSG_TONE_$EXPIRETIME);
    // 保存至cookie
    // $.cookie(COOKIE_KEY_MSG_TONE_ID, msgToneOpen?'1':'0', { expires: expireDateTime, path: '/' }); // 所有路径都能读取
    //1111为了适应electron 改造成sessionStorage
    sessionStorage.setItem("COOKIE_KEY_MSG_TONE_ID", msgToneOpen ? '1' : '0');

  }

  /**
   * 用户最近设置的应用全局“是否开启声音提醒”开关值。
   * 注意：本开关是全局开关，一旦关闭，所有声音提示都会无条件被关闭。
   *
   * @return YES表示已开启，否则表示已关闭，未设置则默认返回true
   */
  public static isMsgToneOpenFromCookie() {
    // var toneString = $.cookie(COOKIE_KEY_MSG_TONE_ID);

    //1111为了适应electron 改造成sessionStorage
    const toneString = sessionStorage.getItem("COOKIE_KEY_MSG_TONE_ID");

    if (toneString)
      {return '1' === toneString;}

    // 读取本地用户完整认证信息
    return true;
  }

  /**
   * 去掉字符串左右的所有空格。
   *
   * @param s
   * @returns
   * @since 1.3
   */
  public static trim(s) {
    if (s)
      {return s.replace(/(^\s*)|(\s*$)/g, "");}
    else
      {return s;}
  }

  /**
   * 指定对象是否是String对象。
   *
   * 本方法主要用于JS对象转JSON字符串时，如果判定此对象就是String，那
   * 就不用转JSON字串了（因为它本身就是字串啊），不重复转就不会导致服务
   * 端解析出问题。
   *
   * @param obj
   * @returns true表示是字符串对象，否则不是
   */
  public static isString(obj) {
    return (typeof obj === 'string') && obj.constructor === String;
  }

  /**
   * 是否是空字符串。
   *
   * @param obj 此字符串对象可能是服务端通过json返回的null空字段转成的"null"字串，也可能是js里的其它“空”字串情况
   * @returns true表示是空字串，否则不空
   */
  public static isStringEmpty(obj) {
    return (obj === null || typeof (obj) === 'undefined' || obj === '' || obj === 'null');
  }

  public static stringIsEmail(str) {
    const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(str);
  }

  public static stringIsInt(str) {
    const reg = /^[0-9]*$/;
    return reg.test(str);
  }

  /**
   * 获取浏览器的名称和版本号信息（主要用于Log记录等非关键数据时）.
   *
   * @return 返回形如“chrome 70.0.3538.110”这样的字符串
   */
  getBrowserInfo() {
    return "chrome 91.0.4472.124";
  }

  /**
   * 返回浏览器的精确信息（主要用于兼容性判定等情况下）。
   *
   * 本函数复制自Layui工程，详见：https://github.com/sentsin/layui/blob/master/src/layui.js
   *
   * @param key
   * @return 返回形如：“{"os":"mac","ie":false,"weixin":false,"android":false,"ios":false}”
   * @since 1.5
   */
  public static device(key) {
    const agent = navigator.userAgent.toLowerCase();

    //获取版本号
    const getVersion = function(label) {
      return false;
    };

    //返回结果集
    const result = {
      os: function() { //底层操作系统
        const appVersion = navigator.appVersion.toLocaleLowerCase();
        if(appVersion.includes("mac")) {
          return "mac";
        } else if(appVersion.includes("linux")) {
          return "linux";
        } else {
          return "windows";
        }
      }(),
      ie: function() { //ie版本
        return false;
      }(),
      weixin: getVersion('micromessenger'),  //是否微信
      android: false,
      ios: false
    };

    //任意的key
    if (key && !result[key]) {
      result[key] = getVersion(key);
    }

    //移动设备
    result.android = /android/.test(agent);
    result.ios = result.os === 'ios';

    return result;
  }

  /**
   * 播放一段音频。
   *
   * 本函数借鉴自layim，感谢原作者。
   *
   * @param audioUrl 音频文件url
   * @since 1.5
   */
  public static playAudio(audioUrl) {

    const device = RBChatUtils.device("");
    // IE 9以下还播个球球。。
    // if (device.ie && device.ie < 9) {return;} // 如果用在移动端，可以注释掉本行

    const audio = document.createElement("audio");
    audio.src = audioUrl;
    audio.play();
  }

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String。
   *
   *  月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   *  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)。
   *
   *  【示例】：
   *  common.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
   *  common.formatDate(new Date(), 'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
   *  common.formatDate(new Date(), 'hh:mm:ss.S')            ==> 08:09:04.423
   */
  public static formatDate(date, fmt) { //author: meizz
    const o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  /**
   * 将字符串解析成日期。
   *
   * 【示例】：
   * parseDate('2016-08-11'); // Thu Aug 11 2016 00:00:00 GMT+0800
   * parseDate('2016-08-11 13:28:43', 'yyyy-MM-dd HH:mm:ss') // Thu Aug 11 2016 13:28:43 GMT+0800
   *
   * @param str 输入的日期字符串，如'2014-09-13'
   * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
   * @returns 解析后的Date类型日期
   */
  parseDate(str, fmt) {
    fmt = fmt || 'yyyy-MM-dd';
    const obj = {y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0};
    fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function(m, $1, $2, $3, $4, idx, old) {
      str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function(_m, _$1) {
        obj[$3] = parseInt(_$1, 10);
        return '';
      });
      return '';
    });
    obj.M--; // 月份是从0开始的，所以要减去1
    const date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
    if (obj.S !== 0) {date.setMilliseconds(obj.S);} // 如果设置了毫秒
    return date;
  }

  /**
   * 用于显示log信息，方便调试。
   *
   * 【补充说明】：在当前的演示代码中，本函数将被MobileIMSDK-Web框架回调，请见RBChatUtils.imSDK.callback_log 回调函数的设置。
   * 【建议用途】: 开发者可在此回调中按照自已的意图打印MobileIMSDK-Web框架中的log，方便调试时使用。
   *
   * @param message 要显示的Log内容
   * @param toConsole true表示显示到浏览器的控制台，否则直接显示到网页前端
   */
  public static log(message, toConsole) {

    const logMsg = '☢ [' + RBChatUtils.formatDate(new Date(), 'MM/dd hh:mm:ss.S') + '] ' + message;
    if (toConsole) {
      console.info(logMsg);
    }
    //else {
    //    // 已登陆则将信息显示在聊天界面
    //    if(RBChatUtils.imSDK.isLogined()) {
    //        //添加系统消息
    //        const html = '';
    //        html += '<div class="msg-system">';
    //        html += logMsg;
    //        html += '</div>';
    //        const section = d.createElement('section');
    //        section.className = 'system J-mjrlinkWrap J-cutMsg';
    //        section.innerHTML = html;
    //        $messages.append(section);
    //        scrollToBottom();
    //    }
    //    // 未登陆时则将信息显示在登陆框下方的提示区
    //    else {
    //        showLoginHint(message);
    //    }
    //}
  }

  public static logToConsole(message) {
    RBChatUtils.logToConsole_INFO(message);
  }

  public static logToConsole_INFO(message) {
    RBChatUtils.log('[INFO] ' + message, true);
  }

  public static logToConsole_DEBUG(message) {
    RBChatUtils.log('[DEBUG] ' + message, true);
  }

  public static logToConsole_WARN(message) {
    RBChatUtils.log('[WARN] ' + message, true);
  }

  public static logToConsole_ERROR(message) {
    RBChatUtils.log('[ERROR] ' + message, true);
  }

  /**
   * 将时间戳转成时间字符串（用指定的时间日期格式）。
   *
   * @param timestamp 时间戳值，形如：1505814353000（共13位）
   * @param pattern 时间日期格式，形如“yyyy-MM-dd hh:mm”
   * @return 返回转换后的时间字符串
   * @author add by Jack Jiang 20171010
   */
  public static utcTimestampToStringWithPattern(timestamp, pattern) {
    if (timestamp) {
      const newDate = new Date();
      newDate.setTime(timestamp);
      return RBChatUtils.formatDate(newDate, pattern);
    }
  }

  /**
   * 将时间戳转成时间字符串。
   *
   * @param timestamp 时间戳值，形如：1505814353000（共13位）
   * @return 返回转换后的时间字符串，形如“2017-09-19 15:34”
   * @author add by Jack Jiang 20171010
   */
  public static utcTimestampToString(timestamp) {
    //if(timestamp){
    //    const newDate = new Date();
    //    newDate.setTime(timestamp);
    //    return formatDate(newDate, 'yyyy-MM-dd hh:mm');
    //}
    return RBChatUtils.utcTimestampToStringWithPattern(timestamp, 'yyyy-MM-dd hh:mm');
  }

  /**
   * 在JS中返回当前系统的时间戳。
   *
   * @returns 形如：1280977330748 的长整数
   * @private
   */
  public static getCurrentUTCTimestamp() {
    return CommonTools.getTimestamp();
  }

  /**
   * 仿照微信中的消息时间显示逻辑，将时间戳（单位：毫秒）转换为友好的显示格式.
   * 1）7天之内的日期显示逻辑是：今天、昨天(-1d)、前天(-2d)、星期？（只显示总计7天之内的星期数，即<=-4d）；
   * 2）7天之外（即>7天）的逻辑：直接显示完整日期时间。
   *
   * @param timestamp 时间戳（单位：毫秒），形如：1550789954260
   * @param mustIncludeTime true表示输出的格式里一定会包含“时间:分钟”
   * ，否则不包含（参考微信，不包含时分的情况，用于首页“消息”中显示时）
   * @return 输出格式形如：“刚刚”、“10:30”、“昨天 12:04”、“前天 20:51”、“星期二”、“2019/2/21 12:09”等形式
   * @since 1.1
   */
  public static getTimeStringAutoShort(timestamp, mustIncludeTime) {

    // 当前时间
    const currentDate = new Date();
    // 目标判断时间
    const srcDate = new Date(parseInt(timestamp, 10));

    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1);
    const currentDateD = currentDate.getDate();

    const srcYear = srcDate.getFullYear();
    const srcMonth = (srcDate.getMonth() + 1);
    const srcDateD = srcDate.getDate();

    let ret = "";

    // 要额外显示的时间分钟
    const timeExtraStr = (mustIncludeTime ? " " + RBChatUtils.formatDate(srcDate, "hh:mm") : "");

    // 当年
    if (currentYear === srcYear) {
      const currentTimestamp = currentDate.getTime();
      // 相差时间（单位：毫秒）
      const deltaTime = (currentTimestamp - timestamp);

      // 当天（月份和日期一致才是）
      if (currentMonth === srcMonth && currentDateD === srcDateD) {
        // 时间相差60秒以内
        if (deltaTime < 60 * 1000) {
          ret = "刚刚";
        // 否则当天其它时间段的，直接显示“时:分”的形式
        } else {
          ret = RBChatUtils.formatDate(srcDate, "hh:mm");
        }
      }
      // 当年 && 当天之外的时间（即昨天及以前的时间）
      else {
        // 昨天（以“现在”的时候为基准-1天）
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);

        // 前天（以“现在”的时候为基准-2天）
        const beforeYesterdayDate = new Date();
        beforeYesterdayDate.setDate(beforeYesterdayDate.getDate() - 2);

        // 用目标日期的“月”和“天”跟上方计算出来的“昨天”进行比较，是最为准确的（如果用时间戳差值
        // 的形式，是不准确的，比如：现在时刻是2019年02月22日1:00、而srcDate是2019年02月21日23:00，
        // 这两者间只相差2小时，直接用“deltaTime/(3600 * 1000)” > 24小时来判断是否昨天，就完全是扯蛋的逻辑了）
        if (srcMonth === (yesterdayDate.getMonth() + 1) && srcDateD === yesterdayDate.getDate())
          {ret = "昨天" + timeExtraStr;}// -1d
        // “前天”判断逻辑同上
        else if (srcMonth === (beforeYesterdayDate.getMonth() + 1) && srcDateD === beforeYesterdayDate.getDate())
          {ret = "前天" + timeExtraStr;}// -2d
        else {
          // 跟当前时间相差的小时数
          const deltaHour = (deltaTime / (3600 * 1000));

          // 如果小于或等 7*24小时就显示星期几
          if (deltaHour <= 7 * 24) {
            const weekday = new Array(7);
            weekday[0] = "星期日";
            weekday[1] = "星期一";
            weekday[2] = "星期二";
            weekday[3] = "星期三";
            weekday[4] = "星期四";
            weekday[5] = "星期五";
            weekday[6] = "星期六";

            // 取出当前是星期几
            const weedayDesc = weekday[srcDate.getDay()];
            ret = weedayDesc + timeExtraStr;
          }
          // 否则直接显示完整日期时间
          else
            {ret = RBChatUtils.formatDate(srcDate, "yyyy/M/d") + timeExtraStr;}
        }
      }
    }
    // 往年
    else {
      ret = RBChatUtils.formatDate(srcDate, "yyyy/M/d") + timeExtraStr;
    }

    return ret;
  }

  /**
   * 获得文件大小的人类可读字符串形式.
   *
   * @param size 原文件大小，单位是byte(如表示该文件的长度是10240000)
   * @param scale 小数点位数(达到TB级以后,小数点默认为2位)，保留一位小数本值填10、2位小数本值填100、以此类推
   * @return 10240000字节的文件大小返回的字符串就是"10.00M"
   */
  public static getConvenientFileSize(size, scale) {
    let ret = size + "字节";

    if (!scale)
      {scale = 1;} // 为1表示不保留小数

    let temp = size / 1024.0;
    if (temp >= 1) {
      ret = (Math.round(temp * scale) / scale) + "KB";
      temp = temp / 1024.0;
      if (temp >= 1) {
        ret = (Math.round(temp * scale) / scale) + "MB";
        temp = temp / 1024.0;
        if (temp >= 1) {
          ret = (Math.round(temp * scale) / scale) + "GB";
          temp = temp / 1024.0;
          if (temp >= 1) {
            ret = (Math.round(temp * scale) / scale) + "TB";
          }
        }
      }
    }

    return ret;
  }

  /**
   * 获取指定文件名的扩展名。
   *
   * @param fileName
   * @returns 如果成功取出则返回扩展名，否则返回null
   * @private
   */
  public static getFileExtName(fileName) {
    let extName = null;
    if (fileName) {
      const index = fileName.lastIndexOf(".");
      const suffix = fileName.substring(index + 1);

      if (suffix) {
        extName = suffix.toLocaleLowerCase();
      }
    }

    return extName;
  }

  /**
   * 返回指定语音文件名中包含的语音时长数据.
   * <p>
   * 注：此文件名指的是最终发送的和接收的语音文件名，而非临时文件名（临时文件名没有时长信息）.
   *
   * @param voiceFileName 形如：120000_ad3434fdsfsd432432fsdfs.amr的语音文件名，120000是语音时长（单位：毫秒）
   * @return 解析出的语音时长（单位：秒）
   */
  public static getDurationFromVoiceFileName(voiceFileName) {
    let duration = 0;
    if (voiceFileName && voiceFileName.indexOf("_") !== -1) {
      const durationInMillsecond = voiceFileName.substring(0, voiceFileName.indexOf("_"));

      if (durationInMillsecond) {
        // 返回的时长需要转换成秒（而非毫秒）
        duration = parseInt(String(durationInMillsecond / 1000), 10);
      }
    }
    return duration;
  }

  /**
   * 用途：js中字符串超长作固定长度加省略号（...）处理
   *
   * @param str 需要进行处理的字符串
   * @param maxLen 需要显示多少个字（当参数 surpportChinese=true时，本参数指明的长度中1个汉字占一个长度，否则占2个长度）
   * @param surpportChinese true表示汉字作不"1"个长度计算，否则汉字按“2”个字节长度计算
   * @returns
   * @private
   */
  public static beautySubstring(str, maxLen, surpportChinese) {
    if (surpportChinese) {
      const reg = /[\u4e00-\u9fa5]/g;    //专业匹配中文
      const slice = str.substring(0, maxLen);
      const chineseCharNum = (~~(slice.match(reg) && slice.match(reg).length));
      const realen = slice.length * 2 - chineseCharNum;
      return str.substr(0, realen) + (realen < str.length ? "..." : "");
    } else {
      return str.substr(0, maxLen) + (maxLen < str.length ? "..." : "");
    }
  }

  /**
   * 用途：用于首页“消息”列表的Item内容中，将开头为“[文件]”、“[位置]”、“[个人名片]”等“[xxxxx]”占位符形式的内容，
   * 替换为一个橙色的span，目的是为了ui上更美化、更好看一些，仅此而已。
   *
   * 用处：详见 rbchat_ui_module.js文件中的 UIModule4.prototype.insertItem()和 UIModule4.prototype.updateItemContent()函数中。
   *
   * @param contentToShow 原始的显示内容
   * @returns
   * @private
   */
  public static replacePlaceholderForAlarmsItemContent(contentToShow) {
    let contentToShowAfter = contentToShow;
    if (contentToShowAfter) {
      // 匹配占位符，占位符形如“[文件]”、“[位置]”等
      const regexp = /^\[[^\[|^\]]+\]/;
      const m = contentToShowAfter.match(regexp);
      if (m) {
        const m0 = m[0];
        contentToShowAfter = contentToShowAfter.replace(regexp, "<span class='msg-flag-orange'>" + m0 + "</span>");
      }
    }

    return contentToShowAfter;
  }

}
