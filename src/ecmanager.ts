import { GyreCommand } from './command';
import { GyreEvent } from './event';
import { Projection } from './projection';
import { ICommandHandler } from './commandhandler';

export class ECManager {
  private projections: Map<string, Projection> = new Map();
  private cmdHandlers: Map<string, ICommandHandler> = new Map();
  private events: GyreEvent[] = [];
  private commands: GyreCommand[] = [];
  private changeList: Map<string, any> = new Map();

  constructor() {}

  addProjection(id: string, projection: Projection) {
    this.projections.set(id, projection);
  }

  addCommandHandler(id: string, cmdHandler: ICommandHandler) {
    this.cmdHandlers.set(id, cmdHandler);
  }

  execute(cmds: GyreCommand[], evts: GyreEvent[]) {
    this.events = this.events.concat(evts);
    this.commands = this.commands.concat(cmds);

    // Handle all commands and events until done.
    while (this.events.length || this.commands.length) {
      // Apply currently available events to the projections and tasks.
      this.handleEvents();

      // Run all command handlers.
      this.handleCommands();
    }
  }

  trigger(evt: GyreEvent) {
    this.events.push(evt);
  }

  issue(cmd: GyreCommand) {
    this.commands.push(cmd);
  }

  getChangeList(): Map<string, any> {
    return this.changeList;
  }

  private handleEvents() {
    // Send event list to the tasks
    // TODO invoke tasks

    // Apply events to the projections
    while (this.events.length) {
      const evt = this.events.pop();

      this.projections.forEach((projection, id) => {
        if (projection.applyEvent(evt)) {
          this.changeList.set(id, projection.getState());
        }
      });
    }
  }

  private handleCommands() {
    while (this.commands.length) {
      const cmd = this.commands.pop();
      this.cmdHandlers.forEach((cmdHandler: ICommandHandler) => {
        cmdHandler(cmd, this.issue, this.trigger, this.getProjectionState);
      });
    }
  }

  private getProjectionState(id: string): any {
    const projection = this.projections.get(id);
    if (projection) {
      return projection.getState();
    }
    return null;
  }
}
