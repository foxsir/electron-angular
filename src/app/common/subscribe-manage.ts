import {Subscription, Observable} from "rxjs";
import CommonTools from "@app/common/common.tools";

export default class SubscribeManage {
  private static subscriptionMap: Map<string, Subscription> = new Map();

  public static run(observable: Observable<any>, fn: (...args) => void) {
    const key = CommonTools.md5(fn.toString());
    if(SubscribeManage.subscriptionMap.get(key) !== undefined) {
      SubscribeManage.subscriptionMap.get(key).unsubscribe();
      SubscribeManage.subscriptionMap.delete(key);
    }
    const subscribe: Subscription = observable.subscribe(fn);
    SubscribeManage.subscriptionMap.set(key, subscribe);
  }

  public static unsubscriptionAll() {
    SubscribeManage.subscriptionMap.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
