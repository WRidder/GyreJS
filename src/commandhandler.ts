import { IGyreEvent } from './event';
import { IGyreCommand } from './command';

export interface ICommandHandler {
  (cmd: IGyreCommand, issue: (evt: IGyreCommand) => void, trigger: (evt: IGyreEvent) => void,
   getProjectionState: (id: string) => any): void;
}
