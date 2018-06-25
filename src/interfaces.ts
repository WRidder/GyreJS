export interface IGyreCommand {
  id: string;
  data: any;
}

export interface IGyreEvent {
  id: string;
  data: any;
}

export interface ICommandHandler {
  (cmd: IGyreCommand, issue: (evt: IGyreCommand) => void, trigger: (evt: IGyreEvent) => void,
   getProjectionState: (id: string) => any): void;
}

export interface IGyreOptions {
  useMultithreading?: boolean;
}

export interface IListenerOptions {
  id?: string;
  priority?: number;
}
