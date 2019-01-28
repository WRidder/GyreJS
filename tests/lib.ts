import { Gyre, IGyreEvent, IGyreCommand, IListenerOptions } from '../src/index';

describe('The library', () => {
  it('exports a Gyre object', () => {
    expect(typeof Gyre).toBe('function');
  });
});
