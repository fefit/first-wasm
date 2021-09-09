# C/C++ 使用 WebAssembly

C/C++ 使用 WebAssembly 用到的主要工具为 [Emscripten](https://github.com/emscripten-core/emscripten)，我们可以按照 [官方安装使用文档](https://emscripten.org/docs/getting_started/downloads.html) 来配置好本地环境。

## 关于 Emscripten

现在来简单介绍一下 `Emscripten` 这个工具：

- 提供了一个 CLI 命令行工具 `emcc` 用来将任何以 `LLVM` 作为编译后端的语言代码编译成 `wasm` 代码，编译的目标环境可以是(在这里我们统称为宿主环境)浏览器、Nodejs 或者其它支持 `wasmruntime` 的运行环境。

- 提供了一套 API 用来将语言代码编译为 `wasm` 代码、以及在语言中通过使用 API 来与宿主环境进行交互的能力。具体的 API 支持的功能可以参看[官网 API](https://emscripten.org/docs/api_reference/index.html)的介绍。
