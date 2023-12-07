import config from 'config';
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
  private _delayedDisconnectTime = 120000;
  private _disconnectTimeout: NodeJS.Timeout | null = null;
  private _connectionEstablished = false;
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

  public async connectDataBase(): Promise<void> {
    if (this.connectionEstablished) {
      return;
    }
    this.connectionEstablished = true;
    const databaseConfig = config.get<DataBaseConfig>('DataBase.Config');
    const { DataBase, Host, Port, Protocol } = databaseConfig;
    const MONGODB_URI = `${Protocol}://${Host}:${Port}/${DataBase}`;
    try {
      await mongoose.connect(MONGODB_URI, {
        autoCreate: true,
        autoIndex: true,
      });
      Logger.log(`Mongoose: Database connection established`, '\x1b[32m');
    } catch (e) {
      Logger.log(`Mongoose (ERROR): ${(e as any).message}`, '\x1b[32m');
    }
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
