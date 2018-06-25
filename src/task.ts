import { Projection } from './projection';
import { GyreEvent } from './event';

export class Task extends Projection{
  constructor(state: object = {}, reducer: (state: object, event: GyreEvent) => object | undefined) {
    super(state, reducer);
  }
}
