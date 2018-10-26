import { IGyreCommand, IGyreEvent, ICommandHandler } from './interfaces';
import { Projection } from './projection';
export declare class ECManager {
    private projections;
    private projectionDependencyList;
    private projectionTopLevelList;
    private timedEvents;
    private timedCommands;
    private cmdHandlers;
    private events;
    private commands;
    private changeList;
    constructor(interval?: number);
    addProjection(id: string, projection: Projection, parentProjection?: string): void;
    addCommandHandler(id: string, cmdHandler: ICommandHandler): void;
    execute(cmds: IGyreCommand[], evts: IGyreEvent[]): void;
    trigger(evt: IGyreEvent): void;
    issue(cmd: IGyreCommand): void;
    getChangeList(): {
        [index: string]: any;
    };
    setTimedEvent(interval: number): void;
    setTimedCommand(interval: number): void;
    private handleEvents();
    private handleEvent(evt);
    private applyEventIterative(evt, id, parentState?);
    private addToChangelist(id, state);
    private handleCommands();
    private handleCommand(cmd);
    private getProjectionState(id);
}
