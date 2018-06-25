import { IGyreCommand, IGyreEvent, ICommandHandler } from './interfaces';
import { Projection } from './projection';
export declare class ECManager {
    private projections;
    private cmdHandlers;
    private events;
    private commands;
    private changeList;
    constructor();
    addProjection(id: string, projection: Projection): void;
    addCommandHandler(id: string, cmdHandler: ICommandHandler): void;
    execute(cmds: IGyreCommand[], evts: IGyreEvent[]): void;
    trigger(evt: IGyreEvent): void;
    issue(cmd: IGyreCommand): void;
    getChangeList(): Map<string, any>;
    private handleEvents();
    private handleCommands();
    private getProjectionState(id);
}
