import config from 'config';
import mongoose from 'mongoose';

interface DataBaseConfig {
  DataBase: string;
  Host: string;
  Port: number;
  Protocol: string;
}
const databaseConfig = config.get<DataBaseConfig>('DataBaseConfig');
const { DataBase, Host, Port, Protocol } = databaseConfig;

const MONGODB_URI = `${Protocol}://${Host}:${Port}/${DataBase}`;
mongoose
  .connect(MONGODB_URI, {
    autoCreate: true,
    autoIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default mongoose;
