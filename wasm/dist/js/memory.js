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

/***/ "./src/js/memory.js":
/*!**************************!*\
  !*** ./src/js/memory.js ***!
  \**************************/
/***/ (() => {

eval("WebAssembly.instantiateStreaming(fetch(\"../dist/memory.wasm\")).then(({\n  instance\n}) => {\n  const {\n    MEMORY\n  } = instance.exports; // 此时MEMORY为WebAssembly.Memory的实例，可以通过其上的buffer字段获取到一个ArrayBuffer对象\n\n  const {\n    buffer\n  } = MEMORY; // 由于wat里的字符串都是以8位存储的，所以我们可以通过TypedArray里的Uint8Array来进行处理\n\n  const data = new Uint8Array(buffer); // 通过使用TextDecoder可以来对buffer进行解码\n  // 这里采用utf-8来进行解码，是因为目前wasm对data存储的字符串数据格式更适合\n  // 且utf-8相对于utf-16/utf-32等编码占用更小的内存空间\n\n  const decoder = new TextDecoder(\"utf-8\");\n  console.log(decoder.decode(data)); // 输出 \"Hiice\"\n});\n\n//# sourceURL=webpack://first-wasm/./src/js/memory.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/memory.js"]();
/******/ 	
/******/ })()
;