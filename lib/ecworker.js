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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index_ecworker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ecmanager.ts":
/*!**************************!*\
  !*** ./src/ecmanager.ts ***!
  \**************************/
/*! exports provided: ECManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ECManager", function() { return ECManager; });
class ECManager {
    constructor() {
        this.projections = new Map();
        this.cmdHandlers = new Map();
        this.events = [];
        this.commands = [];
        this.changeList = new Map();
    }
    addProjection(id, projection) {
        this.projections.set(id, projection);
    }
    addCommandHandler(id, cmdHandler) {
        this.cmdHandlers.set(id, cmdHandler);
    }
    execute(cmds, evts) {
        this.events = this.events.concat(evts);
        this.commands = this.commands.concat(cmds);
        // Handle all commands and events until done.
        while (this.events.length || this.commands.length) {
            // Apply currently available events to the projections and tasks.
            this.handleEvents();
            // Run all command handlers.
            this.handleCommands();
        }
    }
    trigger(evt) {
        this.events.push(evt);
    }
    issue(cmd) {
        this.commands.push(cmd);
    }
    getChangeList() {
        const list = new Map(this.changeList);
        this.changeList.clear();
        return list;
    }
    handleEvents() {
        // Send event list to the tasks
        // TODO invoke tasks
        // Apply events to the projections
        while (this.events.length) {
            const evt = this.events.pop();
            this.projections.forEach((projection, id) => {
                if (projection.applyEvent(evt)) {
                    this.changeList.set(id, projection.getState());
                }
            });
        }
    }
    handleCommands() {
        while (this.commands.length) {
            const cmd = this.commands.pop();
            this.cmdHandlers.forEach((cmdHandler) => {
                cmdHandler(cmd, this.issue.bind(this), this.trigger.bind(this), this.getProjectionState.bind(this));
            });
        }
    }
    getProjectionState(id) {
        const projection = this.projections.get(id);
        if (projection) {
            return projection.getState();
        }
        return null;
    }
}


/***/ }),

/***/ "./src/index_ecworker.ts":
/*!*******************************!*\
  !*** ./src/index_ecworker.ts ***!
  \*******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ecmanager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ecmanager */ "./src/ecmanager.ts");

// Start the manager
new _ecmanager__WEBPACK_IMPORTED_MODULE_0__["ECManager"]();


/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9neXJlanMtW25hbWVbL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9neXJlanMtW25hbWVbL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2d5cmVqcy1bbmFtZVsvLi9zcmMvZWNtYW5hZ2VyLnRzIiwid2VicGFjazovL2d5cmVqcy1bbmFtZVsvLi9zcmMvaW5kZXhfZWN3b3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNoRU07SUFPSjtRQU5RLGdCQUFXLEdBQTRCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDakQsZ0JBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN0RCxXQUFNLEdBQWlCLEVBQUUsQ0FBQztRQUMxQixhQUFRLEdBQW1CLEVBQUUsQ0FBQztRQUM5QixlQUFVLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7SUFFbEMsQ0FBQztJQUVoQixhQUFhLENBQUMsRUFBVSxFQUFFLFVBQXNCO1FBQzlDLElBQUks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O0FBQ3BCLElBQUksb0RBQVMsRUFBRSxDQUFDIiwiZmlsZSI6ImVjd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJneXJlanMtW25hbWVbXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImd5cmVqcy1bbmFtZVtcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiZ3lyZWpzLVtuYW1lW1wiXSA9IGZhY3RvcnkoKTtcbn0pKHdpbmRvdywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4X2Vjd29ya2VyLnRzXCIpO1xuIiwiaW1wb3J0IHsgSUd5cmVDb21tYW5kLCBJR3lyZUV2ZW50LCBJQ29tbWFuZEhhbmRsZXIgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgUHJvamVjdGlvbiB9IGZyb20gJy4vcHJvamVjdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBFQ01hbmFnZXIge1xuICBwcml2YXRlIHByb2plY3Rpb25zOiBNYXA8c3RyaW5nLCBQcm9qZWN0aW9uPiA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSBjbWRIYW5kbGVyczogTWFwPHN0cmluZywgSUNvbW1hbmRIYW5kbGVyPiA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSBldmVudHM6IElHeXJlRXZlbnRbXSA9IFtdO1xuICBwcml2YXRlIGNvbW1hbmRzOiBJR3lyZUNvbW1hbmRbXSA9IFtdO1xuICBwcml2YXRlIGNoYW5nZUxpc3Q6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKCk7XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGFkZFByb2plY3Rpb24oaWQ6IHN0cmluZywgcHJvamVjdGlvbjogUHJvamVjdGlvbikge1xuICAgIHRoaXMucHJvamVjdGlvbnMuc2V0KGlkLCBwcm9qZWN0aW9uKTtcbiAgfVxuXG4gIGFkZENvbW1hbmRIYW5kbGVyKGlkOiBzdHJpbmcsIGNtZEhhbmRsZXI6IElDb21tYW5kSGFuZGxlcikge1xuICAgIHRoaXMuY21kSGFuZGxlcnMuc2V0KGlkLCBjbWRIYW5kbGVyKTtcbiAgfVxuXG4gIGV4ZWN1dGUoY21kczogSUd5cmVDb21tYW5kW10sIGV2dHM6IElHeXJlRXZlbnRbXSkge1xuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMuY29uY2F0KGV2dHMpO1xuICAgIHRoaXMuY29tbWFuZHMgPSB0aGlzLmNvbW1hbmRzLmNvbmNhdChjbWRzKTtcblxuICAgIC8vIEhhbmRsZSBhbGwgY29tbWFuZHMgYW5kIGV2ZW50cyB1bnRpbCBkb25lLlxuICAgIHdoaWxlICh0aGlzLmV2ZW50cy5sZW5ndGggfHwgdGhpcy5jb21tYW5kcy5sZW5ndGgpIHtcbiAgICAgIC8vIEFwcGx5IGN1cnJlbnRseSBhdmFpbGFibGUgZXZlbnRzIHRvIHRoZSBwcm9qZWN0aW9ucyBhbmQgdGFza3MuXG4gICAgICB0aGlzLmhhbmRsZUV2ZW50cygpO1xuXG4gICAgICAvLyBSdW4gYWxsIGNvbW1hbmQgaGFuZGxlcnMuXG4gICAgICB0aGlzLmhhbmRsZUNvbW1hbmRzKCk7XG4gICAgfVxuICB9XG5cbiAgdHJpZ2dlcihldnQ6IElHeXJlRXZlbnQpIHtcbiAgICB0aGlzLmV2ZW50cy5wdXNoKGV2dCk7XG4gIH1cblxuICBpc3N1ZShjbWQ6IElHeXJlQ29tbWFuZCkge1xuICAgIHRoaXMuY29tbWFuZHMucHVzaChjbWQpO1xuICB9XG5cbiAgZ2V0Q2hhbmdlTGlzdCgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICBjb25zdCBsaXN0ID0gbmV3IE1hcCh0aGlzLmNoYW5nZUxpc3QpO1xuICAgIHRoaXMuY2hhbmdlTGlzdC5jbGVhcigpO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVFdmVudHMoKSB7XG4gICAgLy8gU2VuZCBldmVudCBsaXN0IHRvIHRoZSB0YXNrc1xuICAgIC8vIFRPRE8gaW52b2tlIHRhc2tzXG5cbiAgICAvLyBBcHBseSBldmVudHMgdG8gdGhlIHByb2plY3Rpb25zXG4gICAgd2hpbGUgKHRoaXMuZXZlbnRzLmxlbmd0aCkge1xuICAgICAgY29uc3QgZXZ0ID0gdGhpcy5ldmVudHMucG9wKCk7XG5cbiAgICAgIHRoaXMucHJvamVjdGlvbnMuZm9yRWFjaCgocHJvamVjdGlvbiwgaWQpID0+IHtcbiAgICAgICAgaWYgKHByb2plY3Rpb24uYXBwbHlFdmVudChldnQpKSB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VMaXN0LnNldChpZCwgcHJvamVjdGlvbi5nZXRTdGF0ZSgpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVDb21tYW5kcygpIHtcbiAgICB3aGlsZSAodGhpcy5jb21tYW5kcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNtZCA9IHRoaXMuY29tbWFuZHMucG9wKCk7XG4gICAgICB0aGlzLmNtZEhhbmRsZXJzLmZvckVhY2goKGNtZEhhbmRsZXI6IElDb21tYW5kSGFuZGxlcikgPT4ge1xuICAgICAgICBjbWRIYW5kbGVyKGNtZCwgdGhpcy5pc3N1ZS5iaW5kKHRoaXMpLCB0aGlzLnRyaWdnZXIuYmluZCh0aGlzKSwgdGhpcy5nZXRQcm9qZWN0aW9uU3RhdGUuYmluZCh0aGlzKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFByb2plY3Rpb25TdGF0ZShpZDogc3RyaW5nKTogYW55IHtcbiAgICBjb25zdCBwcm9qZWN0aW9uID0gdGhpcy5wcm9qZWN0aW9ucy5nZXQoaWQpO1xuICAgIGlmIChwcm9qZWN0aW9uKSB7XG4gICAgICByZXR1cm4gcHJvamVjdGlvbi5nZXRTdGF0ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRUNNYW5hZ2VyIH0gZnJvbSAnLi9lY21hbmFnZXInO1xuXG4vLyBTdGFydCB0aGUgbWFuYWdlclxubmV3IEVDTWFuYWdlcigpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==