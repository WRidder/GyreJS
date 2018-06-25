(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("gyrejs", [], factory);
	else if(typeof exports === 'object')
		exports["gyrejs"] = factory();
	else
		root["gyrejs"] = factory();
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
    constructor() {
        this.scheduler = new _scheduler__WEBPACK_IMPORTED_MODULE_0__["Scheduler"]();
    }
    start(opts = {}) {
    }
    trigger(evt) {
    }
    issue(cmd) {
    }
    startWorkers() {
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
    register(projectionId, cb, opts = { priority: 0, id: 'unnamed' }) {
        const pIds = Scheduler.checkIfValidProjectionId(projectionId);
        if (typeof cb !== 'function') {
            throw '[GyreJS] Callback should be a function.';
        }
        if (opts.priority < 0 || opts.priority > 99) {
            throw '[GyreJS] IListener priority should be a number in range of [0,99].';
        }
        const lsId = this.listenerCount;
        this.listeners.set(this.listenerCount, {
            pIds,
            cb,
            id: opts.id,
            priority: opts.priority,
        });
        this.addIListenerToQueue(lsId);
        this.listenerCount += 1;
        return lsId;
    }
    unregister(lsId, projectionId) {
        const pIdsToUnsubscribe = Scheduler.checkIfValidProjectionId(projectionId);
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
                    console.error(`[GyreJS] Error invoking listener (id: ${item.lsId}) for projection ${item.pId}: `, e);
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
                console.error(`[GyreJS] Error invoking listener (id: ${item.lsId}) for projection ${item.pId}: `, e);
            }
            // Check if it is a generator function
            if (res && res.next) {
                const ret = res.next();
                if (!ret.done) {
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


/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9neXJlanMvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2d5cmVqcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9neXJlanMvLi9zcmMvZ3lyZS50cyIsIndlYnBhY2s6Ly9neXJlanMvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZ3lyZWpzLy4vc3JjL3NjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRXdDO0FBRWxDO0lBR0o7UUFGQSxjQUFTLEdBQUcsSUFBSSxvREFBUyxFQUFFLENBQUM7SUFFYixDQUFDO0lBRWhCLEtBQUssQ0FBQyxPQUFvQixFQUFFO0lBRTVCLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBZTtJQUV2QixDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQWlCO0lBRXZCLENBQUM7SUFFTyxZQUFZO0lBRXBCLENBQUM7Q0FDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2QjZCOzs7Ozs7Ozs7Ozs7Ozs7QUNnQnhC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cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJneXJlanNcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZ3lyZWpzXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImd5cmVqc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHdpbmRvdywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHsgSUd5cmVDb21tYW5kLCBJR3lyZUV2ZW50LCBJR3lyZU9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi9zY2hlZHVsZXInO1xuXG5leHBvcnQgY2xhc3MgR3lyZSB7XG4gIHNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgc3RhcnQob3B0czogSUd5cmVPcHRpb25zPSB7fSkge1xuXG4gIH1cblxuICB0cmlnZ2VyKGV2dDogSUd5cmVFdmVudCkge1xuXG4gIH1cblxuICBpc3N1ZShjbWQ6IElHeXJlQ29tbWFuZCkge1xuXG4gIH1cblxuICBwcml2YXRlIHN0YXJ0V29ya2VycygpIHtcblxuICB9XG59XG4iLCJleHBvcnQgeyBHeXJlIH0gZnJvbSAnLi9neXJlJztcbmV4cG9ydCB7IElHeXJlQ29tbWFuZCwgSUd5cmVFdmVudCwgSUxpc3RlbmVyT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG4iLCJpbXBvcnQgeyBJTGlzdGVuZXJPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuaW50ZXJmYWNlIElMaXN0ZW5lciB7XG4gIGlkOiBzdHJpbmc7XG4gIHBJZHM6IHN0cmluZ1tdO1xuICBwcmlvcml0eTogbnVtYmVyO1xuICBjYjogKGRhdGE6IGFueSwgcElkOiBzdHJpbmcpID0+IGFueTtcbn1cblxuaW50ZXJmYWNlIElRdWV1ZUl0ZW0ge1xuICBwSWQ6IHN0cmluZztcbiAgcHJpb3JpdHk6IG51bWJlcjtcbiAgbHNJZDogbnVtYmVyO1xuICBnZW5Gbj86IEl0ZXJhdG9yPHZvaWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgU2NoZWR1bGVyIHtcbiAgcHJpdmF0ZSByZWFkeVF1ZXVlOiBJUXVldWVJdGVtW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkeVF1ZXVlSURsaXN0OiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcbiAgcHJpdmF0ZSB0aW1lQnVkZ2V0OiBudW1iZXIgPSAxMDtcbiAgcHJpdmF0ZSBwcm9qZWN0aW9uRGF0YTogTWFwPHN0cmluZywgb2JqZWN0PiA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IE1hcDxudW1iZXIsIElMaXN0ZW5lcj4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgbGlzdGVuZXJDb3VudCA9IDE7XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHJlZ2lzdGVyKHByb2plY3Rpb25JZDogc3RyaW5nIHwgc3RyaW5nW10sIGNiOiAoZGF0YTogYW55LCBwSWQ6IHN0cmluZykgPT4gYW55LFxuICAgICAgICAgICBvcHRzOiBJTGlzdGVuZXJPcHRpb25zID0geyBwcmlvcml0eTogMCwgaWQ6ICd1bm5hbWVkJyB9KSB7XG4gICAgY29uc3QgcElkcyA9IFNjaGVkdWxlci5jaGVja0lmVmFsaWRQcm9qZWN0aW9uSWQocHJvamVjdGlvbklkKTtcblxuICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93ICdbR3lyZUpTXSBDYWxsYmFjayBzaG91bGQgYmUgYSBmdW5jdGlvbi4nO1xuICAgIH1cbiAgICBpZiAob3B0cy5wcmlvcml0eSA8IDAgfHwgb3B0cy5wcmlvcml0eSA+IDk5KSB7XG4gICAgICB0aHJvdyAnW0d5cmVKU10gSUxpc3RlbmVyIHByaW9yaXR5IHNob3VsZCBiZSBhIG51bWJlciBpbiByYW5nZSBvZiBbMCw5OV0uJztcbiAgICB9XG5cbiAgICBjb25zdCBsc0lkID0gdGhpcy5saXN0ZW5lckNvdW50O1xuICAgIHRoaXMubGlzdGVuZXJzLnNldCh0aGlzLmxpc3RlbmVyQ291bnQsIHtcbiAgICAgIHBJZHMsXG4gICAgICBjYixcbiAgICAgIGlkOiBvcHRzLmlkLFxuICAgICAgcHJpb3JpdHk6IG9wdHMucHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZElMaXN0ZW5lclRvUXVldWUobHNJZCk7XG4gICAgdGhpcy5saXN0ZW5lckNvdW50ICs9IDE7XG5cbiAgICByZXR1cm4gbHNJZDtcbiAgfVxuXG4gIHVucmVnaXN0ZXIobHNJZDogbnVtYmVyLCBwcm9qZWN0aW9uSWQ/OiBzdHJpbmdbXSB8IHN0cmluZykge1xuICAgIGNvbnN0IHBJZHNUb1Vuc3Vic2NyaWJlOiBzdHJpbmdbXSA9IFNjaGVkdWxlci5jaGVja0lmVmFsaWRQcm9qZWN0aW9uSWQocHJvamVjdGlvbklkKTtcblxuICAgIGlmICh0aGlzLmxpc3RlbmVycy5oYXMobHNJZCkpIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyOiBJTGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVycy5nZXQobHNJZCk7XG5cbiAgICAgIC8vIElmIGFsbCBwcm9qZWN0aW9uSWRzIG9mIHRoZSBjdXJyZW50IGxpc3RlbmVyIGFyZSB0byB1bi1zdWJzY3JpYmVkLCByZW1vdmUgY29tcGxldGVseVxuICAgICAgY29uc3QgcmVtYWluaW5nUElkcyA9IGxpc3RlbmVyLnBJZHMuZmlsdGVyKHggPT4gIShwSWRzVG9VbnN1YnNjcmliZS5pbmRleE9mKHgpID4gLTEpKTtcbiAgICAgIGlmIChyZW1haW5pbmdQSWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUobHNJZCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZSBmcm9tIHJlYWR5UXVldWVcbiAgICAgIGxldCBpID0gdGhpcy5yZWFkeVF1ZXVlLmxlbmd0aDtcbiAgICAgIHdoaWxlIChpKSB7XG4gICAgICAgIGlmIChwSWRzVG9VbnN1YnNjcmliZS5pbmRleE9mKHRoaXMucmVhZHlRdWV1ZVtpIC0gMV0ucElkKSA+IC0xKSB7XG4gICAgICAgICAgdGhpcy5yZWFkeVF1ZXVlSURsaXN0LmRlbGV0ZShTY2hlZHVsZXIuY3JlYXRlSURGb3JJUXVldWVJdGVtKHRoaXMucmVhZHlRdWV1ZVtpIC0gMV0pKTtcbiAgICAgICAgICB0aGlzLnJlYWR5UXVldWUuc3BsaWNlKGksMSk7XG4gICAgICAgIH1cbiAgICAgICAgaSAtPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb21tZW50IGZvciBtZXRob2QgwrRzZXRUaW1lQnVkZ2V0wrQuXG4gICAqIEBwYXJhbSBtcyAgQ29tbWVudCBmb3IgcGFyYW1ldGVyIMK0dGFyZ2V0wrQuXG4gICAqL1xuICBzZXRUaW1lQnVkZ2V0KHRoaXM6U2NoZWR1bGVyLCBtczogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy50aW1lQnVkZ2V0ID0gbXM7XG4gIH1cblxuICAvKipcbiAgICogQ29tbWVudCBmb3IgbWV0aG9kIMK0Z2V0VGltZUJ1ZGdldMK0LlxuICAgKi9cbiAgZ2V0VGltZUJ1ZGdldCh0aGlzOlNjaGVkdWxlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMudGltZUJ1ZGdldDtcbiAgfVxuXG4gIHByb2plY3Rpb25VcGRhdGUoaWQ6IHN0cmluZywgZGF0YTogb2JqZWN0KSB7XG4gICAgdGhpcy5wcm9qZWN0aW9uRGF0YS5zZXQoaWQsIGRhdGEpO1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIGxpc3RlbmVyc1xuICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyLCBsc0lkKSA9PiB7XG4gICAgICBpZiAobGlzdGVuZXIucElkcy5pbmRleE9mKGlkKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVJTGlzdGVuZXIobHNJZCwgaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIHRoZSByZWFkeSBxdWV1ZVxuICAgKi9cbiAgcnVuT25jZSgpIHtcbiAgICBjb25zdCBzdGFydFRpbWUgPSBTY2hlZHVsZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgICBsZXQgcmFuT25jZSA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKChTY2hlZHVsZXIuZ2V0Q3VycmVudFRpbWUoKSA8IChzdGFydFRpbWUgKyB0aGlzLnRpbWVCdWRnZXQpIHx8XG4gICAgICAhcmFuT25jZSkgJiYgdGhpcy5yZWFkeVF1ZXVlLmxlbmd0aCA+IDApIHtcblxuICAgICAgLy8gR2V0IHdvcmsgaXRlbVxuICAgICAgY29uc3QgaXRlbSA9IHRoaXMucmVhZHlRdWV1ZS5wb3AoKTtcbiAgICAgIGNvbnN0IGNiID0gdGhpcy5nZXRDYWxsYmFja0J5SWQoaXRlbS5sc0lkKTtcbiAgICAgIGlmICghY2IpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBpdGVtIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUgYW5kIHRoZSBjYWxsYmFjayBpcyBhIGdlbmVyYXRvciwgaW52b2tlIHRoZSBnZW5lcmF0b3IgYWdhaW4uXG4gICAgICBpZiAoaXRlbS5nZW5Gbikge1xuICAgICAgICBsZXQgcmV0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldCA9IGl0ZW0uZ2VuRm4ubmV4dCgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgW0d5cmVKU10gRXJyb3IgaW52b2tpbmcgbGlzdGVuZXIgKGlkOiAke2l0ZW0ubHNJZH0pIGZvciBwcm9qZWN0aW9uICR7aXRlbS5wSWR9OiBgLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJldC5kb25lKSB7XG4gICAgICAgICAgdGhpcy5yZWFkeVF1ZXVlLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEludm9rZSBjYWxsYmFja1xuICAgICAgbGV0IHJlcztcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcyA9IGNiKHRoaXMucHJvamVjdGlvbkRhdGEuZ2V0KGl0ZW0ucElkKSwgaXRlbS5wSWQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBbR3lyZUpTXSBFcnJvciBpbnZva2luZyBsaXN0ZW5lciAoaWQ6ICR7aXRlbS5sc0lkfSkgZm9yIHByb2plY3Rpb24gJHtpdGVtLnBJZH06IGAsIGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpZiBpdCBpcyBhIGdlbmVyYXRvciBmdW5jdGlvblxuICAgICAgaWYgKHJlcyAmJiByZXMubmV4dCkge1xuICAgICAgICBjb25zdCByZXQgPSByZXMubmV4dCgpO1xuXG4gICAgICAgIGlmICghcmV0LmRvbmUpIHtcbiAgICAgICAgICBpdGVtLmdlbkZuID0gcmVzO1xuICAgICAgICAgIHRoaXMucmVhZHlRdWV1ZS5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByYW5PbmNlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB3ZSByYW4gb3V0IG9mIGJ1ZGdldC4gSWYgc28sIGluY3JlbWVudCBwcmlvcml0aWVzIHRvIHByZXZlbnQgc3RhcnZhdGlvbi5cbiAgICAvLyBIb3dldmVyLCBwcmlvcml0aWVzIGFib3ZlIDg5IGFyZSBmaXhlZC5cbiAgICBpZiAodGhpcy5yZWFkeVF1ZXVlLmxlbmd0aCkge1xuICAgICAgdGhpcy5yZWFkeVF1ZXVlLmZvckVhY2goKHFJdGVtKSA9PiB7XG4gICAgICAgIHFJdGVtLnByaW9yaXR5ICs9IHFJdGVtLnByaW9yaXR5IDwgODkgPyAxIDogMDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRpbWVzdGFtcCBpbiBtaWxsaXNlY29uZHMuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBnZXRDdXJyZW50VGltZSgpOiBudW1iZXIge1xuICAgIHJldHVybiBEYXRlLm5vdygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDYWxsYmFja0J5SWQobHNJZDogbnVtYmVyKTogRnVuY3Rpb24gfCBudWxsIHtcbiAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJzLmdldChsc0lkKTtcbiAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBsaXN0ZW5lci5jYjtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFkZElMaXN0ZW5lclRvUXVldWUobHNJZDogbnVtYmVyKSB7XG4gICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVycy5nZXQobHNJZCk7XG5cbiAgICBsaXN0ZW5lci5wSWRzLmZvckVhY2goKHBJZCkgPT4ge1xuICAgICAgaWYgKHRoaXMucHJvamVjdGlvbkRhdGEuaGFzKHBJZCkpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZUlMaXN0ZW5lcihsc0lkLCBwSWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZUlMaXN0ZW5lcihsc0lkOiBudW1iZXIsIHBJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVycy5nZXQobHNJZCk7XG5cbiAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgIGNvbnN0IHF1ZXVlSXRlbSA9IHtcbiAgICAgICAgcElkLFxuICAgICAgICBsc0lkLFxuICAgICAgICBwcmlvcml0eTogbGlzdGVuZXIucHJpb3JpdHksXG4gICAgICB9O1xuXG4gICAgICAvLyBDaGVjayBpZiBub3QgYWxyZWFkeSBpbiBxdWV1ZVxuICAgICAgaWYgKHRoaXMucmVhZHlRdWV1ZUlEbGlzdC5oYXMoU2NoZWR1bGVyLmNyZWF0ZUlERm9ySVF1ZXVlSXRlbShxdWV1ZUl0ZW0pKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBpID0gdGhpcy5yZWFkeVF1ZXVlLmxlbmd0aDtcbiAgICAgIGlmIChpID09PSAwIHx8IGxpc3RlbmVyLnByaW9yaXR5ID4gdGhpcy5yZWFkeVF1ZXVlW2kgLSAxXS5wcmlvcml0eSkge1xuICAgICAgICB0aGlzLmFkZEl0ZW1Ub1F1ZXVlKHF1ZXVlSXRlbSwgaSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucmVhZHlRdWV1ZVswXS5wcmlvcml0eSA+IGxpc3RlbmVyLnByaW9yaXR5KSB7XG4gICAgICAgIHRoaXMuYWRkSXRlbVRvUXVldWUocXVldWVJdGVtLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpID0gaSAtIDE7XG4gICAgICAgICAgaWYgKHRoaXMucmVhZHlRdWV1ZVtpXS5wcmlvcml0eSA8PSBsaXN0ZW5lci5wcmlvcml0eSkge1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtVG9RdWV1ZShxdWV1ZUl0ZW0sIGkgKyAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRJdGVtVG9RdWV1ZShxSXRlbTogSVF1ZXVlSXRlbSwgaWR4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoaWR4ID09PSAwKSB7XG4gICAgICB0aGlzLnJlYWR5UXVldWUudW5zaGlmdChxSXRlbSk7XG4gICAgfSBlbHNlIGlmIChpZHggPT09IHRoaXMucmVhZHlRdWV1ZS5sZW5ndGgpIHtcbiAgICAgIHRoaXMucmVhZHlRdWV1ZS5wdXNoKHFJdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWFkeVF1ZXVlLnNwbGljZShpZHgsIDAsIHFJdGVtKTtcbiAgICB9XG4gICAgdGhpcy5yZWFkeVF1ZXVlSURsaXN0LmFkZChTY2hlZHVsZXIuY3JlYXRlSURGb3JJUXVldWVJdGVtKHFJdGVtKSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjcmVhdGVJREZvcklRdWV1ZUl0ZW0ocUl0ZW06IElRdWV1ZUl0ZW0pOiBzdHJpbmcge1xuICAgIHJldHVybiBxSXRlbS5sc0lkICsgJy0nICsgcUl0ZW0ucElkO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgY2hlY2tJZlZhbGlkUHJvamVjdGlvbklkKHByb2plY3Rpb25JZDogc3RyaW5nIHwgc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gICAgLy8gSW5wdXQgY2hlY2tpbmdcbiAgICBpZiAodHlwZW9mIHByb2plY3Rpb25JZCAhPT0gJ3N0cmluZycgJiYgcHJvamVjdGlvbklkLmNvbnN0cnVjdG9yICE9PSBBcnJheSkge1xuICAgICAgdGhyb3cgJ1Byb2plY3Rpb25JZCBzaG91bGQgYmUgYShuIGFycmF5IG9mKSBzdHJpbmcocykgd2l0aCBub24temVybyBsZW5ndGguJztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcm9qZWN0aW9uSWQgPT09ICdzdHJpbmcnICYmIHByb2plY3Rpb25JZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93ICdQcm9qZWN0aW9uSWQgc2hvdWxkIGJlIGEobiBhcnJheSBvZikgc3RyaW5nKHMpIHdpdGggbm9uLXplcm8gbGVuZ3RoLic7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJvamVjdGlvbklkICE9PSAnc3RyaW5nJykge1xuICAgICAgcHJvamVjdGlvbklkLmZvckVhY2goKHBJZCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHBJZCAhPT0gJ3N0cmluZycgfHwgcElkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRocm93ICdQcm9qZWN0aW9uSWQgc2hvdWxkIGJlIGEobiBhcnJheSBvZikgc3RyaW5nKHMpIHdpdGggbm9uLXplcm8gbGVuZ3RoLic7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiAodHlwZW9mIHByb2plY3Rpb25JZCA9PT0gJ3N0cmluZycpID8gW3Byb2plY3Rpb25JZF0gOiBwcm9qZWN0aW9uSWQ7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=