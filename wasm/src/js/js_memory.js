const memory = new WebAssembly.Memory({
  initial: 1, // 初始为1页大小，也即64Kb
  maximum: 10, // 最大为10页，也即640Kb
  // 如果要支持wasm的threads多线程，需要设置shared: true
  // 这样memory将生成 SharedArrayBuffer 而不是 ArrayBuffer
  // shared: true
});
const consoleLogString = (offset, length) => {
  const bytes = new Uint8Array(memory.buffer, offset, length);
  const string = new TextDecoder("utf8").decode(bytes);
  console.log(string);
};
const importObj = {
  js: {
    memory,
  },
  console: {
    log: consoleLogString,
  },
};

// 假设wat编译后的wasm文件名为memory.wasm
WebAssembly.instantiateStreaming(fetch("../dist/js_memory.wasm"), importObj).then(
  ({ instance }) => {
    const { writeHi } = instance.exports;
    writeHi(); // 输出 "Hi"
  }
);