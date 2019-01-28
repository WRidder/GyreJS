export interface IGyreCommand {
  id: string;
  data: any;
}

export interface IGyreEvent {
  id: string;
  data: any;
}

export interface ICommandHandler {
  (
    cmd: IGyreCommand,
    issue: (evt: IGyreCommand) => void,
    trigger: (evt: IGyreEvent) => void,
    getProjectionState: (id: string) => any,
  ): void;
}

export interface IIssue {
  (evt: IGyreEvent): void;
}

export interface ITrigger {
  (evt: IGyreCommand): void;
}

export interface IListener {
  (id: string, data: any, trigger: ITrigger, issue: IIssue): void;
}

export interface IListenerGenerator {
  (id: string, data: any, trigger: ITrigger, issue: IIssue): {
    next: Function;
  };
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
   * @param parentState State of parent projection
   * @return Returns the new state if it has been changed.
   */
  (state: any, event: IGyreEvent, parentState?: any): any | undefined;
}

export interface IECInterface {
  trigger: Function;
  issue: Function;
}

export interface IWorker {
  postMessage: (msg: IOutgoingWebWorkerMsg) => void;
  onmessage: (msg: IIncomingWebWorkerMsg) => void;
}

export enum WebWorkerMsgType {
  Command = 1,
  CommandList = 5,
  Event = 10,
  EventList = 15,
  ProjectionUpdates = 20,
  DevtoolCommand = 30,
}

export enum DevToolCommand {
  StartTracing = 5,
  StopTracing = 10,
}

export type ProjectionUpdateList = { [index: string]: any };
export type WebWorkerContentType =
  | DevToolCommand
  | IGyreEvent
  | IGyreEvent[]
  | IGyreCommand[]
  | IGyreCommand
  | ProjectionUpdateList;

export interface IOutgoingWebWorkerMsg {
  type: WebWorkerMsgType;
  contents: WebWorkerContentType;
}

export interface IIncomingWebWorkerMsg {
  data: IOutgoingWebWorkerMsg;
}

export function isGyreEvent(obj: WebWorkerContentType): obj is IGyreEvent {
  return (<IGyreEvent>obj).id !== undefined && (<IGyreEvent>obj).data !== undefined;
}

export function isGyreCommand(obj: WebWorkerContentType): obj is IGyreCommand {
  return (<IGyreCommand>obj).id !== undefined && (<IGyreCommand>obj).data !== undefined;
}

export function isProjectionUpdateList(obj: WebWorkerContentType): obj is ProjectionUpdateList {
  return typeof (<ProjectionUpdateList>obj) === 'object';
}
