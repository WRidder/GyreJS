import { GyreEvent } from './event';
import { GyreCommand } from './command';

export interface ICommandHandler {
  (cmd: GyreCommand, issue: (evt: GyreCommand) => void, trigger: (evt: GyreEvent) => void,
   getProjectionState: (id: string) => any): void;
}
