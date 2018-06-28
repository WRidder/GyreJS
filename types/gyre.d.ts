import { IGyreCommand, IGyreEvent, IListenerOptions, IListener } from './interfaces';
export declare class Gyre {
    private scheduler;
    private bWorker;
    constructor(ecworker: Worker);
    trigger({id, data}: IGyreEvent): void;
    issue({id, data}: IGyreCommand): void;
    register(projectionId: string | string[], cb: IListener, opts?: IListenerOptions): void;
    unregister(lsId: number, projectionId?: string[] | string): void;
    private startWorker(ecworker);
    private projectionUpdate(msg);
    private static checkIfValidProjectionId(projectionId);
}
