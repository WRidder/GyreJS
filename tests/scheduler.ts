import { Scheduler, ListenerOptions } from '../src/scheduler';

jest.useFakeTimers();

/*
 * Duties:
 * - Holds a list of subscribed listeners
 * - Listeners can subscribe to single projection
 * - Listeners are call
 */

describe('Scheduler', () => {

  it('should be instantiable', () => {
    const aScheduler = new Scheduler();
    expect(typeof aScheduler === 'object').toBe(true);
  });

  describe('provides an API', () => {
    let aScheduler : Scheduler;
    let cb: Function;

    beforeEach(() => {
      aScheduler = new Scheduler();
      cb = jest.fn();
    });

    describe('to register listeners', () => {
      it('by id, callback, and options.', () => {
        const projectionToSubscribeTo = 'AProjection';
        const options: ListenerOptions = {
          id: 'SomeListener',
          priority: 99,
        };
        aScheduler.register(projectionToSubscribeTo, cb, options);
      });

      it('which throws an error for invalid projection id.', () => {
        expect(() => aScheduler.register('', cb)).toThrow();
        expect(() => aScheduler.register([''], cb)).toThrow();
        expect(() => aScheduler.register(['', ''], cb)).toThrow();
        expect(() => aScheduler.register([null, 3], cb)).toThrow();
      });

      it('which throws an error for invalid callback.', () => {
        const projectionToSubscribeTo = 'SomeProjection';
        expect(() => aScheduler.register(projectionToSubscribeTo, undefined)).toThrow();
      });
    });

    it('to unregister listeners', () => {
      const projectionToSubscribeTo = 'AProjection';
      aScheduler.unregister(projectionToSubscribeTo, cb);
    });

    it('to get and set the time budget', () => {
      aScheduler.setTimeBudget(10);
      expect(aScheduler.getTimeBudget()).toBe(10);
    });

    it('to execute the scheduler once', () => {
      aScheduler.runOnce();
    });

    it('to receive data from a projection', () => {
      aScheduler.projectionUpdate('omeProjection', {
        val1: 'test',
        val2: 3,
      });
    });
  });

  describe('when run', () => {
    let aScheduler : Scheduler;
    beforeEach(() => {
      aScheduler = new Scheduler();
      aScheduler.setTimeBudget(Number.MAX_SAFE_INTEGER);

      // Add data from a projection
      aScheduler.projectionUpdate('MiscProjection', {
        val1: 'test',
        val2: 3,
      });
    });

    it('calls listeners in order of priority', () => {
      const callArray: number[] = [];

      // Create listeners
      const listener1 = () => callArray.push(1);
      const listener2 = () => callArray.push(2);
      const listener3 = () => callArray.push(3);

      // Add listeners
      aScheduler.register('MiscProjection', listener1, { priority: 1 });
      aScheduler.register('MiscProjection', listener2, { priority: 3 });
      aScheduler.register('MiscProjection', listener3, { priority: 2 });

      // Run the scheduler
      aScheduler.runOnce();

      // Check
      expect(callArray).toEqual([2, 3, 1]);
    });

    it('calls listeners after a projection has been updated', () => {
      const callArray: number[] = [];

      // Create listeners
      const listener1 = () => callArray.push(1);
      const listener2 = () => callArray.push(2);
      const listener3 = () => callArray.push(3);

      // Add listeners
      aScheduler.register('AnotherProjection', listener1, { priority: 1 });
      aScheduler.register('AnotherProjection', listener2, { priority: 3 });
      aScheduler.register('AnotherProjection', listener3, { priority: 2 });

      // Run the scheduler
      aScheduler.runOnce();

      // Check
      expect(callArray).toEqual([]);

      // Add data from a projection
      aScheduler.projectionUpdate('AnotherProjection', {
        val1: 'test',
        val2: 3,
      });

      // Run the scheduler
      aScheduler.runOnce();

      // Check
      expect(callArray).toEqual([2, 3, 1]);
    });

    it('calls a listener only once per projection update', () => {
      // Register listeners
      const listener1 = jest.fn();
      aScheduler.register('MiscProjection', listener1);

      // Run the scheduler twice
      aScheduler.runOnce();
      aScheduler.runOnce();

      expect(listener1).toHaveBeenCalledTimes(1);
    });

    it('calls a listener only once per projection update', () => {
      // Register listeners
      const listener1 = jest.fn();
      aScheduler.register(['MiscProjection', 'AnotherProjection'], listener1);

      // Add data from a projection
      aScheduler.projectionUpdate('AnotherProjection', {
        val1: 'test',
        val2: 3,
      });

      // Run the scheduler twice
      aScheduler.runOnce();

      expect(listener1).toHaveBeenCalledTimes(2);
    });

    it('supports generator functions', () => {
      const callArray: number[] = [];

      // Register listeners
      const listener1 = function* listener1(): any {
        callArray.push(1);
        yield;
        callArray.push(2);
        yield;
        callArray.push(3);
        return;
      };
      aScheduler.register('MiscProjection', listener1);

      // Run the scheduler
      aScheduler.runOnce();

      expect(callArray).toEqual([1, 2, 3]);
    });

    it('calls listeners as long as the time budget remains', () => {
      aScheduler.setTimeBudget(10);
      expect(typeof (new Scheduler()) === 'object').toBe(true);
    });
  });
});


