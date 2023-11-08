import config from 'config';
export interface ServerConfig {
  BaseURL: string;
  Port: string;
}
const databaseConfig = config.get<ServerConfig>('Server');

export class ConfigResolver {
  public static getBaseURL() {
    return databaseConfig.BaseURL;
  }
  public static getPort() {
    return databaseConfig.Port;
  }
}
