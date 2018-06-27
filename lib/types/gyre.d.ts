import { IGyreCommand, IGyreEvent, IGyreOptions, IListenerOptions, IListener } from './interfaces';
export declare class Gyre {
    private scheduler;
    private bWorker;
    constructor(opts: IGyreOptions);
    trigger({id, data}: IGyreEvent): void;
    issue({id, data}: IGyreCommand): void;
    register(projectionId: string | string[], cb: IListener, opts?: IListenerOptions): void;
    unregister(lsId: number, projectionId?: string[] | string): void;
    private startWorker(path);
    private projectionUpdate(msg);
    private static checkIfValidProjectionId(projectionId);
}
