import { EventType, TraceType } from '../interfaces';
export { EventType, TraceType };

export const ttool = (() => {
  return {
    enable: () => {},
    disable: () => {},
    traceStart: (): number => {
      return 0;
    },
    traceEnd: () => {},
    mark: () => {},
    flush: () => {},
  };
})();
