# First-Wasm

WebAssembly 的入门指南，主要资料来自 [MDN](https://developer.mozilla.org/en-US/docs/WebAssembly) 及 [WebAssembly 官方网站](https://webassembly.org/)以及个人对 WebAssembly 的理解。

## 目录结构

- [/c](./c/README.md)

`C/C++` 如何使用 `Wasm`，并提供了示例教程。

- [/rust](./rust/README.md)

`Rust` 如何使用 `Wasm`，并提供了示例教程。

- [/assemblyscript](./assemblyscript/README.md)

`AssemblyScript` 如何使用 `Wasm`，并提供了示例教程。

- [/wasm](./wasm/README.md)

`WebAssembly` 相关的知识点，主要参考自 MDN 文档 及官方文档的介绍。

## 工具集

用到的工具集包括：

- [wabt](https://github.com/WebAssembly/wabt) 使用 `wasm` 主要的工具集，包括 `wat2wasm` [wasm 文本格式转换成 wasm](https://webassembly.github.io/wabt/demo/wat2wasm/) 以及 `wasm2wat` [wasm 二进制格式转文本格式](https://webassembly.github.io/wabt/demo/wat2wasm/)、`wasm-objdump` [查看 wasm 信息工具](https://webassembly.github.io/wabt/doc/wasm-objdump.1.html) 等。

- [emscripten](https://github.com/emscripten-core/emscripten) 使用 c/c++ 生成 wasm 的工具集，以及 [WasmFiddle 在线工具](https://wasdk.github.io/WasmFiddle/)。

- [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) 使用 rust 使用 wasm 的库包，以及将 rust 代码打包到 wasm 的工具 [wasm-pack](https://github.com/rustwasm/wasm-pack)。

- [AssemblyScript](https://github.com/AssemblyScript/assemblyscript) 使用 AssemblyScript 来生成 wasm 代码。

## 纠错与反馈

由于文章部分内容来自于个人的理解，如果您发现文章中有表述错误、逻辑错误、书写错误，欢迎提[issue](./issues)进行反馈。
