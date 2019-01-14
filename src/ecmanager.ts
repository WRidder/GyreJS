import { IGyreCommand, IGyreEvent, ICommandHandler } from './interfaces';
import { Projection } from './projection';

export class ECManager {
  private projections: Map<string, Projection> = new Map();
  private projectionDependencyList: Map<string, string[]> = new Map();
  private projectionTopLevelList: string[] = [];

  private timedEvents: Map<number, number> = new Map();
  private timedCommands: Map<number, number> = new Map();

  private cmdHandlers: Map<string, ICommandHandler> = new Map();
  private events: IGyreEvent[] = [];
  private commands: IGyreCommand[] = [];
  private changeList: any = {};

  constructor(interval: number = 16) {
    setInterval(
      () => {
        postMessage(this.getChangeList());
      },
      interval);
  }

  addProjection(id: string, projection: Projection, parentProjection?: string) {
    if  (this.projections.has(id)) {
      throw `[GyreJs] Projection ids must be unique. Id '${id}' has already been registered.`;
    }

    this.projections.set(id, projection);

    if (typeof parentProjection === 'string') {
      if (this.projectionDependencyList.has(parentProjection)) {
        this.projectionDependencyList.set(
          parentProjection,
          this.projectionDependencyList.get(parentProjection).concat(id));
      } else {
        this.projectionDependencyList.set(
          parentProjection,
          [id]);
      }
    } else {
      this.projectionTopLevelList.push(id);
    }
  }

  addCommandHandler(id: string, cmdHandler: ICommandHandler) {
    this.cmdHandlers.set(id, cmdHandler);
  }

  execute(cmds: IGyreCommand[], evts: IGyreEvent[]) {
    if (evts) {
      this.events = this.events.concat(evts);
    }

    if (cmds) {
      this.commands = this.commands.concat(cmds);
    }

    // Handle all commands and events until done.
    while (this.events.length || this.commands.length) {
      // Apply currently available events to the projections and tasks.
      this.handleEvents();

      // Run all command handlers.
      this.handleCommands();
    }
  }

  trigger(evt: IGyreEvent) {
    this.events.push(evt);
  }

  issue(cmd: IGyreCommand) {
    this.commands.push(cmd);
  }

  getChangeList(): { [index:string] : any } {
    const list = this.changeList;
    this.changeList = {};
    return list;
  }

  setTimedEvent(interval: number) {
    const evt: IGyreEvent = {
      id: `timedEvt_${interval}`,
      data: interval,
    };

    this.timedEvents.set(
      interval,
      // @ts-ignore
      setInterval(
        () => {
          this.handleEvent(evt);
        },
        interval));
  }

  setTimedCommand(interval: number) {
    const cmd: IGyreCommand = {
      id: `timedCmd_${interval}`,
      data: interval,
    };

    this.timedCommands.set(
      interval,
      // @ts-ignore
      setInterval(
        () => {
          this.handleCommand(cmd);
        },
        interval));
  }

  private handleEvents() {
    // Send event list to the tasks
    // TODO invoke tasks
    // TODO: filter projections which do not have listeners from changelist.
    // -- but do emit them once a listener registers (also when a listener registers later)

    // Apply events to the projections
    while (this.events.length) {
      const evt = this.events.pop();
      this.handleEvent(evt);
    }
  }

  private handleEvent(evt: IGyreEvent) {
    // Get all top-level projections.
    this.projectionTopLevelList.forEach((id) => {
      this.applyEventIterative(evt, id);
    });
  }

  private applyEventIterative(evt: IGyreEvent, id: string, parentState: any = void 0) {
    const projection = this.projections.get(id);

    // Apply event
    if (projection.applyEvent(evt, parentState)) {
      this.addToChangelist(id, projection.getState());
    }

    // Loop children
    if (this.projectionDependencyList.has(id)) {
      this.projectionDependencyList.get(id).forEach((childPId: string) => {
        this.applyEventIterative(evt, childPId, projection.getState());
      });
    }
  }

  private addToChangelist(id: string, state: any) {
    // Check if has current listeners
    this.changeList[id] = state;
  }

  private handleCommands() {
    while (this.commands.length) {
      const cmd = this.commands.pop();
      this.handleCommand(cmd);
    }
  }

  private handleCommand(cmd: IGyreCommand) {
    this.cmdHandlers.forEach((cmdHandler: ICommandHandler) => {
      cmdHandler(cmd, this.issue.bind(this), this.trigger.bind(this), this.getProjectionState.bind(this));
    });
  }

  private getProjectionState(id: string): any {
    const projection = this.projections.get(id);
    if (projection) {
      return projection.getState();
    }
    return null;
  }
}
