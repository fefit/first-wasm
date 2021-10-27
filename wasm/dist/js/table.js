/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/table.js":
/*!*************************!*\
  !*** ./src/js/table.js ***!
  \*************************/
/***/ (() => {

eval("WebAssembly.instantiateStreaming(fetch(\"../dist/table.wasm\")).then(({\n  instance\n}) => {\n  const {\n    calc\n  } = instance.exports;\n\n  const execute = (method, a, b) => {\n    switch (method) {\n      case \"sub\":\n        return calc(1, a, b);\n\n      case \"add\":\n      default:\n        return calc(0, a, b);\n    }\n  };\n\n  console.log(execute(\"add\", 2, 1)); // \"3\"\n\n  console.log(execute(\"sub\", 2, 1)); // \"1\"\n});\n\n//# sourceURL=webpack://first-wasm/./src/js/table.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/table.js"]();
/******/ 	
/******/ })()
;