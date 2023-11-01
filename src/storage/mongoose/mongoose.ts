import config from 'config';
import mongoose from 'mongoose';

interface DataBaseConfig {
  DataBase: string;
  Host: string;
  Port: number;
  Protocol: string;
}

export async function connectDataBase() {
  const databaseConfig = config.get<DataBaseConfig>('DataBaseConfig');
  const { DataBase, Host, Port, Protocol } = databaseConfig;
  const MONGODB_URI = `${Protocol}://${Host}:${Port}/${DataBase}`;
  try {
    await mongoose.connect(MONGODB_URI, {
      autoCreate: true,
      autoIndex: true,
    });
  } catch (e) {
    console.log(e);
  }
}

export async function disconnectDataBase() {
  await mongoose.connection.close();
}
