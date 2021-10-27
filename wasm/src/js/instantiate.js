// WebAssembly.compile
fetch("../dist/func.wasm").then(resp => resp.arrayBuffer()).then(buffer => {
  return WebAssembly.compile(buffer);
}).then((module) => {
  console.log(module);
});

// WebAssembly.compileStreaming
WebAssembly.compileStreaming(fetch("../dist/func.wasm")).then(module => {
  console.log(module);
});

// WebAssembly.instantiate
fetch("../dist/func.wasm").then(resp => resp.arrayBuffer()).then(buffer => {
  return WebAssembly.instantiate(buffer);
}).then((result) => {
  console.log(result);
});

// WebAssembly.instantiateStreaming
WebAssembly.instantiateStreaming(fetch("../dist/func.wasm")).then(result => {
  console.log(result);
  console.log(result.instance.exports.minus(2, 1));
});