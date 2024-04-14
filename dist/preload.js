/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/preload.ts ***!
  \************************/

const { ipcRenderer, contextBridge, dialog } = __webpack_require__(/*! electron */ "electron");
contextBridge.exposeInMainWorld('ShowError', {
    sendMain: (title, message) => {
        ipcRenderer.send('show-error', title, message);
    }
});
contextBridge.exposeInMainWorld('UnRedo', {
    sendUndoRedoAction: (payload) => ipcRenderer.invoke('UnRedo-action', payload),
    on: (channel, func) => {
        ipcRenderer.on(channel, (event, action, count) => func(action, count));
    },
    off: (channel, func) => {
        ipcRenderer.removeListener(channel, func);
    }
});
contextBridge.exposeInMainWorld('InsertURL', {
    sendURL: (ImageURL) => {
        ipcRenderer.invoke('load-URL', ImageURL);
    },
    on: (channel, func) => {
        ipcRenderer.on(channel, (_, ImageURL) => func(ImageURL));
    },
    off: (channel, func) => {
        ipcRenderer.removeListener(channel, func);
    }
});

})();

/******/ })()
;
//# sourceMappingURL=preload.js.map