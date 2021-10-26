import * as wasmModule from '../wast/module.wast';
const module = await WebAssembly.compile(wasmModule);
console.log(module);