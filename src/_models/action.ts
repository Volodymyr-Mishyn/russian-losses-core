export interface Action {
  execute: () => Promise<boolean>;
}
