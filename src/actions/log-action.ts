import { Action } from '../_models/action';

export class LogAction implements Action {
  private _attempt = 0;
  public execute(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this._attempt > 3) {
        this._attempt = 0;
        console.log('error');
        resolve(false);
      } else {
        console.log(new Date());
        resolve(true);
      }
      this._attempt++;
    });
  }
}
