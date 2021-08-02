/*
 * Copyright (C) 2021  即时通讯网(52im.net) & Jack Jiang.
 * The MobileIMSDK_H5（MobileIMSDK的标准HTML5版客户端） Project. All rights reserved.
 *
 * 【本产品为著作权产品，请在授权范围内放心使用，禁止外传！】
 *
 * 【本系列产品在国家版权局的著作权登记信息如下】：
 * 1）国家版权局登记名（简称）和证书号：RainbowChat（软著登字第1220494号）
 * 2）国家版权局登记名（简称）和证书号：RainbowChat-Web（软著登字第3743440号）
 * 3）国家版权局登记名（简称）和证书号：RainbowAV（软著登字第2262004号）
 * 4）国家版权局登记名（简称）和证书号：MobileIMSDK-Web（软著登字第2262073号）
 * 5）国家版权局登记名（简称）和证书号：MobileIMSDK（软著登字第1220581号）
 * 著作权所有人：江顺/苏州网际时代信息科技有限公司
 *
 * 【违法或违规使用投诉和举报方式】：
 * 联系邮件：jack.jiang@52im.net
 * 联系微信：hellojackjiang
 * 联系QQ：413980957
 * 官方社区：http://www.52im.net
 */

import MBCore from "./mb_core";
import MBUtils from "./mb_utils";
import MBDataReciever from "./mb_data_reciever";
import MBKeepAliveDaemon from "./mb_daemon_keep_alive";
import InstanceFactory from "@app/client/InstanceFactory";
import MBDataSender from "@app/client/mb_data_sender";

/**
 * 本地 WebSocket 实例封装实用类。
 *
 * 本类提供存取本地WebSocket通信对象引用的方便方法，封装了WebSocket有效性判断以及异常处理等，以便确
 * 保调用者通过方法 {@link #getLocalSocket()}拿到的Socket对象是健康有效的。
 *
 * 依据作者对MobileIMSDK API的设计理念，本类将以单例的形式提供给调用者使用。
 *
 * @author Jack Jiang(http://www.52im.net/thread-2792-1-1.html)
 */
export default class MBSocketProvider {

  readonly TAG = "MBSocketProvider";

  private mbCore: MBCore;
  private mbDataReciever: MBDataReciever;
  private mbKeepAliveDaemon: MBKeepAliveDaemon;
  private _websocketUrl = null;


  /* 本地WebSocket对象引用 */
  localSocket = null;

  /*
   * 连接完成后将被通知的观察者。如果设置本参数，则将在连接完成后调用1次，调用完成后置null。
   * <p>
   * 设置本观察者的目的，是因为WebSocket连接的过程是异常完成，有时希望在连接完成时就能立即执行想
   * 要的逻辑，那么设置本观察者即可（在某次连接最终完成前，本参数的设置都会覆盖之前的设置，因为
   * 只有这一个观察者可以用哦）。
   */
  connectionDoneCallback = null;

  initDependent() {
    if (!this.mbCore || !this.mbDataReciever || !this.mbKeepAliveDaemon) {
      this.mbCore = InstanceFactory.getInstance(MBCore);
      this.mbDataReciever = InstanceFactory.getInstance(MBDataReciever);
      this.mbKeepAliveDaemon = InstanceFactory.getInstance(MBKeepAliveDaemon);
    }
  }

  /**
   * 设置连接完成后将被通知的回调函数。如果设置本参数，则将在连接完成后调用1次，调用完成后置null。
   * <p>
   * 设置本回调函数的目的，是因为WebSocket连接的过程是异常完成，有时希望在连接完成时就能立即执行想
   * 要的逻辑，那么设置本观察者即可（在某次连接最终完成前，本参数的设置都会覆盖之前的设置，因为
   * 只有这一个观察者可以用哦）。
   *
   * @param connectionDoneCallback 回调函数
   */
  setConnectionDoneCallback(connectionDoneCallback) {
    this.connectionDoneCallback = connectionDoneCallback;
  }

  /**
   * 重置并新建一个全新的WebSocket对象。
   *
   * @return 新建的全新Socket对象引用
   */
  resetLocalSocket() {
    try {
      // 无条件关闭socket（如果它还存在的话）
      this.closeLocalSocket();
      // 连接服务器
      this.tryConnectToHost();

      return this.localSocket;
    } catch (e) {
      MBUtils.mblog_w(this.TAG, "重置localSocket时出错，原因是：" + e);

      // 无条件关闭socket（如果它还存在的话）
      this.closeLocalSocket();

      return null;
    }
  }

  /**
   * 尝试发起连接并获取WebSocket。
   *
   * @return boolean
   */
  tryConnectToHost() {
    this.initDependent();

    if (this.mbCore.debugEnabled()){
      MBUtils.mblog_d(this.TAG, "tryConnectToHost并获取connection开始了...");
    }

    let done = false;
    const that = this;

    // 标准HTML5的WebSocket API文档请见：
    // https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket
    try {
      if (!window.WebSocket) {
        window.WebSocket = window['MozWebSocket'];
      }

      if (window.WebSocket) {
        this.localSocket = new WebSocket(this.mbCore.getWebsocketUrl());// "ws://192.168.99.190:7080/websocket"

        //## WebSocket的HTML5标准API连接建立时的回调处理
        this.localSocket.onopen = (event) => {
          if (this.mbCore.debugEnabled()) {
            MBUtils.mblog_d(this.TAG, "WS.onopen - 连接已成功建立！(isLocalSocketReady=" + that.isLocalSocketReady() + ")");
          }

          // 连接结果回调通知
          if (that.connectionDoneCallback) {
            that.connectionDoneCallback(true);

            // 调用完成马上置空，确保本观察者只被调用一次
            that.connectionDoneCallback = null;
          }
        }

        //## WebSocket的HTML5标准API连接关闭时的回调处理
        this.localSocket.onclose = (evt) => {
          if (this.mbCore.debugEnabled()) {
            MBUtils.mblog_d(this.TAG, "WS.onclose - 连接已断开。。。。(isLocalSocketReady=" + that.isLocalSocketReady()
              + ", MBClientCoreSDK.connectedToServer=" + this.mbCore.isConnectedToServer() + ")", evt);
          }

          // 用于快速响应连接断开事件，第一时间反馈给上层，提升用户体验
          if (this.mbCore.isConnectedToServer()) {
            if (this.mbCore.debugEnabled)
              {MBUtils.mblog_d(this.TAG, "WS.onclose - 连接已断开，立即提前进入框架的“通信通道”断开处理逻辑(而不是等心跳线程探测到，那就已经比较迟了)......");}

            // 进入框架的“通信通道”断开处理逻辑（即断开回调通知）
            this.mbKeepAliveDaemon.notifyConnectionLost();
          }
        }

        //## WebSocket的HTML5标准API发生错误时的回调处理
        this.localSocket.onerror = (evt) => {
          // if(MBClientCoreSDK.debugEnabled())
          MBUtils.mblog_e(this.TAG, "WS.onerror - 异常被触发了，原因是：", evt);

          if (that.localSocket)
            {that.localSocket.close();}
        }

        //## WebSocket的HTML5标准API收到数据时的回调处理
        this.localSocket.onmessage = (event) => {
          const protocalJsonStr = (event ? (event.data ? event.data : null) : null);

          if (this.mbCore.debugEnabled())
            {MBUtils.mblog_d(this.TAG, "WS.onmessage - 收到消息(原始内容)：" + protocalJsonStr);}

          // 读取收到的数据 Protocal 对象
          const pFromServer = (protocalJsonStr ? JSON.parse(protocalJsonStr) : null);

          // 进入消息调度和处理逻辑
          this.mbDataReciever.handleProtocal(pFromServer);
        }

        done = true;
      } else {
        MBUtils.mblog_w(this.TAG, "Your browser does not support Web Socket.");
      }
    } catch (e) {
      MBUtils.mblog_w(this.TAG, "连接Server(" + this._websocketUrl + ")失败：", e);
    }

    return done;
  }

  /**
   * 本类中的WebSocket对象是否是健康的。
   *
   * @return true表示是健康的，否则不是
   */
  isLocalSocketReady() {
    // 有关WebSocket的readyState状态说明，请见：
    // https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/readyState
    return this.localSocket != null && this.localSocket.readyState === 1;
  }

  /**
   * 获得本地WebSocket的实例引用.
   * <p>
   * 本方法内封装了WebSocket有效性判断以及异常处理等，以便确保调用者通过本方法拿到的WebSocket对象是健康有效的。
   *
   * @return 如果该实例正常则返回它的引用，否则返回null
   * @see #isLocalSocketReady()
   * @see #resetLocalSocket()
   */
  getLocalSocket() {
    if (this.isLocalSocketReady()) {
      // // TODO: 注释掉log！
      // if(this.mbCore.debugEnabled())
      //     MBUtils.mblog_d(this.TAG, "isLocalSocketReady()==true，直接返回本地socket引用哦。");
      return this.localSocket;
    } else {
      // // TODO: 注释掉log！
      // if(this.mbCore.debugEnabled())
      //     MBUtils.mblog_d(this.TAG, "isLocalSocketReady()==false，需要先resetLocalSocket()...");
      return this.resetLocalSocket();
    }
  }

  /**
   * 强制关闭本地WebSocket。
   * 一旦调用本方法后，再次调用{@link #getLocalSocket()}将会返回一个全新的WebSocket对象引用。
   *
   * 本方法通常在两个场景下被调用：
   * 1) 真正需要关闭WebSocket时（如所在的浏览器退出时）；
   * 2) 当调用者检测到网络发生变动后希望重置以便获得健康的WebSocket引用对象时。
   */
  closeLocalSocket() {
    this.initDependent();

    if (this.mbCore.debugEnabled())
      {MBUtils.mblog_d(this.TAG, "正在closeLocalSocket()...");}

    if (this.localSocket) {
      try {
        // 关闭socket
        this.localSocket.close();
        this.localSocket = null;
      } catch (e) {
        MBUtils.mblog_w(this.TAG, "在closeLocalSocket方法中试图释放localSocket资源时：", e);
      }
    } else {
      MBUtils.mblog_d(this.TAG, "Socket处于未初化状态（可能是您还未登陆），无需关闭。");
    }
  }
}
