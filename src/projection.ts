import {GyreEvent} from './event';

export class Projection {
  // Members
  private state: object;
  private readonly reducer: (state: object, event: GyreEvent) => object | undefined = (state, evt) => state;

  constructor(state: object = {}, reducer: (state: object, event: GyreEvent) => object | undefined) {
    this.state = state;
    this.reducer = reducer;
  }

  /**
   * Apply events on this projection. If the state has been altered, return true.
   * @param {GyreEvent} evt
   * @returns {boolean}
   */
  applyEvent(evt: GyreEvent): boolean {
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
