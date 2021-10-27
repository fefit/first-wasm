WebAssembly.instantiateStreaming(fetch("../dist/memory.wasm")).then(({ instance }) => {
  const { MEMORY } = instance.exports;
  // 此时MEMORY为WebAssembly.Memory的实例，可以通过其上的buffer字段获取到一个ArrayBuffer对象
  const { buffer } = MEMORY;
  // 由于wat里的字符串都是以8位存储的，所以我们可以通过TypedArray里的Uint8Array来进行处理
  const data = new Uint8Array(buffer);
  // 通过使用TextDecoder可以来对buffer进行解码
  // 这里采用utf-8来进行解码，是因为目前wasm对data存储的字符串数据格式更适合
  // 且utf-8相对于utf-16/utf-32等编码占用更小的内存空间
  const decoder = new TextDecoder("utf-8");
  console.log(decoder.decode(data)); // 输出 "Hiice"
});