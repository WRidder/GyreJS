import { Projection } from '../datalayer/projection';
import { IGyreEvent } from '../common/interfaces';

export class Task extends Projection {
  constructor(state: object = {}, reducer: (state: object, event: IGyreEvent) => object | undefined) {
    super(state, reducer);
  }
}
