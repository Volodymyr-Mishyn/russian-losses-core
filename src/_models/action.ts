export interface ActionExecutionResult {
  status: boolean;
  error?: string;
}
export interface Action {
  execute: () => Promise<ActionExecutionResult>;
}
