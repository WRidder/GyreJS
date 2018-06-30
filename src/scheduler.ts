import { IListenerOptions, IListener, IListenerGenerator } from './interfaces';

interface IListenerItem {
  id: string;
  pIds: string[];
  priority: number;
  cb: (data: any, pId: string) => any;
}

interface IQueueItem {
  pId: string;
  priority: number;
  lsId: number;
  genFn?: Iterator<void>;
}

export class Scheduler {
  private readyQueue: IQueueItem[] = [];
  private readyQueueIDlist: Set<string> = new Set();
  private timeBudget: number = 10;
  private projectionData: Map<string, object> = new Map();
  private listeners: Map<number, IListenerItem> = new Map();
  private listenerCount = 1;

  constructor() {}

  register(pIds: string[], cb: (data: any, pId: string) => any,
           opts: IListenerOptions = { priority: 0, id: 'unnamed' }) {
    const lsId = this.listenerCount;
    this.listeners.set(this.listenerCount, {
      cb,
      pIds,
      id: opts.id,
      priority: opts.priority,
    });

    this.addIListenerToQueue(lsId);
    this.listenerCount += 1;

    return lsId;
  }

  unregister(lsId: number, pIdsToUnsubscribe: string[] = []) {
    if (this.listeners.has(lsId)) {
      const listener: IListenerItem = this.listeners.get(lsId);

      // If all projectionIds of the current listener are to un-subscribed, remove completely
      const remainingPIds = listener.pIds.filter(x => !(pIdsToUnsubscribe.indexOf(x) > -1));
      if (remainingPIds.length === 0) {
        this.listeners.delete(lsId);
      }

      // Remove from readyQueue
      let i = this.readyQueue.length;
      while (i) {
        if (pIdsToUnsubscribe.indexOf(this.readyQueue[i - 1].pId) > -1) {
          this.readyQueueIDlist.delete(Scheduler.createIDForIQueueItem(this.readyQueue[i - 1]));
          this.readyQueue.splice(i,1);
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
      if (listener.pIds.indexOf(id) > -1) {
        this.scheduleIListener(lsId, id);
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
      !ranOnce) && this.readyQueue.length > 0) {

      // Get work item
      const item = this.readyQueue.pop();
      const rdqId = Scheduler.createIDForIQueueItem(item);
      this.readyQueueIDlist.delete(rdqId);
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
          const listener = this.listeners.get(item.lsId);
          console.error(
            `[GyreJS] Error during invocation of listener (id: ${listener.id}) for projection '${item.pId}': `,
            e);
        }
        if (!ret.done) {
          this.readyQueue.push(item);
          this.readyQueueIDlist.add(rdqId);
        }
        continue;
      }

      // Invoke callback
      let res;
      try {
        res = cb(this.projectionData.get(item.pId), item.pId);
      } catch (e) {
        const listener = this.listeners.get(item.lsId);
        console.error(
          `[GyreJS] Error during invocation of listener (id: ${listener.id}) for projection '${item.pId}': `,
          e);
      }

      // Check if it is a generator function
      // @ts-ignore
      if (res && res.next) {
        // @ts-ignore
        const ret = res.next();

        if (!ret.done) {
          // @ts-ignore
          item.genFn = res;
          this.readyQueue.push(item);
        }
      }
      ranOnce = true;
    }

    // Check if we ran out of budget. If so, increment priorities to prevent starvation.
    // However, priorities above 89 are fixed.
    if (this.readyQueue.length) {
      this.readyQueue.forEach((qItem) => {
        qItem.priority += qItem.priority < 89 ? 1 : 0;
      });
    }
  }

  /**
   * Returns timestamp in milliseconds.
   */
  private static getCurrentTime(): number {
    return Date.now();
  }

  private getCallbackById(lsId: number): (data: any, pId: string) => void  | GeneratorFunction | null {
    const listener = this.listeners.get(lsId);
    if (listener) {
      return listener.cb;
    }
    return null;
  }

  private addIListenerToQueue(lsId: number) {
    const listener = this.listeners.get(lsId);

    listener.pIds.forEach((pId) => {
      if (this.projectionData.has(pId)) {
        this.scheduleIListener(lsId, pId);
      }
    });
  }

  private scheduleIListener(lsId: number, pId: string) {
    const listener = this.listeners.get(lsId);

    if (listener) {
      const queueItem = {
        pId,
        lsId,
        priority: listener.priority,
      };

      // Check if not already in queue
      if (this.readyQueueIDlist.has(Scheduler.createIDForIQueueItem(queueItem))) {
        return;
      }

      let i = this.readyQueue.length;

      if (i === 0 || listener.priority > this.readyQueue[i - 1].priority) {
        this.addItemToQueue(queueItem, i);
      } else if (this.readyQueue[0].priority > listener.priority) {
        this.addItemToQueue(queueItem, 0);
      } else {
        do {
          i = i - 1;
          if (this.readyQueue[i].priority <= listener.priority) {
            this.addItemToQueue(queueItem, i + 1);
            break;
          }
        } while (i);
      }
    }
  }

  private addItemToQueue(qItem: IQueueItem, idx: number): void {
    if (idx === 0) {
      this.readyQueue.unshift(qItem);
    } else if (idx === this.readyQueue.length) {
      this.readyQueue.push(qItem);
    } else {
      this.readyQueue.splice(idx, 0, qItem);
    }
    this.readyQueueIDlist.add(Scheduler.createIDForIQueueItem(qItem));
  }

  private static createIDForIQueueItem(qItem: IQueueItem): string {
    return qItem.lsId + '-' + qItem.pId;
  }
}
