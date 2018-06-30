import { Projection } from '../src/projection';
import { ECManager } from '../src/ecmanager';
import { IGyreCommand, IGyreEvent, ICommandHandler, IReducer } from '../src/interfaces';

describe('ECManager', () => {
  it('should be instantiable', () => {
    const anECManager = new ECManager();
    expect(typeof anECManager === 'object').toBe(true);
  });

  describe('provides an API', () => {
    let anECManager: ECManager;

    beforeEach(() => {
      anECManager = new ECManager();

      const reducer1: IReducer = (state: any, evt: IGyreEvent) => {
        switch (evt.id) {
          case 'add':
            return Object.assign({}, state, {
              val: state.val + evt.data,
            });
          case 'subtract':
            return Object.assign({}, state, {
              val: state.val - evt.data,
            });
        }
      };

      const reducer2: IReducer = (state: any, evt: IGyreEvent) => {
        switch (evt.id) {
          case 'add2':
            return Object.assign({}, state, {
              val: state.val + evt.data,
            });
          case 'subtract':
            return Object.assign({}, state, {
              val: state.val - evt.data,
            });
        }
      };

      const reducer3: IReducer = (state, evt, parentState) => {
        switch (evt.id) {
          case 'add':
            return Object.assign({}, state, {
              val: state.val + parentState.val + evt.data,
            })
        }
      };

      const aProjection1 = new Projection({ val: 1 }, reducer1);
      const aProjection2 = new Projection({ val: 1 }, reducer2);
      const aChainedProjection = new Projection({ val: 2 }, reducer3);
      const aChainedProjection2 = new Projection({ val: 2 }, reducer3);
      anECManager.addProjection('someProjection', aProjection1);
      anECManager.addProjection('anotherProjection', aProjection2);
      anECManager.addProjection('chainedProjection', aChainedProjection, 'someProjection');
      anECManager.addProjection('chainedProjection2', aChainedProjection2, 'chainedProjection');
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

      anECManager.trigger(evtAdd);
      anECManager.trigger(evtSubtract);
      anECManager.trigger(evtDoesNotExist);

      anECManager.execute([], [evtAdd, evtSubtract]);

      // Get changes
      const changeList = anECManager.getChangeList();
      const changeList2 = anECManager.getChangeList();

      expect(Object.keys(changeList).length).toEqual(4);
      expect(changeList['someProjection'].val).toEqual(3);
      expect(changeList['anotherProjection'].val).toEqual(-1);

      expect(Object.keys(changeList2).length).toEqual(0);
    });

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
    });
  });
});
