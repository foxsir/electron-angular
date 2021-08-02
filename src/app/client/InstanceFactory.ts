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

export default class InstanceFactory {
  static getInstance<T>(classRef: {new(): T; }): T {
    return new classRef();
  }
}
