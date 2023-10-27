import { Action, ActionExecutionResult } from '../_models/action';

export class LogAction implements Action {
  private _attempt = 0;
  public execute(): Promise<ActionExecutionResult> {
    return new Promise((resolve, reject) => {
      if (this._attempt > 3) {
        this._attempt = 0;
        console.log('error');
        resolve({ status: false });
      } else {
        console.log(new Date());
        resolve({ status: true });
      }
      this._attempt++;
    });
  }
}
