import {Scheduler} from './scheduler';

export interface GyreOptions {
  useMultithreading?: boolean;
}

export class Gyre {
  scheduler = new Scheduler();

  constructor() {}

  start(opts: GyreOptions = {}) {

  }

  private startWorkers() {

  }
}
