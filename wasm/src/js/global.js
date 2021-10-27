const info = new WebAssembly.Global({
  value: "i32"
}, 10);
const times = new WebAssembly.Global(
  {
    value: "i32", // 值类型，i32|i64|f32|f64
    mutable: true, // 是否可变
  },
  0 // 使用第二个参数赋予初始值
);
WebAssembly.instantiateStreaming(fetch("../dist/global.wasm"), {
  global: { info, times }, console: {
    log: function (arg) {
      console.log(arg);
    },
  },
}).then(
  ({ instance }) => {
    instance.exports.logIt();
    let i;
    for (i = 0; i < 10; i++) {
      instance.exports.tick();
      // global对象上有value属性，可以获取到当前对象的值
      console.log(times.value);
    }
    // 上面循环将依次输出值："1" "2" ... "10"
    times.value = 100;
    for (i = 0; i < 10; i++) {
      instance.exports.tick();
      console.log(times.value);
    }
    // 上面循环将依次输出值："101" "102" ... "110"
  }
);