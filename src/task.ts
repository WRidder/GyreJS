import { Projection } from './projection';
import { IGyreEvent } from './event';

export class Task extends Projection{
  constructor(state: object = {}, reducer: (state: object, event: IGyreEvent) => object | undefined) {
    super(state, reducer);
  }
}
