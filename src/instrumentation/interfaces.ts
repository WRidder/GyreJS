// By defining the interface of table records,
// you get better type safety and code completion
export interface IGJSInfo {
  key: string;
  value: any;
}

export enum EventType {
  TraceStart = 1,
  TraceEnd = 5,
  Flag = 10,
}

export interface IGJSEvent {
  id?: number; // Primary key. Optional (autoincremented)
  type: EventType;
  timestamp: number;
}

export enum TraceType {
  Start = 1,
  End = 5,
  SchedulerCycle = 10,
  SendEventsToManager = 20,
  SendCommandsToManager = 25,
}

export interface IGJSTrace {
  id?: number; // Primary key. Optional (autoincremented)
  depth: number;
  traceId: number;
  type: TraceType;
  timestamp: number;
  duration: number;
}
