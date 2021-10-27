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

/***/ "./src/js/global.js":
/*!**************************!*\
  !*** ./src/js/global.js ***!
  \**************************/
/***/ (() => {

eval("const info = new WebAssembly.Global({\n  value: \"i32\"\n}, 10);\nconst times = new WebAssembly.Global({\n  value: \"i32\",\n  // 值类型，i32|i64|f32|f64\n  mutable: true // 是否可变\n\n}, 0 // 使用第二个参数赋予初始值\n);\nWebAssembly.instantiateStreaming(fetch(\"../dist/global.wasm\"), {\n  global: {\n    info,\n    times\n  },\n  console: {\n    log: function (arg) {\n      console.log(arg);\n    }\n  }\n}).then(({\n  instance\n}) => {\n  instance.exports.logIt();\n  let i;\n\n  for (i = 0; i < 10; i++) {\n    instance.exports.tick(); // global对象上有value属性，可以获取到当前对象的值\n\n    console.log(times.value);\n  } // 上面循环将依次输出值：\"1\" \"2\" ... \"10\"\n\n\n  times.value = 100;\n\n  for (i = 0; i < 10; i++) {\n    instance.exports.tick();\n    console.log(times.value);\n  } // 上面循环将依次输出值：\"101\" \"102\" ... \"110\"\n\n});\n\n//# sourceURL=webpack://first-wasm/./src/js/global.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/global.js"]();
/******/ 	
/******/ })()
;