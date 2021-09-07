# WebAssembly 文本格式解析

`WebAssembly` 支持二进制(Binary Format)格式和文本格式(Text Format)两种表达方式。文本格式的表达方式类似于汇编，具有较好的可读性；而二进制格式类似于机器码，不过它是一套虚拟指令，需要宿主环境（比如浏览器）编译成平台相关的真实的机器码来运行。我们在浏览器中使用的`.wasm`后缀的文件都是二进制的表达格式的，因此如果你是手写的文本格式的`WebAssembly`代码，需要转换成二进制格式，这里就需要用到官方提供的`WebAssembly`格式转换工具[Wabt](https://github.com/WebAssembly/wabt)。如果使用了 Webpack，可以使用 [wasm-loader](https://github.com/xtuc/webassemblyjs/tree/master/packages/wast-loader) loader 插件。

## 文本格式语法

### 术语

- S-Expression，S(Symbol 符号) 表达式: S 表达式以在`Lisp`语言中的使用被大家所熟知，在`Lisp`中它既充当了数据结构的表达、也充当了代码的书写结构。`WebAssembly Text Format` 也使用 S 表达式的书写方式。

- Stack-Machines：虚拟机（Virtual Machine）根据指令的实现方式，有基于寄存器（Register-Machines）和基于栈（Stack-Machines）两种形式，两者的差别可以参看[知乎的这篇回答](https://www.zhihu.com/question/35777031)，总的来说，栈式的虚拟机实现更加简单，在有`JIT(Just-In-Time)`即时编译支持下，两种方式的代码执行效率基本等同。`Wasm` 就是选用的栈式虚拟机的实现方式。

### `module` 模块

在 README 中已经介绍过 `Wasm` 以模块化的方式组织代码，所以一个 `wasm` 文件就是一个模块，一个最简单的 `wat` 文件可能就只包括以下代码。

```wasm
(module) ;; 一个空模块
```

在规范里，模块可以增加命名，当然也就可以并排书写多个模块，但是目前的编译器和浏览器暴露的 API 还只能使用一个模块的形式，所以暂时只需要知道它支持这样的写法就可以了。

```wasm
(module $m1)
(module $m2)
```

### `comment` 注释

你应该注意到，在上面的 `Module` 的代码中有注释的存在，在 `wasm` 文本格式 `wat` 中，单行注释都使用两个分号作为开头 `;;`，后面作为注释的内容。对于 `wasm` 的二进制表达形式，因为代码是以一行一个指令的形式，所以使用单行注释就足够了。但在文本格式的表达形式中，我们经常还会用到块级注释，为了将块级注释更好的融入在 S 表达式内，块级注释以 `(;` 作为开始，`;)` 作为结束。

```wasm
;; 这是一个行注释
(module (;这是一个块注释;))
```

### `func` 函数

函数是 `wasm` 里最为重要的部分，是 `wasm` 与所在环境进行交互的主要入口。先来看看函数的书写方式：

```wasm
(func <name?|export?> <params> <locals> <result> <body>)
```

```wasm
(module (
  ;; 该函数接受两个i32类型的参数，返回一个i32类型的值
  ;; 其中`func`,`param`,`result` 都是固定的关键字
  ;; local.get INDEX 指令用来可以获取外部传入的参数，INDEX值从0开始表示参数的索引
  ;; local.get 同时会将值压入栈中，上面提到的栈式虚拟机
  ;; i32.add 指令会从栈中取出两个值，相加后会将结果压入栈中，最后栈内的值就会成为返回值
  ;; 如果最终运行栈内值不为空，wasm会对返回值result进行验证
  func (param i32) (param i32)
       (result i32)
       local.get 0
       local.get 1
       i32.add
))
```
