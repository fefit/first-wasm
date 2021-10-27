const importObject = {
  console: {
    log: function (arg) {
      console.log(arg);
    },
  },
};
WebAssembly.instantiateStreaming(fetch("../dist/import.wasm"), importObject).then(result => {
  result.instance.exports.logIt();
});