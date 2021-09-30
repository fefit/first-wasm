# Rust 使用 WebAssembly

Rust 对 `wasm` 有非常好的支持，官方也有很好的工具包用来支持 `wasm` 的开发，这里我们以使用官方工具 [wasm-pack](https://github.com/rustwasm/wasm-pack) 为例，一步步来完成一整套基础的开发流程。

## 配置环境

1. 首先，需要确保你已经在机器上安装好了 `rust`，如果还没有安装，请参照 [Rust 官方安装流程](https://www.rust-lang.org/tools/install) 进行安装。

2. 安装 `wasm-pack` 命令行工具，[wasm-pack 安装](https://rustwasm.github.io/wasm-pack/installer/)。

3. 使用 `wasm-pack new xxx` 创建项目(xxx 为项目名称)。

准备好以上工作，你就有了一个支持 `wasm` 开发的项目了。更详细的基础流程可以参看：[wasm-pack 文档](https://rustwasm.github.io/docs/wasm-pack/quickstart.html)。
