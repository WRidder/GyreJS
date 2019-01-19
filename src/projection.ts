import { IGyreEvent, IReducer } from './interfaces';

export class Projection {
  // Members
  protected state: object;
  protected readonly reducer: IReducer;

  constructor(state: object = {}, reducer: IReducer) {
    this.state = state;
    this.reducer = reducer;
  }

  /**
   * Apply events on this projection. If the state has been altered, return true.
   * @param {IGyreEvent} evt
   * @param {object} parentState
   * @returns {boolean}
   */
  applyEvent(evt: IGyreEvent, parentState: object = {}): boolean {
    const res = this.reducer(this.state, evt, parentState);
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
