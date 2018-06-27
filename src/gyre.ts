import { IGyreCommand, IGyreEvent, IGyreOptions, IECInterface, IListenerOptions, IListener } from './interfaces';
import { Scheduler } from './scheduler';

interface IProjectionMessage {
  data: {
    id: string;
    data: any;
  };
}

export class Gyre {
  private scheduler = new Scheduler();
  private bWorker: Worker;

  constructor(opts: IGyreOptions) {
    this.startWorker(opts.workerScriptPath);
  }

  trigger({ id, data }: IGyreEvent) {
    this.bWorker.postMessage({
      id,
      data,
      type: 'event',
    });
  }

  issue({ id, data }: IGyreCommand) {
    this.bWorker.postMessage({
      id,
      data,
      type: 'command',
    });
  }

  register (projectionId: string | string[], cb: IListener,
            opts: IListenerOptions = { priority: 0, id: 'unnamed' }) {
    const pIds = Gyre.checkIfValidProjectionId(projectionId);

    if (typeof cb !== 'function') {
      throw '[GyreJS] Callback should be a function.';
    }
    if (opts.priority < 0 || opts.priority > 99) {
      throw '[GyreJS] IListener priority should be a number in range of [0,99].';
    }
    if (typeof opts.id !== 'string') {
      throw '[GyreJS] IListener id should be a string.';
    }

    // Curry the callback function
    const ccb = (data: any, pId: string) => {
      cb(data, pId, this.trigger.bind(this), this.issue.bind(this));
    };
    this.scheduler.register(pIds, ccb);
  }

  unregister (lsId: number, projectionId?: string[] | string) {
    const pIds = Gyre.checkIfValidProjectionId(projectionId);
    this.scheduler.unregister(lsId, pIds);
  }

  private startWorker(path: string) {
    this.bWorker = new Worker(path);

    // Register callbacks
    this.bWorker.onmessage = this.projectionUpdate.bind(this);
  }

  private projectionUpdate(msg: IProjectionMessage) {
    this.scheduler.projectionUpdate(msg.data.id, msg.data.data);
  }

  private static checkIfValidProjectionId(projectionId: string | string[]): string[] {
    // Input checking
    if (typeof projectionId !== 'string' && projectionId.constructor !== Array) {
      throw 'ProjectionId should be a(n array of) string(s) with non-zero length.';
    }
    if (typeof projectionId === 'string' && projectionId.length === 0) {
      throw 'ProjectionId should be a(n array of) string(s) with non-zero length.';
    }
    if (typeof projectionId !== 'string') {
      projectionId.forEach((pId) => {
        if (typeof pId !== 'string' || pId.length === 0) {
          throw 'ProjectionId should be a(n array of) string(s) with non-zero length.';
        }
      });
    }

    return (typeof projectionId === 'string') ? [projectionId] : projectionId;
  }
}
