import config from 'config';
import mongoose from 'mongoose';

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
      console.log('\x1b[32m%s\x1b[0m', 'Database connection established');
    } catch (e) {
      console.log('\x1b[32m%s\x1b[0m', (e as any).message);
    }
  }

  public async disconnectDataBase(): Promise<void> {
    if (!this.connectionEstablished) {
      return;
    }
    await mongoose.connection.close();
    this.connectionEstablished = false;
    console.log('\x1b[32m%s\x1b[0m', 'Database disconnected');
  }

  public scheduleDisconnect(disconnectTime: number = this._delayedDisconnectTime) {
    if (this._disconnectTimeout) {
      clearTimeout(this._disconnectTimeout);
    }
    this._disconnectTimeout = setTimeout(() => {
      this.disconnectDataBase();
    }, disconnectTime);
    console.log('\x1b[32m%s\x1b[0m', `Database disconnection scheduled in ${disconnectTime / 1000}seconds`);
  }
}
