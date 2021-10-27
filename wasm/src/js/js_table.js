const table = new WebAssembly.Table({
  initial: 1,
  element: "anyfunc", // "funcref"
});
const importObj = {
  js: {
    table,
  },
};
// 假设上述的wat编译后的wasm文件名为table.wasm
WebAssembly.instantiateStreaming(fetch("../dist/js_table.wasm"), importObj).then(
  ({ instance }) => {
    const { exec, add100, sub100 } = instance.exports;
    // 设置table的第一个函数为
    table.set(0, add100);
    for (let i = 0; i < 10; i++) {
      console.log(exec(0, i));
    }
    // 以上将输出100到109
    // console.log(exec(1, 100)); // 这里将报错，因为table的大小为1，只能保存一个函数，索引1超过了它的范围
    // table.set(1, sub100); // 这里也将报错，set操作的索引值也必须在table的范围之内
    // 正确的方式是先通过grow来增长table的大小
    table.grow(1);
    table.set(1, sub100);
    for (let i = 0; i < 10; i++) {
      console.log(exec(1, i));
    }
    // 以上将输出-100 到 -91
  }
);