import { IGyreEvent } from './event';

export interface IReducer {
  (state: object, event: IGyreEvent): any | undefined;
}

export class Projection {
  // Members
  private state: object;
  private readonly reducer: IReducer;

  constructor(state: object = {}, reducer: IReducer) {
    this.state = state;
    this.reducer = reducer;
  }

  /**
   * Apply events on this projection. If the state has been altered, return true.
   * @param {IGyreEvent} evt
   * @returns {boolean}
   */
  applyEvent(evt: IGyreEvent): boolean {
    const res = this.reducer(this.state, evt);
    if (res !== void 0) {
      this.state = res;
      return true;
    }
    return false;
  }

  getState() {
    return this.state;
  }
}
