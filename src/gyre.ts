import { IGyreCommand, IGyreEvent, IGyreOptions, IECInterface, IListenerOptions, IListener } from './interfaces';
import { Scheduler } from './scheduler';

interface IProjectionMessage {
  id: string;
  data: any;
}

export class Gyre {
  private scheduler = new Scheduler();
  private bWorker: Worker;
  private evtList: IGyreEvent[] = [];
  private cmdList: IGyreCommand[] = [];

  constructor(ecworker: Worker) {
    this.startWorker(ecworker);

    setTimeout(
      (function tick() {
        // run scheduler
        this.scheduler.runOnce();

        // Post messages (trace this)
        // TODO: do we actually want to batch these messages? Introduces delay, but reduces comm overhead.
        this.bWorker.postMessage({
          data:  this.evtList,
          type: 'event',
        });
        this.evtList = [];

        this.bWorker.postMessage({
          data:  this.cmdtList,
          type: 'command',
        });
        this.cmdList = [];

        setTimeout(tick.bind(this), 0);
      }).bind(this),
      0);
  }

  trigger(evt: IGyreEvent) {
    this.evtList.push(evt);
  }

  issue(cmd: IGyreCommand) {
    this.cmdList.push(cmd);
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

  private startWorker(ecworker: Worker) {
    this.bWorker = ecworker;

    // Register callbacks
    this.bWorker.onmessage = this.projectionUpdate.bind(this);
  }

  private projectionUpdate(msg: any) {
    // Deserialize
    const changeList = msg.data;

    // Loop updated projections
    Object.keys(changeList).forEach((id, i) => {
      this.scheduler.projectionUpdate(id, changeList[id]);
    });

    // changeList.forEach(({ id, data }: IProjectionMessage) => {
    //  this.scheduler.projectionUpdate(id, data);
    // });
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
