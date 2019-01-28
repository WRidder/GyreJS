import { Gyre } from '../src/viewlayer/gyre';
import {
  IGyreCommand,
  IGyreEvent,
  IIncomingWebWorkerMsg,
  IListener,
  IWorker,
  WebWorkerMsgType,
} from '../src/common/interfaces';

jest.useFakeTimers();

describe('Gyre', () => {
  it('should be instantiable', () => {
    const workerMock: IWorker = {
      onmessage: (msg: IIncomingWebWorkerMsg) => {},
      postMessage: jest.fn(),
    };

    const aGyre = new Gyre(workerMock, 10);
    expect(typeof aGyre === 'object').toBe(true);
  });

  describe('provides an API', () => {
    let aGyre: Gyre;
    let workerMock: IWorker;
    let listener1: IListener;
    let listener2: IListener;
    let listener3: IListener;
    let ls1Id: number;
    let ls2Id: number;
    let ls3Id: number;

    beforeEach(() => {
      workerMock = {
        onmessage: (msg: IIncomingWebWorkerMsg) => {},
        postMessage: jest.fn(),
      };
      aGyre = new Gyre(workerMock, 10);

      listener1 = jest.fn();
      listener2 = jest.fn();
      listener3 = jest.fn();

      ls1Id = aGyre.register('proj1', listener1, {
        id: 'proj1listener',
        priority: 1,
      });
      ls2Id = aGyre.register('proj2', listener2, {
        id: 'proj2listener',
        priority: 1,
      });
      ls3Id = aGyre.register('proj3', listener3, {
        id: 'proj3listener',
        priority: 1,
      });
    });

    it('to trigger events', () => {
      const evtAdd: IGyreEvent = {
        id: 'add',
        data: 2,
      };

      const evtSubtract: IGyreEvent = {
        id: 'subtract',
        data: 1,
      };

      const evtDoesNotExist: IGyreEvent = {
        id: 'random',
        data: 2,
      };

      aGyre.trigger(evtAdd);
      aGyre.trigger(evtSubtract);
      aGyre.trigger(evtDoesNotExist);

      jest.runOnlyPendingTimers();

      expect(workerMock.postMessage).toBeCalledWith({
        contents: [{ data: 2, id: 'add' }, { data: 1, id: 'subtract' }, { data: 2, id: 'random' }],
        type: WebWorkerMsgType.EventList,
      });
    });

    it('to trigger commands', () => {
      const cmdAdd: IGyreCommand = {
        id: 'cmd_add',
        data: 2,
      };

      const cmdSubtract: IGyreCommand = {
        id: 'cmd_subtract',
        data: 1,
      };

      const cmdDoesNotExist: IGyreCommand = {
        id: 'cmd_random',
        data: 2,
      };

      aGyre.issue(cmdAdd);
      aGyre.issue(cmdSubtract);
      aGyre.issue(cmdDoesNotExist);

      jest.runOnlyPendingTimers();

      expect(workerMock.postMessage).toBeCalledWith({
        contents: [{ data: 2, id: 'cmd_add' }, { data: 1, id: 'cmd_subtract' }, { data: 2, id: 'cmd_random' }],
        type: WebWorkerMsgType.CommandList,
      });
    });

    it('to receive a unique id per registered listener, which can be used to unregister', () => {
      expect(ls1Id).toBe(1);
      expect(ls2Id).toBe(2);
      expect(ls3Id).toBe(3);

      aGyre.unregister(ls1Id, 'proj1');
    });

    it('to handle incoming worker messages', () => {
      // jest.runOnlyPendingTimers();
      const msg: IIncomingWebWorkerMsg = {
        data: {
          type: WebWorkerMsgType.ProjectionUpdates,
          contents: { proj1: 1 },
        },
      };
      workerMock.onmessage(msg);
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();

      expect(listener1).toBeCalledWith(1, 'proj1', expect.any(Function), expect.any(Function));

      // @ts-ignore
      expect(listener2.mock.calls.length).toBe(0);
      // @ts-ignore
      expect(listener3.mock.calls.length).toBe(0);
    });
    /*
    it('to issue commands and use command handlers', () => {
      const evtAdd: IGyreEvent = {
        id: 'add',
        data: 2,
      };
      const cmdAdd: IGyreCommand = {
        id: 'addCmd',
        data: 2,
      };

      const cmdHandler: ICommandHandler = (cmd, issue, trigger, getProjectionState) => {
        switch (cmd.id) {
          case 'addCmd': {
            evtAdd.data = getProjectionState('someProjection').val;
            trigger(evtAdd);
            break;
          }
        }
      };

      anECManager.addCommandHandler('someHandler', cmdHandler);
      anECManager.issue(cmdAdd);

      anECManager.execute([], []);

      // Get changes
      const changeList = anECManager.getChangeList();

      expect(Object.keys(changeList).length).toEqual(3);
      expect(changeList['someProjection'].val).toEqual(2);
    });

    it('supporting chained projections', () => {
      const evtAdd: IGyreEvent = {
        id: 'add',
        data: 2,
      };
      anECManager.execute([], [evtAdd]);

      // Get changes
      const changeList = anECManager.getChangeList();

      expect(Object.keys(changeList).length).toEqual(3);
      expect(changeList['someProjection'].val).toEqual(3);
      expect(changeList['chainedProjection'].val).toEqual(7);
      expect(changeList['chainedProjection2'].val).toEqual(11);
    });*/
  });
});
