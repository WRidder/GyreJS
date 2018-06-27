import { IListenerOptions } from './interfaces';
export declare class Scheduler {
    private readyQueue;
    private readyQueueIDlist;
    private timeBudget;
    private projectionData;
    private listeners;
    private listenerCount;
    constructor();
    register(pIds: string[], cb: (data: any, pId: string) => any, opts?: IListenerOptions): number;
    unregister(lsId: number, pIdsToUnsubscribe?: string[]): void;
    /**
     * Comment for method ´setTimeBudget´.
     * @param ms  Comment for parameter ´target´.
     */
    setTimeBudget(this: Scheduler, ms: number): void;
    /**
     * Comment for method ´getTimeBudget´.
     */
    getTimeBudget(this: Scheduler): number;
    projectionUpdate(id: string, data: object): void;
    /**
     * Iterates the ready queue
     */
    runOnce(): void;
    /**
     * Returns timestamp in milliseconds.
     */
    private static getCurrentTime();
    private getCallbackById(lsId);
    private addIListenerToQueue(lsId);
    private scheduleIListener(lsId, pId);
    private addItemToQueue(qItem, idx);
    private static createIDForIQueueItem(qItem);
}
