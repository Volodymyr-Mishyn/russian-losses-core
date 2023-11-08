import { MongooseConnector } from './mongoose-connector';

export function EstablishedDatabaseConnection(disconnectConfig?: { disconnectTime?: number; instant?: boolean }) {
  return function (originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);
    return async function (this: any, ...args: any[]) {
      const connector = MongooseConnector.getInstance();
      await connector.connectDataBase();
      try {
        const result = await originalMethod.apply(this, args);
        if (disconnectConfig) {
          if (disconnectConfig.instant) {
            await connector.disconnectDataBase();
          } else {
            if (disconnectConfig.disconnectTime) {
              connector.scheduleDisconnect(disconnectConfig.disconnectTime);
            } else {
              connector.scheduleDisconnect();
            }
          }
        }
        return result;
      } catch (error) {
        console.error(`Error in call ${methodName} : ${(error as any).message}`);
      }
    };
  };
}
