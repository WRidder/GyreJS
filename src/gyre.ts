import {GyreCommand} from './command';
import {GyreEvent} from './event';
import {Scheduler} from './scheduler';

export interface IGyreOptions {
  useMultithreading?: boolean;
}

export class Gyre {
  scheduler = new Scheduler();

  constructor() {}

  start(opts: IGyreOptions= {}) {

  }

  trigger(evt: GyreEvent) {

  }

  issue(cmd: GyreCommand) {

  }

  private startWorkers() {

  }
}
