export interface ListenerOptions {
  id?: string;
  priority?: number;
}

interface Listener {
  id: string;
  pIds: string[];
  priority: number;
  cb: (data: any, pId: string) => any;
}

interface QueueItem {
  pId: string;
  priority: number;
  lsId: number;
  genFn?: Iterator<void>;
}

export class Scheduler {
  private readyQueueQueue: QueueItem[] = [];
  private timeBudget: number = 10;
  private projectionData: Map<string, object> = new Map();
  private listeners: Map<number, Listener> = new Map();
  private listenerCount = 1;

  constructor() {}

  register(projectionId: string | string[], cb: (data: any, pId: string) => any,
           opts: ListenerOptions = { priority: 0, id: 'unnamed' }) {
    const pIds = Scheduler.checkIfValidProjectionId(projectionId);

    if (typeof cb !== 'function') {
      throw 'Callback should be a function.';
    }

    const lsId = this.listenerCount;
    this.listeners.set(this.listenerCount, {
      pIds,
      cb,
      id: opts.id,
      priority: opts.priority,
    });

    this.addListenerToQueue(lsId);
    this.listenerCount = this.listenerCount + 1;

    return lsId;
  }

  unregister(lsId: number, projectionId?: string[] | string) {
    const pIdsToUnsubscribe: string[] = Scheduler.checkIfValidProjectionId(projectionId);

    if (this.listeners.has(lsId)) {
      const listener: Listener = this.listeners.get(lsId);

      // If all projectionIds of the current listener are to unsubscribed, remove completely
      const remainingPIds = listener.pIds.filter(x => !pIdsToUnsubscribe.includes(x));
      if (remainingPIds.length === 0) {
        this.listeners.delete(lsId);
      }

      // Remove from readyQueue
      let i = this.readyQueueQueue.length;
      while (i) {
        if (pIdsToUnsubscribe.includes(this.readyQueueQueue[i - 1].pId)) {
          this.readyQueueQueue.splice(i,1);
        }
        i -= 1;
      }
    }
  }

  /**
   * Comment for method ´setTimeBudget´.
   * @param ms  Comment for parameter ´target´.
   */
  setTimeBudget(this:Scheduler, ms: number): void {
    this.timeBudget = ms;
  }

  /**
   * Comment for method ´getTimeBudget´.
   */
  getTimeBudget(this:Scheduler): number {
    return this.timeBudget;
  }

  projectionUpdate(id: string, data: object) {
    this.projectionData.set(id, data);

    // Iterate over listeners
    this.listeners.forEach((listener, lsId) => {
      if (listener.pIds.includes(id)) {
        this.scheduleListener(lsId, id);
      }
    });
  }

  /**
   * Iterates the ready queue
   */
  runOnce() {
    const startTime = Scheduler.getCurrentTime();
    let ranOnce = false;

    while ((Scheduler.getCurrentTime() < (startTime + this.timeBudget) ||
      !ranOnce) && this.readyQueueQueue.length > 0) {

      // Get work item
      const item = this.readyQueueQueue.pop();
      const cb = this.getCallbackById(item.lsId);
      if (!cb) {
        continue;
      }

      // If the item has been called before and the callback is a generator, invoke the generator again.
      if (item.genFn) {
        let ret;
        try {
          ret = item.genFn.next();
        } catch (e) {
          console.error(`[GyreJS] Error invoking listener (id: ${item.lsId}) for projection ${item.pId}: `, e);
        }
        if (!ret.done) {
          this.readyQueueQueue.push(item);
        }
        continue;
      }

      // Invoke callback
      let res;
      try {
        res = cb(this.projectionData.get(item.pId), item.pId);
      } catch (e) {
        console.error(`[GyreJS] Error invoking listener (id: ${item.lsId}) for projection ${item.pId}: `, e);
      }

      // Check if it is a generator function
      if (res && res.next) {
        const ret = res.next();

        if (!ret.done) {
          item.genFn = res;
          this.readyQueueQueue.push(item);
        }
      }
      ranOnce = true;
    }

    // Check if we ran out of budget. If so, increment priorities to prevent starvation.
    if (this.readyQueueQueue.length) {
      this.readyQueueQueue.forEach((qItem) => {
        qItem.priority += 1;
      });
    }
  }

  /**
   * Returns timestamp in milliseconds.
   */
  private static getCurrentTime(): number {
    return Date.now();
  }

  private getCallbackById(lsId: number): Function | null {
    const listener = this.listeners.get(lsId);
    if (listener) {
      return listener.cb;
    }
    return null;
  }

  private addListenerToQueue(lsId: number) {
    const listener = this.listeners.get(lsId);

    listener.pIds.forEach((pId) => {
      if (this.projectionData.has(pId)) {
        this.scheduleListener(lsId, pId);
      }
    });
  }

  private scheduleListener(lsId: number, pId: string) {
    const listener = this.listeners.get(lsId);
    const queueItem = {
      pId,
      lsId,
      priority: listener.priority,
    };

    if (listener) {
      let i = this.readyQueueQueue.length;

      if (i === 0 || listener.priority > this.readyQueueQueue[i - 1].priority) {
        this.readyQueueQueue.push(queueItem);
      } else if (this.readyQueueQueue[0].priority > listener.priority) {
        this.readyQueueQueue.unshift(queueItem);
      } else {
        do {
          i = i - 1;
          if (this.readyQueueQueue[i].priority <= listener.priority) {
            this.readyQueueQueue.splice(i + 1, 0, queueItem);
            break;
          }
        } while (i);
      }
    }
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
