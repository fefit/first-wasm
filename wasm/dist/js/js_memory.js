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

/***/ "./src/js/js_memory.js":
/*!*****************************!*\
  !*** ./src/js/js_memory.js ***!
  \*****************************/
/***/ (() => {

eval("const memory = new WebAssembly.Memory({\n  initial: 1,\n  // 初始为1页大小，也即64Kb\n  maximum: 10 // 最大为10页，也即640Kb\n  // 如果要支持wasm的threads多线程，需要设置shared: true\n  // 这样memory将生成 SharedArrayBuffer 而不是 ArrayBuffer\n  // shared: true\n\n});\n\nconst consoleLogString = (offset, length) => {\n  const bytes = new Uint8Array(memory.buffer, offset, length);\n  const string = new TextDecoder(\"utf8\").decode(bytes);\n  console.log(string);\n};\n\nconst importObj = {\n  js: {\n    memory\n  },\n  console: {\n    log: consoleLogString\n  }\n}; // 假设wat编译后的wasm文件名为memory.wasm\n\nWebAssembly.instantiateStreaming(fetch(\"../dist/js_memory.wasm\"), importObj).then(({\n  instance\n}) => {\n  const {\n    writeHi\n  } = instance.exports;\n  writeHi(); // 输出 \"Hi\"\n});\n\n//# sourceURL=webpack://first-wasm/./src/js/js_memory.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/js_memory.js"]();
/******/ 	
/******/ })()
;