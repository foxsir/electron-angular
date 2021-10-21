// import MBCore from "./mb_core";
// import MBAutoReLoginDaemon from "./mb_daemon_auto_relogin";
// import MBKeepAliveDaemon from "./mb_daemon_keep_alive";
// import MBQoS4ReciveDaemon from "./mb_daemon_qos_recieve";
// import MBQoS4SendDaemon from "./mb_daemon_qos_send";
// import MBDataReciever from "./mb_data_reciever";
// import MBDataSender from "./mb_data_sender";
// import MBSocketProvider from "./mb_socket_provider";
// import MBHashMap from "./MBHashMap";
// import MBProtocalFactory from "./MBProtocalFactory";

import MBCore from "@app/client/mb_core";

export default class InstanceFactory {
  private static classMap = new Map();
  static getInstance<T>(classRef: { new(): T }): T {
    if(InstanceFactory.classMap.get(classRef.name)) {
      return InstanceFactory.classMap.get(classRef.name);
    } else {
      InstanceFactory.classMap.set(classRef.name, new classRef());
      return InstanceFactory.classMap.get(classRef.name);
    }
  }
}
