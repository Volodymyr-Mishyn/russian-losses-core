import config from 'config';
require('dotenv').config();
import mongoose from 'mongoose';
import { Logger } from '../../_helpers/logger';

interface DataBaseConfig {
  DataBase: string;
  Host: string;
  Port: number;
  Protocol: string;
}

export class MongooseConnector {
  private static _instance: MongooseConnector | null = null;
  private _delayedDisconnectTime = 300000;
  private _disconnectTimeout: NodeJS.Timeout | null = null;
  private _connectionEstablished = false;
  private connectingPromise: Promise<void> | null = null;
  private constructor() {}

  public static getInstance() {
    if (!MongooseConnector._instance) {
      MongooseConnector._instance = new MongooseConnector();
    }
    return MongooseConnector._instance;
  }

  get connectionEstablished(): boolean {
    return this._connectionEstablished;
  }
  private set connectionEstablished(connectionEstablished: boolean) {
    this._connectionEstablished = connectionEstablished;
  }

  private async _connect(): Promise<void> {
    const databaseConfig = config.get<DataBaseConfig>('DataBase.Config');
    const { DataBase, Host, Port, Protocol } = databaseConfig;
    const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : `${Protocol}://${Host}:${Port}/${DataBase}`;
    Logger.log(`Mongoose: attempting connection to MongoDB`, '\x1b[32m');
    try {
      await mongoose.connect(MONGODB_URI, {
        autoCreate: true,
        autoIndex: true,
      });
      this.connectionEstablished = true;
      Logger.log(`Mongoose: Database connection established`, '\x1b[32m');
    } catch (e) {
      Logger.log(`Mongoose (ERROR): ${(e as any).message}`, '\x1b[32m');
    } finally {
      this.connectingPromise = null;
    }
  }

  public async connectDataBase(): Promise<void> {
    Logger.log(
      `Mongoose: starting connection to MongoDB (connectDataBase method); connectionEstablished=${this.connectionEstablished}`,
      '\x1b[32m',
    );
    if (this.connectionEstablished) {
      return;
    }
    if (!this.connectingPromise) {
      this.connectingPromise = this._connect();
    }
    await this.connectingPromise;
  }

  public async disconnectDataBase(): Promise<void> {
    if (!this.connectionEstablished) {
      return;
    }
    await mongoose.connection.close();
    this.connectionEstablished = false;
    Logger.log(`Mongoose: Database disconnected`, '\x1b[32m');
  }

  public scheduleDisconnect(disconnectTime: number = this._delayedDisconnectTime) {
    if (this._disconnectTimeout) {
      clearTimeout(this._disconnectTimeout);
    }
    this._disconnectTimeout = setTimeout(() => {
      this.disconnectDataBase();
    }, disconnectTime);
    Logger.log(`Mongoose: Database disconnection scheduled in ${disconnectTime / 1000}seconds`, '\x1b[32m');
  }
}
