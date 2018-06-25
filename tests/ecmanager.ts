import { Projection, IReducer } from '../src/projection';
import { ECManager } from '../src/ecmanager';
import { IGyreEvent } from '../src/event';
import { IGyreCommand } from '../src/command';
import { ICommandHandler } from '../src/commandhandler';

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

      const aProjection1 = new Projection({ val: 1 }, reducer1);
      const aProjection2 = new Projection({ val: 1 }, reducer2);
      anECManager.addProjection('someProjection', aProjection1);
      anECManager.addProjection('anotherProjection', aProjection2);
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
      const changeList: Map<string, any> = anECManager.getChangeList();
      const changeList2: Map<string, any> = anECManager.getChangeList();

      expect(changeList.size).toEqual(2);
      expect(changeList.get('someProjection').val).toEqual(3);
      expect(changeList.get('anotherProjection').val).toEqual(-1);

      expect(changeList2.size).toEqual(0);
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
      const changeList: Map<string, any> = anECManager.getChangeList();

      expect(changeList.size).toEqual(1);
      expect(changeList.get('someProjection').val).toEqual(2);
    });
  });
});
