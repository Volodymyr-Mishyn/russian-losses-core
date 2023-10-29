export interface ProcessHandler {
  handle(result: unknown): Promise<unknown>;
}
