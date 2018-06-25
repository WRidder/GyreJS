export interface IGyreCommand {
    id: string;
    data: any;
}
export interface IGyreEvent {
    id: string;
    data: any;
}
export interface ICommandHandler {
    (cmd: IGyreCommand, issue: (evt: IGyreCommand) => void, trigger: (evt: IGyreEvent) => void, getProjectionState: (id: string) => any): void;
}
export interface IGyreOptions {
    useMultithreading?: boolean;
}
export interface IListenerOptions {
    id?: string;
    priority?: number;
}
export interface IReducer {
    /**
     * Is a reducer function
     *
     * @param state The current state of the projection.
     * @param event The event to apply.
     * @return Returns the new state if it has been changed.
     */
    (state: object, event: IGyreEvent): any | undefined;
}
