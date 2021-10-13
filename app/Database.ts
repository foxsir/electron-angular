import 'reflect-metadata';
import {ipcMain} from 'electron';

import {BaseEntity, Connection, createConnection} from "typeorm";
import ModelMap from "./entitys/model-map";
const fs = require('fs')

interface QueryParams {
  model: string;
  query: Partial<BaseEntity>;
  orderBy: string[];
  uuid: string;
}

interface SaveParams {
  model: string;
  data: Partial<BaseEntity>;
  update?: Partial<BaseEntity>;
  uuid?: string;
}

interface DeleteParams {
  model: string;
  query: Partial<BaseEntity>;
  uuid?: string;
}

export default class Database {

  // 保存链接
  private connection: Connection = null;
  private database: string;

  constructor() {
  }

  createConnect(database: string): Promise<boolean> {
    return new Promise((resolve) => {
      if(this.connection !== null && this.connection.isConnected) {
        this.connection.close().then(() => {
          this.create(database).then((ok) => {
            resolve(ok);
          });
        });
      } else {
        this.create(database).then((ok) => {
          resolve(ok);
        });
      }
    });
  }

  create(database: string): Promise<boolean> {
    return new Promise((resolve) => {
      const models = [];
      ModelMap.forEach(m => {
        models.push(m);
      });
      this.database = database;
      createConnection({
        type: "sqlite",
        database: [__dirname, "databases", database].join("/"),
        entities: models,
        synchronize: true,
        logging: false
      }).then(async connection => {
        this.connection = connection;
        resolve(true);
      }).catch(error => {
        console.error(error);
        resolve(false);
      });
    });
  }

  async init() {
    this.onConnectionDB();
    this.onSendData();
    this.onQueryData();
    this.onDeleteData();
    this.onCloseDB();
  }

  onConnectionDB() {
    ipcMain.on('connectionDB', async (event, database: string) => {
      this.createConnect(database).then(ok => {
        event.sender.send('connectionDB-reply', ok);
      });
    });
  }

  onSendData() {
    ipcMain.on('sendData', async (event, msg: SaveParams) => {
      const name = ModelMap.get(msg.model);
      name.useConnection(this.connection);

      if (name) {
        let model = new name();
        if(msg.update) {
          await name.findOne(msg.update).then(find => {
            if(find) {
              model = find;
            }
          });
        }
        Object.assign(model, msg.data);
        await model.save().then((res) => {
          event.sender.send('sendData-reply', {status: 200, data: res, uuid: msg.uuid});
        });
      } else {
        event.sender.send('sendData-reply', {status: 500, error: "modelMap no have " + msg.model, uuid: msg.uuid});
      }
    })
  }

  onQueryData() {
    ipcMain.on('queryData', async (event, msg: QueryParams) => {
      const name = ModelMap.get(msg.model);
      name.useConnection(this.connection);
      if (name) {
        // await name.find(msg.query).then(find => {
        //   event.sender.send('queryData-reply', {status: 200, data: find, uuid: msg.uuid});
        // });

        const tableName = name.name.replace(/\B([A-Z])/g, '_$1').toLowerCase();

        const query = await this.connection
          .getRepository(name)
          .createQueryBuilder(tableName) // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
        if(msg.query) {
          let queryParams = [];
          Object.keys(msg.query).forEach(key => {
            queryParams.push([tableName, key].join(".") + " = :" + key);
          });
          await query.where(queryParams.join(" AND ")).setParameters(msg.query);
        }
        if(msg.orderBy) {
          await query.orderBy([tableName, msg.orderBy[0]].join("."), msg.orderBy[1] === "DESC" ? 'DESC' : 'ASC')
        }
        const data = await query.getMany();

        event.sender.send('queryData-reply', {status: 200, data: data, uuid: msg.uuid});
      } else {
        event.sender.send('queryData-reply', {status: 500, error: "query error " + msg.model, uuid: msg.uuid});
      }
    })
  }

  onDeleteData() {
    ipcMain.on('deleteData', async (event, msg: DeleteParams) => {
      const name = ModelMap.get(msg.model);
      name.useConnection(this.connection);
      if (name) {
        if(msg.query) {
          await name.delete(msg.query).then(del => {
            event.sender.send('deleteData-reply', {status: 200, data: del, uuid: msg.uuid});
          });
        } else {
          await name.clear().then(() => {
            event.sender.send('deleteData-reply', {status: 200, data: true, uuid: msg.uuid});
          });
        }
      } else {
        event.sender.send('deleteData-reply', {status: 500, error: "query error " + msg.model, uuid: msg.uuid});
      }
    });
  }

  onCloseDB() {
    ipcMain.on('closeDB', async (event, msg) => {
      if(this.connection) {
        await this.connection.close();
      }
    });
  }

}
