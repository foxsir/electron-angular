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

/**
 * ======================================================================
 * 【基本说明】：
 * JavaScript实现的类似于Java等语言里的hashmap，用于方便存取key、value形式的数据。
 * ======================================================================
 */
export default class MBHashMap {
  maxLength = Number.MAX_VALUE;
  container = new Map();

  put(objName, objValue){
    if(objName !== ""){
      for(const p in this.container){
        if(p === objName){
          this.container.set(objName, objValue);
          return ;
        }
      }
      this.container.set(objName, objValue);
    }
  }

  get(objName){
    try{
      if(this.container.get(objName)) {
        return this.container.get(objName);
      }
      return null;
    }catch(e) {
      return e;
    }
  }

  contains(objName){
    try{
      for(const p in this.container){
        if(p === objName) {
          return true;
        }
      }
      return false;
    }catch(e){
      return e;
    }
  }

  containsValue(objValue){
    try{
      for(const p in this.container){
        if(this.container.get(p) === objValue) {
          return true;
        }
      }
      return false;
    }catch(e){
      return e;
    }
  }

  remove(objName){
    try{
      if(this.container.get(objName)){
        this.container.delete(objName);
        return true;
      }
      return false;
    }
    catch(e){
      return e;
    }
  }

  //HashMap.prototype.pop = function(objName){
  //    try{
  //        var ov = this.container[objName];
  //        if(ov){
  //            delete this.container[objName];
  //            this.length -- ;
  //            return ov;
  //        }
  //        return null;
  //    }catch(e){
  //        return e;
  //    }
  //};

  removeAll(){
    try{
      this.clear();
    }catch(e){
      return e;
    }
  }

  clear(){
    try{
      this.container = new Map();
    }catch(e){
      return e;
    }
  }

  isEmpty(){
    return this.container.size === 0;
  }

  keySet(){
    return new Array(...this.container.keys());
  }

  size(){
    return this.container.size;
  }

  //HashMap.prototype.runIn = function(fun){
  //    try{
  //        if(!fun)
  //            throw new Error("[Error HashMap] : The paramer is null !");
  //        for(const p in this.container){
  //            var ov = this.container[p];
  //            fun(ov);
  //        }
  //    }catch(e){
  //        return e;
  //    }
  //};

  // 本方法仅用于debug时
  showAll(funValueToString: Function = null){
    if(this.container.size > 0) {
      console.log("[hashmap.js_showAll()] 正在输出HashMap内容(列表长度 %d) ------------------->"
        , this.container.size);
      // 遍历
      for (var key in this.container) {
        if(funValueToString){
          console.log("[hashmap.js_showAll()]       > key=%s, value=%s", key, funValueToString(this.container[key]));
        }
        else{
          console.log("[hashmap.js_showAll()]       > key=%s, value=%s", key, this.container[key]
          );
        }
      }
    }
    else {
      console.log("[hashmap.js_showAll()] 列表中长度为：%d !", this.container.size);
    }
  }

}
