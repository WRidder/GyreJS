import { IGyreCommand, IGyreEvent, IGyreOptions } from './interfaces';
import { Scheduler } from './scheduler';

export class Gyre {
  scheduler = new Scheduler();

  constructor() {}

  start(opts: IGyreOptions= {}) {

  }

  trigger(evt: IGyreEvent) {

  }

  issue(cmd: IGyreCommand) {

  }

  private startWorkers() {

  }
}
