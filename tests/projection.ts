import { Projection, IReducer } from '../src/projection';
import { IGyreEvent } from '../src/event';

describe('Projection', () => {
  it('should be instantiable', () => {
    const aProjection = new Projection({}, jest.fn());
    expect(typeof aProjection === 'object').toBe(true);
  });

  describe('provides an API', () => {
    let aProjection: Projection;

    beforeEach(() => {
      const state = {
        val: 1,
      };

      const reducer: IReducer = (state: any, evt: IGyreEvent) => {
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

      aProjection = new Projection(state, reducer);
    });

    it('to get the current state', () => {
      const projState: any = aProjection.getState();
      expect(projState.val).toEqual(1);
    });

    it('to apply an event and returns a boolean whether the state has been changed', () => {
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

      expect(aProjection.applyEvent(evtDoesNotExist)).toEqual(false);
      expect(aProjection.applyEvent(evtAdd)).toEqual(true);
      expect(aProjection.applyEvent(evtAdd)).toEqual(true);
      expect(aProjection.applyEvent(evtDoesNotExist)).toEqual(false);
      expect(aProjection.applyEvent(evtSubtract)).toEqual(true);
      expect(aProjection.applyEvent(evtDoesNotExist)).toEqual(false);

      const projState: any = aProjection.getState();

      expect(projState.val).toEqual(4);
    });
  });
});
