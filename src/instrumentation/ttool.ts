import { GyreJSDevDatabase } from './db';
import timer from './timer';
import { EventType, IGJSEvent, IGJSTrace, TraceType } from './interfaces';

interface ActiveTrace {
  traceId: number;
  type: TraceType;
  depth: number;
  timestamp: number;
}

export const ttool = (() => {
  const gdb = new GyreJSDevDatabase('gyrejsdb');

  let events: IGJSEvent[] = [];
  let traces: IGJSTrace[] = [];
  const activeTraces: Map<number, ActiveTrace> = new Map();

  let active: boolean = false;
  let depth: number = 10;
  let traceId: number = 0;

  return {
    enable: () => {
      active = true;

      traces.push({
        traceId: 0,
        type: TraceType.Start,
        timestamp: timer.now(),
        duration: 0,
        depth: 0,
      });
    },
    disable: () => {
      active = false;

      traces.push({
        traceId: 0,
        type: TraceType.End,
        timestamp: timer.now(),
        duration: 0,
        depth: 0,
      });
    },
    traceStart: (type: TraceType): number => {
      if (!active) {
        return 0;
      }

      depth = depth + 1;
      traceId = traceId + 1;

      activeTraces.set(traceId, {
        traceId,
        type,
        depth,
        timestamp: timer.now(),
      });

      return traceId;
    },
    traceEnd: (tid: number) => {
      if (!active || tid === 0) {
        return;
      }

      depth = depth - 1;

      const trace = activeTraces.get(tid);
      traces.push(
        Object.assign(trace, {
          duration: timer.now() - trace.timestamp,
        }),
      );
      activeTraces.delete(tid);
    },
    mark: (msg: string) => {
      if (!active) {
        return;
      }

      events.push({
        type: EventType.Flag,
        timestamp: timer.now(),
      });
    },
    flush: () => {
      gdb.feEvents.bulkAdd(events);
      gdb.feTraces.bulkAdd(traces);
      events = [];
      traces = [];
    },
  };
})();
