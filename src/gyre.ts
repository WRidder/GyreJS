import {GyreCommand} from './command';
import {GyreEvent} from './event';
import {Scheduler} from './scheduler';

export interface GyreOptions {
  useMultithreading?: boolean;
}

export class Gyre {
  scheduler = new Scheduler();

  constructor() {}

  start(opts: GyreOptions = {}) {

  }

  trigger(evt: GyreEvent) {

  }

  issue(cmd: GyreCommand) {

  }

  private startWorkers() {

  }
}
