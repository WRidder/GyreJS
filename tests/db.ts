// setup tests
const dexie = require('dexie');
dexie.dependencies.indexedDB = require('fake-indexeddb');
dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

const databases = await Dexie.getDatabaseNames();
console.log(databases);
