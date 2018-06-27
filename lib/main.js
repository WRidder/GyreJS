(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("gyrejs-[name[", [], factory);
	else if(typeof exports === 'object')
		exports["gyrejs-[name["] = factory();
	else
		root["gyrejs-[name["] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/gyre.ts":
/*!*********************!*\
  !*** ./src/gyre.ts ***!
  \*********************/
/*! exports provided: Gyre */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gyre", function() { return Gyre; });
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scheduler */ "./src/scheduler.ts");

class Gyre {
    constructor(opts) {
        this.scheduler = new _scheduler__WEBPACK_IMPORTED_MODULE_0__["Scheduler"]();
        this.startWorker(opts.workerScriptPath);
    }
    trigger({ id, data }) {
        this.bWorker.postMessage({
            id,
            data,
            type: 'event',
        });
    }
    issue({ id, data }) {
        this.bWorker.postMessage({
            id,
            data,
            type: 'command',
        });
    }
    register(projectionId, cb, opts = { priority: 0, id: 'unnamed' }) {
        const pIds = Gyre.checkIfValidProjectionId(projectionId);
        if (typeof cb !== 'function') {
            throw '[GyreJS] Callback should be a function.';
        }
        if (opts.priority < 0 || opts.priority > 99) {
            throw '[GyreJS] IListener priority should be a number in range of [0,99].';
        }
        if (typeof opts.id !== 'string') {
            throw '[GyreJS] IListener id should be a string.';
        }
        // Curry the callback function
        const ccb = (data, pId) => {
            cb(data, pId, this.trigger.bind(this), this.issue.bind(this));
        };
        this.scheduler.register(pIds, ccb);
    }
    unregister(lsId, projectionId) {
        const pIds = Gyre.checkIfValidProjectionId(projectionId);
        this.scheduler.unregister(lsId, pIds);
    }
    startWorker(path) {
        this.bWorker = new Worker(path);
        // Register callbacks
        this.bWorker.onmessage = this.projectionUpdate.bind(this);
    }
    projectionUpdate(msg) {
        this.scheduler.projectionUpdate(msg.data.id, msg.data.data);
    }
    static checkIfValidProjectionId(projectionId) {
        // Input checking
        if (typeof projectionId !== 'string' && projectionId.constructor !== Array) {
            throw 'ProjectionId should be a(n array of) string(s) with non-zero length.';
        }
        if (typeof projectionId === 'string' && projectionId.length === 0) {
            throw 'ProjectionId should be a(n array of) string(s) with non-zero length.';
        }
        if (typeof projectionId !== 'string') {
            projectionId.forEach((pId) => {
                if (typeof pId !== 'string' || pId.length === 0) {
                    throw 'ProjectionId should be a(n array of) string(s) with non-zero length.';
                }
            });
        }
        return (typeof projectionId === 'string') ? [projectionId] : projectionId;
    }
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: Gyre */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gyre__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gyre */ "./src/gyre.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Gyre", function() { return _gyre__WEBPACK_IMPORTED_MODULE_0__["Gyre"]; });




/***/ }),

/***/ "./src/scheduler.ts":
/*!**************************!*\
  !*** ./src/scheduler.ts ***!
  \**************************/
/*! exports provided: Scheduler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scheduler", function() { return Scheduler; });
class Scheduler {
    constructor() {
        this.readyQueue = [];
        this.readyQueueIDlist = new Set();
        this.timeBudget = 10;
        this.projectionData = new Map();
        this.listeners = new Map();
        this.listenerCount = 1;
    }
    register(pIds, cb, opts = { priority: 0, id: 'unnamed' }) {
        const lsId = this.listenerCount;
        this.listeners.set(this.listenerCount, {
            cb,
            pIds,
            id: opts.id,
            priority: opts.priority,
        });
        this.addIListenerToQueue(lsId);
        this.listenerCount += 1;
        return lsId;
    }
    unregister(lsId, pIdsToUnsubscribe = []) {
        if (this.listeners.has(lsId)) {
            const listener = this.listeners.get(lsId);
            // If all projectionIds of the current listener are to un-subscribed, remove completely
            const remainingPIds = listener.pIds.filter(x => !(pIdsToUnsubscribe.indexOf(x) > -1));
            if (remainingPIds.length === 0) {
                this.listeners.delete(lsId);
            }
            // Remove from readyQueue
            let i = this.readyQueue.length;
            while (i) {
                if (pIdsToUnsubscribe.indexOf(this.readyQueue[i - 1].pId) > -1) {
                    this.readyQueueIDlist.delete(Scheduler.createIDForIQueueItem(this.readyQueue[i - 1]));
                    this.readyQueue.splice(i, 1);
                }
                i -= 1;
            }
        }
    }
    /**
     * Comment for method ´setTimeBudget´.
     * @param ms  Comment for parameter ´target´.
     */
    setTimeBudget(ms) {
        this.timeBudget = ms;
    }
    /**
     * Comment for method ´getTimeBudget´.
     */
    getTimeBudget() {
        return this.timeBudget;
    }
    projectionUpdate(id, data) {
        this.projectionData.set(id, data);
        // Iterate over listeners
        this.listeners.forEach((listener, lsId) => {
            if (listener.pIds.indexOf(id) > -1) {
                this.scheduleIListener(lsId, id);
            }
        });
    }
    /**
     * Iterates the ready queue
     */
    runOnce() {
        const startTime = Scheduler.getCurrentTime();
        let ranOnce = false;
        while ((Scheduler.getCurrentTime() < (startTime + this.timeBudget) ||
            !ranOnce) && this.readyQueue.length > 0) {
            // Get work item
            const item = this.readyQueue.pop();
            const cb = this.getCallbackById(item.lsId);
            if (!cb) {
                continue;
            }
            // If the item has been called before and the callback is a generator, invoke the generator again.
            if (item.genFn) {
                let ret;
                try {
                    ret = item.genFn.next();
                }
                catch (e) {
                    console.error(`[GyreJS] Error during invocation of listener (id: ${item.lsId}) for projection ${item.pId}: `, e);
                }
                if (!ret.done) {
                    this.readyQueue.push(item);
                }
                continue;
            }
            // Invoke callback
            let res;
            try {
                res = cb(this.projectionData.get(item.pId), item.pId);
            }
            catch (e) {
                console.error(`[GyreJS] Error during invocation of listener (id: ${item.lsId}) for projection ${item.pId}: `, e);
            }
            // Check if it is a generator function
            // @ts-ignore
            if (res && res.next) {
                // @ts-ignore
                const ret = res.next();
                if (!ret.done) {
                    // @ts-ignore
                    item.genFn = res;
                    this.readyQueue.push(item);
                }
            }
            ranOnce = true;
        }
        // Check if we ran out of budget. If so, increment priorities to prevent starvation.
        // However, priorities above 89 are fixed.
        if (this.readyQueue.length) {
            this.readyQueue.forEach((qItem) => {
                qItem.priority += qItem.priority < 89 ? 1 : 0;
            });
        }
    }
    /**
     * Returns timestamp in milliseconds.
     */
    static getCurrentTime() {
        return Date.now();
    }
    getCallbackById(lsId) {
        const listener = this.listeners.get(lsId);
        if (listener) {
            return listener.cb;
        }
        return null;
    }
    addIListenerToQueue(lsId) {
        const listener = this.listeners.get(lsId);
        listener.pIds.forEach((pId) => {
            if (this.projectionData.has(pId)) {
                this.scheduleIListener(lsId, pId);
            }
        });
    }
    scheduleIListener(lsId, pId) {
        const listener = this.listeners.get(lsId);
        if (listener) {
            const queueItem = {
                pId,
                lsId,
                priority: listener.priority,
            };
            // Check if not already in queue
            if (this.readyQueueIDlist.has(Scheduler.createIDForIQueueItem(queueItem))) {
                return;
            }
            let i = this.readyQueue.length;
            if (i === 0 || listener.priority > this.readyQueue[i - 1].priority) {
                this.addItemToQueue(queueItem, i);
            }
            else if (this.readyQueue[0].priority > listener.priority) {
                this.addItemToQueue(queueItem, 0);
            }
            else {
                do {
                    i = i - 1;
                    if (this.readyQueue[i].priority <= listener.priority) {
                        this.addItemToQueue(queueItem, i + 1);
                        break;
                    }
                } while (i);
            }
        }
    }
    addItemToQueue(qItem, idx) {
        if (idx === 0) {
            this.readyQueue.unshift(qItem);
        }
        else if (idx === this.readyQueue.length) {
            this.readyQueue.push(qItem);
        }
        else {
            this.readyQueue.splice(idx, 0, qItem);
        }
        this.readyQueueIDlist.add(Scheduler.createIDForIQueueItem(qItem));
    }
    static createIDForIQueueItem(qItem) {
        return qItem.lsId + '-' + qItem.pId;
    }
}


/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9neXJlanMtW25hbWVbL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9neXJlanMtW25hbWVbL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2d5cmVqcy1bbmFtZVsvLi9zcmMvZ3lyZS50cyIsIndlYnBhY2s6Ly9neXJlanMtW25hbWVbLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2d5cmVqcy1bbmFtZVsvLi9zcmMvc2NoZWR1bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2xFd0M7QUFTbEM7SUFJSixZQUFZLElBQWtCO1FBSHRCLGNBQVMsR0FBRyxJQUFJLG9EQUFTLEVBQUUsQ0FBQztRQUlsQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFjO1FBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FB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Q0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRU8sTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQWlCO1FBQ3BELE9BQU8sS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxDQUFDO0NBQ0YiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiZ3lyZWpzLVtuYW1lW1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJneXJlanMtW25hbWVbXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImd5cmVqcy1bbmFtZVtcIl0gPSBmYWN0b3J5KCk7XG59KSh3aW5kb3csIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7IElHeXJlQ29tbWFuZCwgSUd5cmVFdmVudCwgSUd5cmVPcHRpb25zLCBJRUNJbnRlcmZhY2UsIElMaXN0ZW5lck9wdGlvbnMsIElMaXN0ZW5lciB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tICcuL3NjaGVkdWxlcic7XG5cbmludGVyZmFjZSBJUHJvamVjdGlvbk1lc3NhZ2Uge1xuICBkYXRhOiB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBkYXRhOiBhbnk7XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBHeXJlIHtcbiAgcHJpdmF0ZSBzY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKCk7XG4gIHByaXZhdGUgYldvcmtlcjogV29ya2VyO1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElHeXJlT3B0aW9ucykge1xuICAgIHRoaXMuc3RhcnRXb3JrZXIob3B0cy53b3JrZXJTY3JpcHRQYXRoKTtcbiAgfVxuXG4gIHRyaWdnZXIoeyBpZCwgZGF0YSB9OiBJR3lyZUV2ZW50KSB7XG4gICAgdGhpcy5iV29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgIGlkLFxuICAgICAgZGF0YSxcbiAgICAgIHR5cGU6ICdldmVudCcsXG4gICAgfSk7XG4gIH1cblxuICBpc3N1ZSh7IGlkLCBkYXRhIH06IElHeXJlQ29tbWFuZCkge1xuICAgIHRoaXMuYldvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBpZCxcbiAgICAgIGRhdGEsXG4gICAgICB0eXBlOiAnY29tbWFuZCcsXG4gICAgfSk7XG4gIH1cblxuICByZWdpc3RlciAocHJvamVjdGlvbklkOiBzdHJpbmcgfCBzdHJpbmdbXSwgY2I6IElMaXN0ZW5lcixcbiAgICAgICAgICAgIG9wdHM6IElMaXN0ZW5lck9wdGlvbnMgPSB7IHByaW9yaXR5OiAwLCBpZDogJ3VubmFtZWQnIH0pIHtcbiAgICBjb25zdCBwSWRzID0gR3lyZS5jaGVja0lmVmFsaWRQcm9qZWN0aW9uSWQocHJvamVjdGlvbklkKTtcblxuICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93ICdbR3lyZUpTXSBDYWxsYmFjayBzaG91bGQgYmUgYSBmdW5jdGlvbi4nO1xuICAgIH1cbiAgICBpZiAob3B0cy5wcmlvcml0eSA8IDAgfHwgb3B0cy5wcmlvcml0eSA+IDk5KSB7XG4gICAgICB0aHJvdyAnW0d5cmVKU10gSUxpc3RlbmVyIHByaW9yaXR5IHNob3VsZCBiZSBhIG51bWJlciBpbiByYW5nZSBvZiBbMCw5OV0uJztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRzLmlkICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgJ1tHeXJlSlNdIElMaXN0ZW5lciBpZCBzaG91bGQgYmUgYSBzdHJpbmcuJztcbiAgICB9XG5cbiAgICAvLyBDdXJyeSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICBjb25zdCBjY2IgPSAoZGF0YTogYW55LCBwSWQ6IHN0cmluZykgPT4ge1xuICAgICAgY2IoZGF0YSwgcElkLCB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgdGhpcy5pc3N1ZS5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICAgIHRoaXMuc2NoZWR1bGVyLnJlZ2lzdGVyKHBJZHMsIGNjYik7XG4gIH1cblxuICB1bnJlZ2lzdGVyIChsc0lkOiBudW1iZXIsIHByb2plY3Rpb25JZD86IHN0cmluZ1tdIHwgc3RyaW5nKSB7XG4gICAgY29uc3QgcElkcyA9IEd5cmUuY2hlY2tJZlZhbGlkUHJvamVjdGlvbklkKHByb2plY3Rpb25JZCk7XG4gICAgdGhpcy5zY2hlZHVsZXIudW5yZWdpc3Rlcihsc0lkLCBwSWRzKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRXb3JrZXIocGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5iV29ya2VyID0gbmV3IFdvcmtlcihwYXRoKTtcblxuICAgIC8vIFJlZ2lzdGVyIGNhbGxiYWNrc1xuICAgIHRoaXMuYldvcmtlci5vbm1lc3NhZ2UgPSB0aGlzLnByb2plY3Rpb25VcGRhdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJvamVjdGlvblVwZGF0ZShtc2c6IElQcm9qZWN0aW9uTWVzc2FnZSkge1xuICAgIHRoaXMuc2NoZWR1bGVyLnByb2plY3Rpb25VcGRhdGUobXNnLmRhdGEuaWQsIG1zZy5kYXRhLmRhdGEpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgY2hlY2tJZlZhbGlkUHJvamVjdGlvbklkKHByb2plY3Rpb25JZDogc3RyaW5nIHwgc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gICAgLy8gSW5wdXQgY2hlY2tpbmdcbiAgICBpZiAodHlwZW9mIHByb2plY3Rpb25JZCAhPT0gJ3N0cmluZycgJiYgcHJvamVjdGlvbklkLmNvbnN0cnVjdG9yICE9PSBBcnJheSkge1xuICAgICAgdGhyb3cgJ1Byb2plY3Rpb25JZCBzaG91bGQgYmUgYShuIGFycmF5IG9mKSBzdHJpbmcocykgd2l0aCBub24temVybyBsZW5ndGguJztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcm9qZWN0aW9uSWQgPT09ICdzdHJpbmcnICYmIHByb2plY3Rpb25JZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93ICdQcm9qZWN0aW9uSWQgc2hvdWxkIGJlIGEobiBhcnJheSBvZikgc3RyaW5nKHMpIHdpdGggbm9uLXplcm8gbGVuZ3RoLic7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJvamVjdGlvbklkICE9PSAnc3RyaW5nJykge1xuICAgICAgcHJvamVjdGlvbklkLmZvckVhY2goKHBJZCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHBJZCAhPT0gJ3N0cmluZycgfHwgcElkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRocm93ICdQcm9qZWN0aW9uSWQgc2hvdWxkIGJlIGEobiBhcnJheSBvZikgc3RyaW5nKHMpIHdpdGggbm9uLXplcm8gbGVuZ3RoLic7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiAodHlwZW9mIHByb2plY3Rpb25JZCA9PT0gJ3N0cmluZycpID8gW3Byb2plY3Rpb25JZF0gOiBwcm9qZWN0aW9uSWQ7XG4gIH1cbn1cbiIsImV4cG9ydCB7IEd5cmUgfSBmcm9tICcuL2d5cmUnO1xuZXhwb3J0IHsgSUd5cmVDb21tYW5kLCBJR3lyZUV2ZW50LCBJTGlzdGVuZXJPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbiIsImltcG9ydCB7IElMaXN0ZW5lck9wdGlvbnMsIElMaXN0ZW5lciwgSUxpc3RlbmVyR2VuZXJhdG9yIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuaW50ZXJmYWNlIElMaXN0ZW5lckl0ZW0ge1xuICBpZDogc3RyaW5nO1xuICBwSWRzOiBzdHJpbmdbXTtcbiAgcHJpb3JpdHk6IG51bWJlcjtcbiAgY2I6IChkYXRhOiBhbnksIHBJZDogc3RyaW5nKSA9PiBhbnk7XG59XG5cbmludGVyZmFjZSBJUXVldWVJdGVtIHtcbiAgcElkOiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7XG4gIGxzSWQ6IG51bWJlcjtcbiAgZ2VuRm4/OiBJdGVyYXRvcjx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlciB7XG4gIHByaXZhdGUgcmVhZHlRdWV1ZTogSVF1ZXVlSXRlbVtdID0gW107XG4gIHByaXZhdGUgcmVhZHlRdWV1ZUlEbGlzdDogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG4gIHByaXZhdGUgdGltZUJ1ZGdldDogbnVtYmVyID0gMTA7XG4gIHByaXZhdGUgcHJvamVjdGlvbkRhdGE6IE1hcDxzdHJpbmcsIG9iamVjdD4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgbGlzdGVuZXJzOiBNYXA8bnVtYmVyLCBJTGlzdGVuZXJJdGVtPiA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSBsaXN0ZW5lckNvdW50ID0gMTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgcmVnaXN0ZXIocElkczogc3RyaW5nW10sIGNiOiAoZGF0YTogYW55LCBwSWQ6IHN0cmluZykgPT4gYW55LFxuICAgICAgICAgICBvcHRzOiBJTGlzdGVuZXJPcHRpb25zID0geyBwcmlvcml0eTogMCwgaWQ6ICd1bm5hbWVkJyB9KSB7XG4gICAgY29uc3QgbHNJZCA9IHRoaXMubGlzdGVuZXJDb3VudDtcbiAgICB0aGlzLmxpc3RlbmVycy5zZXQodGhpcy5saXN0ZW5lckNvdW50LCB7XG4gICAgICBjYixcbiAgICAgIHBJZHMsXG4gICAgICBpZDogb3B0cy5pZCxcbiAgICAgIHByaW9yaXR5OiBvcHRzLnByaW9yaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRJTGlzdGVuZXJUb1F1ZXVlKGxzSWQpO1xuICAgIHRoaXMubGlzdGVuZXJDb3VudCArPSAxO1xuXG4gICAgcmV0dXJuIGxzSWQ7XG4gIH1cblxuICB1bnJlZ2lzdGVyKGxzSWQ6IG51bWJlciwgcElkc1RvVW5zdWJzY3JpYmU6IHN0cmluZ1tdID0gW10pIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcnMuaGFzKGxzSWQpKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcjogSUxpc3RlbmVySXRlbSA9IHRoaXMubGlzdGVuZXJzLmdldChsc0lkKTtcblxuICAgICAgLy8gSWYgYWxsIHByb2plY3Rpb25JZHMgb2YgdGhlIGN1cnJlbnQgbGlzdGVuZXIgYXJlIHRvIHVuLXN1YnNjcmliZWQsIHJlbW92ZSBjb21wbGV0ZWx5XG4gICAgICBjb25zdCByZW1haW5pbmdQSWRzID0gbGlzdGVuZXIucElkcy5maWx0ZXIoeCA9PiAhKHBJZHNUb1Vuc3Vic2NyaWJlLmluZGV4T2YoeCkgPiAtMSkpO1xuICAgICAgaWYgKHJlbWFpbmluZ1BJZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShsc0lkKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIGZyb20gcmVhZHlRdWV1ZVxuICAgICAgbGV0IGkgPSB0aGlzLnJlYWR5UXVldWUubGVuZ3RoO1xuICAgICAgd2hpbGUgKGkpIHtcbiAgICAgICAgaWYgKHBJZHNUb1Vuc3Vic2NyaWJlLmluZGV4T2YodGhpcy5yZWFkeVF1ZXVlW2kgLSAxXS5wSWQpID4gLTEpIHtcbiAgICAgICAgICB0aGlzLnJlYWR5UXVldWVJRGxpc3QuZGVsZXRlKFNjaGVkdWxlci5jcmVhdGVJREZvcklRdWV1ZUl0ZW0odGhpcy5yZWFkeVF1ZXVlW2kgLSAxXSkpO1xuICAgICAgICAgIHRoaXMucmVhZHlRdWV1ZS5zcGxpY2UoaSwxKTtcbiAgICAgICAgfVxuICAgICAgICBpIC09IDE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbW1lbnQgZm9yIG1ldGhvZCDCtHNldFRpbWVCdWRnZXTCtC5cbiAgICogQHBhcmFtIG1zICBDb21tZW50IGZvciBwYXJhbWV0ZXIgwrR0YXJnZXTCtC5cbiAgICovXG4gIHNldFRpbWVCdWRnZXQodGhpczpTY2hlZHVsZXIsIG1zOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnRpbWVCdWRnZXQgPSBtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21tZW50IGZvciBtZXRob2QgwrRnZXRUaW1lQnVkZ2V0wrQuXG4gICAqL1xuICBnZXRUaW1lQnVkZ2V0KHRoaXM6U2NoZWR1bGVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQnVkZ2V0O1xuICB9XG5cbiAgcHJvamVjdGlvblVwZGF0ZShpZDogc3RyaW5nLCBkYXRhOiBvYmplY3QpIHtcbiAgICB0aGlzLnByb2plY3Rpb25EYXRhLnNldChpZCwgZGF0YSk7XG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgbGlzdGVuZXJzXG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIsIGxzSWQpID0+IHtcbiAgICAgIGlmIChsaXN0ZW5lci5wSWRzLmluZGV4T2YoaWQpID4gLTEpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZUlMaXN0ZW5lcihsc0lkLCBpZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhlIHJlYWR5IHF1ZXVlXG4gICAqL1xuICBydW5PbmNlKCkge1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IFNjaGVkdWxlci5nZXRDdXJyZW50VGltZSgpO1xuICAgIGxldCByYW5PbmNlID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoKFNjaGVkdWxlci5nZXRDdXJyZW50VGltZSgpIDwgKHN0YXJ0VGltZSArIHRoaXMudGltZUJ1ZGdldCkgfHxcbiAgICAgICFyYW5PbmNlKSAmJiB0aGlzLnJlYWR5UXVldWUubGVuZ3RoID4gMCkge1xuXG4gICAgICAvLyBHZXQgd29yayBpdGVtXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5yZWFkeVF1ZXVlLnBvcCgpO1xuICAgICAgY29uc3QgY2IgPSB0aGlzLmdldENhbGxiYWNrQnlJZChpdGVtLmxzSWQpO1xuICAgICAgaWYgKCFjYikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIGl0ZW0gaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSBhbmQgdGhlIGNhbGxiYWNrIGlzIGEgZ2VuZXJhdG9yLCBpbnZva2UgdGhlIGdlbmVyYXRvciBhZ2Fpbi5cbiAgICAgIGlmIChpdGVtLmdlbkZuKSB7XG4gICAgICAgIGxldCByZXQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0ID0gaXRlbS5nZW5Gbi5uZXh0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgYFtHeXJlSlNdIEVycm9yIGR1cmluZyBpbnZvY2F0aW9uIG9mIGxpc3RlbmVyIChpZDogJHtpdGVtLmxzSWR9KSBmb3IgcHJvamVjdGlvbiAke2l0ZW0ucElkfTogYCxcbiAgICAgICAgICAgIGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmV0LmRvbmUpIHtcbiAgICAgICAgICB0aGlzLnJlYWR5UXVldWUucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gSW52b2tlIGNhbGxiYWNrXG4gICAgICBsZXQgcmVzO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzID0gY2IodGhpcy5wcm9qZWN0aW9uRGF0YS5nZXQoaXRlbS5wSWQpLCBpdGVtLnBJZCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYFtHeXJlSlNdIEVycm9yIGR1cmluZyBpbnZvY2F0aW9uIG9mIGxpc3RlbmVyIChpZDogJHtpdGVtLmxzSWR9KSBmb3IgcHJvamVjdGlvbiAke2l0ZW0ucElkfTogYCxcbiAgICAgICAgICBlKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgaXQgaXMgYSBnZW5lcmF0b3IgZnVuY3Rpb25cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGlmIChyZXMgJiYgcmVzLm5leHQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCByZXQgPSByZXMubmV4dCgpO1xuXG4gICAgICAgIGlmICghcmV0LmRvbmUpIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgaXRlbS5nZW5GbiA9IHJlcztcbiAgICAgICAgICB0aGlzLnJlYWR5UXVldWUucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmFuT25jZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgd2UgcmFuIG91dCBvZiBidWRnZXQuIElmIHNvLCBpbmNyZW1lbnQgcHJpb3JpdGllcyB0byBwcmV2ZW50IHN0YXJ2YXRpb24uXG4gICAgLy8gSG93ZXZlciwgcHJpb3JpdGllcyBhYm92ZSA4OSBhcmUgZml4ZWQuXG4gICAgaWYgKHRoaXMucmVhZHlRdWV1ZS5sZW5ndGgpIHtcbiAgICAgIHRoaXMucmVhZHlRdWV1ZS5mb3JFYWNoKChxSXRlbSkgPT4ge1xuICAgICAgICBxSXRlbS5wcmlvcml0eSArPSBxSXRlbS5wcmlvcml0eSA8IDg5ID8gMSA6IDA7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aW1lc3RhbXAgaW4gbWlsbGlzZWNvbmRzLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0Q3VycmVudFRpbWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2FsbGJhY2tCeUlkKGxzSWQ6IG51bWJlcik6IChkYXRhOiBhbnksIHBJZDogc3RyaW5nKSA9PiB2b2lkICB8IEdlbmVyYXRvckZ1bmN0aW9uIHwgbnVsbCB7XG4gICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVycy5nZXQobHNJZCk7XG4gICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIuY2I7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRJTGlzdGVuZXJUb1F1ZXVlKGxzSWQ6IG51bWJlcikge1xuICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGxzSWQpO1xuXG4gICAgbGlzdGVuZXIucElkcy5mb3JFYWNoKChwSWQpID0+IHtcbiAgICAgIGlmICh0aGlzLnByb2plY3Rpb25EYXRhLmhhcyhwSWQpKSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVJTGlzdGVuZXIobHNJZCwgcElkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2NoZWR1bGVJTGlzdGVuZXIobHNJZDogbnVtYmVyLCBwSWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGxzSWQpO1xuXG4gICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICBjb25zdCBxdWV1ZUl0ZW0gPSB7XG4gICAgICAgIHBJZCxcbiAgICAgICAgbHNJZCxcbiAgICAgICAgcHJpb3JpdHk6IGxpc3RlbmVyLnByaW9yaXR5LFxuICAgICAgfTtcblxuICAgICAgLy8gQ2hlY2sgaWYgbm90IGFscmVhZHkgaW4gcXVldWVcbiAgICAgIGlmICh0aGlzLnJlYWR5UXVldWVJRGxpc3QuaGFzKFNjaGVkdWxlci5jcmVhdGVJREZvcklRdWV1ZUl0ZW0ocXVldWVJdGVtKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgaSA9IHRoaXMucmVhZHlRdWV1ZS5sZW5ndGg7XG4gICAgICBpZiAoaSA9PT0gMCB8fCBsaXN0ZW5lci5wcmlvcml0eSA+IHRoaXMucmVhZHlRdWV1ZVtpIC0gMV0ucHJpb3JpdHkpIHtcbiAgICAgICAgdGhpcy5hZGRJdGVtVG9RdWV1ZShxdWV1ZUl0ZW0sIGkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnJlYWR5UXVldWVbMF0ucHJpb3JpdHkgPiBsaXN0ZW5lci5wcmlvcml0eSkge1xuICAgICAgICB0aGlzLmFkZEl0ZW1Ub1F1ZXVlKHF1ZXVlSXRlbSwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgaSA9IGkgLSAxO1xuICAgICAgICAgIGlmICh0aGlzLnJlYWR5UXVldWVbaV0ucHJpb3JpdHkgPD0gbGlzdGVuZXIucHJpb3JpdHkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbVRvUXVldWUocXVldWVJdGVtLCBpICsgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkSXRlbVRvUXVldWUocUl0ZW06IElRdWV1ZUl0ZW0sIGlkeDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKGlkeCA9PT0gMCkge1xuICAgICAgdGhpcy5yZWFkeVF1ZXVlLnVuc2hpZnQocUl0ZW0pO1xuICAgIH0gZWxzZSBpZiAoaWR4ID09PSB0aGlzLnJlYWR5UXVldWUubGVuZ3RoKSB7XG4gICAgICB0aGlzLnJlYWR5UXVldWUucHVzaChxSXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHlRdWV1ZS5zcGxpY2UoaWR4LCAwLCBxSXRlbSk7XG4gICAgfVxuICAgIHRoaXMucmVhZHlRdWV1ZUlEbGlzdC5hZGQoU2NoZWR1bGVyLmNyZWF0ZUlERm9ySVF1ZXVlSXRlbShxSXRlbSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlSURGb3JJUXVldWVJdGVtKHFJdGVtOiBJUXVldWVJdGVtKTogc3RyaW5nIHtcbiAgICByZXR1cm4gcUl0ZW0ubHNJZCArICctJyArIHFJdGVtLnBJZDtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==