import {
  DevToolCommand,
  IGyreCommand,
  IGyreEvent,
  IIncomingWebWorkerMsg,
  IListener,
  IListenerOptions,
  isProjectionUpdateList,
  IWorker,
  ProjectionUpdateList,
  WebWorkerMsgType,
} from '../common/interfaces';
import { Scheduler } from './scheduler';
import { checkIfValidProjectionId } from '../common/helpers';
/// #if TRACING
import { ttool } from '../instrumentation/ttool';
import { TraceType } from '../instrumentation/interfaces';
/// #endif

export class Gyre {
  private scheduler = new Scheduler();
  private evtList: IGyreEvent[] = [];
  private cmdList: IGyreCommand[] = [];

  constructor(worker: IWorker, timebudget: number = 10) {
    this.scheduler.setTimeBudget(timebudget);
    worker.onmessage = this.handleIncomingMessages.bind(this);
    let t: number;

    const loop = () => {
      /// #if TRACING
      t = ttool.traceStart(TraceType.SchedulerCycle);
      /// #endif

      this.scheduler.runOnce();

      /// #if TRACING
      ttool.traceEnd(t);
      /// #endif

      /// #if TRACING
      t = ttool.traceStart(TraceType.SendEventsToManager);
      /// #endif
      worker.postMessage({
        contents: this.evtList,
        type: WebWorkerMsgType.EventList,
      });
      this.evtList = [];
      /// #if TRACING
      ttool.traceEnd(t);
      /// #endif

      /// #if TRACING
      t = ttool.traceStart(TraceType.SendCommandsToManager);
      /// #endif
      worker.postMessage({
        contents: this.cmdList,
        type: WebWorkerMsgType.CommandList,
      });
      this.cmdList = [];
      /// #if TRACING
      ttool.traceEnd(t);
      /// #endif

      /// #if TRACING
      ttool.flush();
      /// #endif

      setTimeout(loop, 0);
    };
    setTimeout(loop, 0);
  }

  trigger(evt: IGyreEvent) {
    this.evtList.push(evt);
  }

  issue(cmd: IGyreCommand) {
    this.cmdList.push(cmd);
  }

  register(
    projectionId: string | string[],
    cb: IListener,
    opts: IListenerOptions = { priority: 0, id: 'unnamed' },
  ): number {
    const pIds = checkIfValidProjectionId(projectionId);

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
    return this.scheduler.register(pIds, ccb, opts);
  }

  unregister(lsId: number, projectionId?: string[] | string) {
    const pIds = checkIfValidProjectionId(projectionId);
    this.scheduler.unregister(lsId, pIds);
  }

  private handleIncomingMessages(msg: IIncomingWebWorkerMsg) {
    switch (msg.data.type) {
      case WebWorkerMsgType.ProjectionUpdates: {
        this.projectionUpdate(msg);
        break;
      }
      /// #if TRACING
      case WebWorkerMsgType.DevtoolCommand: {
        this.handleDevtoolCommand(msg);
      }
      /// #endif
    }
  }

  /// #if TRACING
  private handleDevtoolCommand({ data }: IIncomingWebWorkerMsg) {
    switch (data.contents) {
      case DevToolCommand.StartTracing: {
        ttool.enable();
        break;
      }
      case DevToolCommand.StopTracing: {
        ttool.disable();
        break;
      }
    }
  }
  /// #endif

  private projectionUpdate(msg: IIncomingWebWorkerMsg) {
    if (isProjectionUpdateList(msg.data.contents)) {
      const changeList: ProjectionUpdateList = msg.data.contents;

      // Loop updated projections
      Object.keys(changeList).forEach(id => {
        this.scheduler.projectionUpdate(id, changeList[id]);
      });
    }
  }
}
