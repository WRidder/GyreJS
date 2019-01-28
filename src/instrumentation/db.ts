import { Dexie } from 'dexie';
import { VERSION } from '../common/constants';
import { IGJSEvent, IGJSInfo, IGJSTrace } from './interfaces';

export class GyreJSDevDatabase extends Dexie {
  feInfo: Dexie.Table<IGJSInfo, string>;
  feEvents: Dexie.Table<IGJSEvent, number>;
  feTraces: Dexie.Table<IGJSTrace, number>;

  constructor(dbname: string) {
    super(dbname);

    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    this.version(1).stores({
      fe_info: '&key value',
      fe_event: '++id',
      fe_traces: '++id',
    });

    this.on('populate', function() {
      this.info.add({ key: 'gyrejs-version', value: `!${VERSION}` });
    });
  }
}
