import { IGyreCommand, IGyreEvent, IGyreOptions } from './interfaces';
import { Scheduler } from './scheduler';
export declare class Gyre {
    scheduler: Scheduler;
    constructor();
    start(opts?: IGyreOptions): void;
    trigger(evt: IGyreEvent): void;
    issue(cmd: IGyreCommand): void;
    private startWorkers();
}
