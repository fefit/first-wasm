WebAssembly.instantiateStreaming(fetch("../dist/table.wasm")).then(({ instance }) => {
  const { calc } = instance.exports;
  const execute = (method, a, b) => {
    switch (method) {
      case "sub":
        return calc(1, a, b);
      case "add":
      default:
        return calc(0, a, b);
    }
  };
  console.log(execute("add", 2, 1)); // "3"
  console.log(execute("sub", 2, 1)); // "1"
});