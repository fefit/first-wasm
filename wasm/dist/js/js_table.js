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

/***/ "./src/js/js_table.js":
/*!****************************!*\
  !*** ./src/js/js_table.js ***!
  \****************************/
/***/ (() => {

eval("const table = new WebAssembly.Table({\n  initial: 1,\n  element: \"anyfunc\" // \"funcref\"\n\n});\nconst importObj = {\n  js: {\n    table\n  }\n}; // 假设上述的wat编译后的wasm文件名为table.wasm\n\nWebAssembly.instantiateStreaming(fetch(\"../dist/js_table.wasm\"), importObj).then(({\n  instance\n}) => {\n  const {\n    exec,\n    add100,\n    sub100\n  } = instance.exports; // 设置table的第一个函数为\n\n  table.set(0, add100);\n\n  for (let i = 0; i < 10; i++) {\n    console.log(exec(0, i));\n  } // 以上将输出100到109\n  // console.log(exec(1, 100)); // 这里将报错，因为table的大小为1，只能保存一个函数，索引1超过了它的范围\n  // table.set(1, sub100); // 这里也将报错，set操作的索引值也必须在table的范围之内\n  // 正确的方式是先通过grow来增长table的大小\n\n\n  table.grow(1);\n  table.set(1, sub100);\n\n  for (let i = 0; i < 10; i++) {\n    console.log(exec(1, i));\n  } // 以上将输出-100 到 -91\n\n});\n\n//# sourceURL=webpack://first-wasm/./src/js/js_table.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/js_table.js"]();
/******/ 	
/******/ })()
;