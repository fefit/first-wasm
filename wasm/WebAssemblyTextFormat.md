# WebAssembly 文本格式解析

`WebAssembly` 支持二进制(Binary Format)格式和文本格式(Text Format)两种表达方式。文本格式的表达方式类似于汇编，具有较好的可读性；而二进制格式类似于机器码，不过它是一套虚拟指令，需要宿主环境（比如浏览器）编译成平台相关的真实的机器码来运行。我们在浏览器中使用的`.wasm`后缀的文件都是二进制的表达格式的，因此如果你是手写的文本格式的`WebAssembly`代码，需要转换成二进制格式，这里就需要用到官方提供的`WebAssembly`格式转换工具[Wabt](https://github.com/WebAssembly/wabt)。如果使用了 Webpack，可以使用 [wasm-loader](https://github.com/xtuc/webassemblyjs/tree/master/packages/wast-loader) loader 插件。

## 文档约定

在下面的描述中，将用 `wasm` 简写来表示 `WebAssembly`，在不同场景下，也用 `wasm` 来替代表示它所支持的二进制和文本两种格式；同时，用 `wat` 简写来表示 `WebAssemblyTextFormat` 的文本表达格式。
## 文本格式语法

### 术语

- S-Expression，S(Symbol 符号) 表达式: S 表达式以在`Lisp`语言中的使用被大家所熟知，在`Lisp`中它既充当了数据结构的表达、也充当了代码的书写结构。`wat` 也使用 S 表达式的书写方式。

- Stack-Machines：虚拟机（Virtual Machine）根据指令的实现方式，有基于寄存器（Register-Machines）和基于栈（Stack-Machines）两种形式，两者的差别可以参看[知乎的这篇回答](https://www.zhihu.com/question/35777031)，总的来说，栈式的虚拟机实现更加简单，在有`JIT(Just-In-Time)`即时编译支持下，两种方式的代码执行效率基本等同。`Wasm` 就是选用的栈式虚拟机的实现方式。

### 前提知识准备

- Identifiers，标识符：在 `wat` 中，标识符经常用在函数名、参数名、模块名等，它以 `$` 符号开头，后面可以是数字、大小写英文字母，另外也包括一些ASCII的标点符号。在 [官网Identifiers描述范式](https://webassembly.github.io/spec/core/text/values.html#text-id) 中可以看到详细定义。

- Types，类型：在 `wat` 中，我们经常用到的主要是它的数据类型，`wasm` 支持以下4种数据类型：
  
  - `i32` : 32位整数
  - `i64` : 64位整数
  - `f32` : 32位浮点数
  - `f64` : 64位浮点数
  
  其它包括引用类型等 [更多类型的定义范式](https://webassembly.github.io/spec/core/text/types.html) 可以在官网中查看。

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
;; 函数签名
(func <name?|export?> <params?> <result?> <locals?> <body>)
```

#### 示例1：

功能：实现两个数字相加。

```wasm
(module 
  ;; 该函数接受两个i32类型的参数，返回一个i32类型的值
  ;; 其中`func`,`param`,`result` 都是固定的关键字
  ;; local.get INDEX 指令用来可以获取调用者传入的参数，INDEX值从0开始表示参数的索引
  ;; local.get 同时会将值压入栈中，上面提到的栈式虚拟机
  ;; i32.add 指令会从栈中取出两个值，相加后会将结果压入栈中，最后栈内的值就会成为返回值
  ;; 如果最终运行栈内值不为空，wasm会对返回值result进行验证
  (func (param i32) (param i32)
       (result i32)
       local.get 0 
       local.get 1
       i32.add) ;; 此时栈顶为第2个参数，也即(INDEX 1)，栈底为第一个参数(INDEX 0)，它们将先后被出栈供i32.add调用
)
```

- 参数合并

示例1中，我们获取参数都使用的索引值，在参数量较小、函数体逻辑较简单的情况下勉强还能保持可读性，这里我们甚至可以为了表达更简单，可以将两个参数合并，合并的写法如下：

```wasm
;; 这里故意使用两个不同类型的参数，便于更加理解指令的栈式操作
(module 
  (func (param i32 f64) (result i32)
       local.get 0 
       local.get 1
       i32.trunc_f64_s ;; 将栈顶也即第二个参数由f64类型转换为i32类型
       i32.add)
)
```

- 命名参数

由上可见，如果参数过多或者函数体内的操作逻辑比较复杂时，通过索引的方式获取参数就会变得比较混乱，所以大部分时候对参数进行命名是个比较好的实践习惯。

```wasm
(module 
  (func (param $first i32) (param $second i32)
       (result i32)
       local.get $first 
       local.get $second
       i32.add)
)
```

- 内部变量

上面用到的数据都来自于外部调用时的传入参数，但如果我需要定义一个内部用的数据，该怎么办呢？这时候我们就需要用到`local`了，注意 `local` 的位置需要定义在 `result` 之后（如果有的话），这跟我们在TS里先声明函数参数、返回值，然后再声明内部变量是类似的。

```wasm
(module 
  (func (param $first i32) (param $second i32) (result i32) (local $third i32)
       ;; 设置本地变量$third为100
       local.set $third (i32.const 100)
       ;; 将外部传入的两个参数相加
       local.get $first ;; <=> 等价于按索引 local.get 0
       local.get $second ;; <=> 等价于按索引 local.get 1
       i32.add
       ;; 此时栈中包含两个参数的结果值，继续往栈中Push进$third
       local.get $third ;; <=> 等价于按索引 local.get 2
       i32.add
       )
)
```

- 命名函数

上述函数没有命名，也没有导出，在实际使用中没有太大的意义，一般我们都会给函数加上命名，方便导出时使用或者供内部调用。

```wasm
(module 
  ;; 为函数增加命名，内部函数可以通过 `call $add` 来进行调用
  (func $add (param $first i32) (param $second i32)
       (result i32)
       local.get $first 
       local.get $second
       i32.add)
  ;; 以重命名的形式导出函数
  (export "add" (func $add))
)
```
- 直接导出

如果我们的函数不在内部进行调用，也可以用直接增加导出到表达式中的方式减少代码量。

```wasm
(module 
  ;; 抛开内部调用，以下代码和上面的命名然后导出是一致的
  (func (export "add") (param $first i32) (param $second i32)
       (result i32)
       local.get $first 
       local.get $second
       i32.add)
)
```