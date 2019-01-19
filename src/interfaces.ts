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

export interface IGyreOptions {
  workerScriptPath: string;
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
