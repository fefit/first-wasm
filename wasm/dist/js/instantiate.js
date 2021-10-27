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

/***/ "./src/js/instantiate.js":
/*!*******************************!*\
  !*** ./src/js/instantiate.js ***!
  \*******************************/
/***/ (() => {

eval("// WebAssembly.compile\nfetch(\"../dist/func.wasm\").then(resp => resp.arrayBuffer()).then(buffer => {\n  return WebAssembly.compile(buffer);\n}).then(module => {\n  console.log(module);\n}); // WebAssembly.compileStreaming\n\nWebAssembly.compileStreaming(fetch(\"../dist/func.wasm\")).then(module => {\n  console.log(module);\n}); // WebAssembly.instantiate\n\nfetch(\"../dist/func.wasm\").then(resp => resp.arrayBuffer()).then(buffer => {\n  return WebAssembly.instantiate(buffer);\n}).then(result => {\n  console.log(result);\n}); // WebAssembly.instantiateStreaming\n\nWebAssembly.instantiateStreaming(fetch(\"../dist/func.wasm\")).then(result => {\n  console.log(result);\n  console.log(result.instance.exports.minus(2, 1));\n});\n\n//# sourceURL=webpack://first-wasm/./src/js/instantiate.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/instantiate.js"]();
/******/ 	
/******/ })()
;