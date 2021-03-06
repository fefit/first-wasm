# WebAssembly 文本格式解析

`WebAssembly` 支持二进制(Binary Format)格式和文本格式(Text Format)两种表达方式。文本格式的表达方式类似于汇编，具有较好的可读性；而二进制格式类似于机器码，不过它是一套虚拟指令，需要宿主环境（比如浏览器）编译成平台相关的真实的机器码来运行。我们在浏览器中使用的`.wasm`后缀的文件都是二进制的表达格式的，因此如果你是手写的文本格式的`WebAssembly`代码，需要转换成二进制格式，这里就需要用到官方提供的`WebAssembly`格式转换工具[Wabt](https://github.com/WebAssembly/wabt)。如果使用了 Webpack，可以使用 [wasm-loader](https://github.com/xtuc/webassemblyjs/tree/master/packages/wast-loader) loader 插件。

## 文档约定

在下面的描述中，将用 `wasm` 简写来表示 `WebAssembly`，在不同场景下，也用 `wasm` 来替代表示它所支持的二进制和文本两种格式；同时，用 `wat` 简写来表示 `WebAssemblyTextFormat` 的文本表达格式。

## 文本格式语法

### 术语

- S-Expression，S(Symbol 符号) 表达式: S 表达式以在`Lisp`语言中的使用被大家所熟知，在`Lisp`中它既充当了数据结构的表达、也充当了代码的书写结构。`wat` 也使用 S 表达式的书写方式。

- Stack-Machines：虚拟机（Virtual Machine）根据指令的实现方式，有基于寄存器（Register-Machines）和基于栈（Stack-Machines）两种形式，两者的差别可以参看[知乎的这篇回答](https://www.zhihu.com/question/35777031)，总的来说，栈式的虚拟机实现更加简单，在有`JIT(Just-In-Time)`即时编译支持下，两种方式的代码执行效率基本等同。`Wasm` 就是选用的栈式虚拟机的实现方式。

### 前提知识/工具准备

- Identifiers，标识符：在 `wat` 中，标识符经常用在函数名、参数名、模块名等，它以 `$` 符号开头，后面可以是数字、大小写英文字母，另外也包括一些 ASCII 的标点符号。在 [官网 Identifiers 描述范式](https://webassembly.github.io/spec/core/text/values.html#text-id) 中可以看到详细定义。

- Types，类型：在 `wat` 中，我们经常用到的主要是它的数据类型，`wasm` 支持以下 4 种数据类型：

  - `i32` : 32 位整数
  - `i64` : 64 位整数
  - `f32` : 32 位浮点数
  - `f64` : 64 位浮点数

  其它包括引用类型等 [更多类型的定义范式](https://webassembly.github.io/spec/core/text/types.html) 可以在官网中查看。

- Tools，工具：官方提供了[github:wabt 代码转换工具](https://github.com/WebAssembly/wabt)，下面讲到的示例代码都可以在该工具包提供的[在线示例工具](https://webassembly.github.io/wabt/demo/wat2wasm/)将`wat`的代码转换为`wasm`代码。

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
(func <name?|export?> <parameters?> <result?> <locals?> <body?>)
```

关于 `func` 的更多相关语法可以从[官方 func 书写规范](https://webassembly.github.io/spec/core/text/modules.html#functions)中查看。

#### 示例 1：

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

示例 1 中，我们获取参数都使用的索引值，在参数量较小、函数体逻辑较简单的情况下勉强还能保持可读性，这里我们甚至可以为了表达更简单，可以将两个参数合并，合并的写法如下：

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

由上可见，如果参数过多或者函数体内的操作逻辑比较复杂时，通过索引的方式获取参数就会变得比较混乱，所以大部分时候对参数进行命名是个比较好的实践习惯。(注：编译后的二进制代码中还是使用的数字索引)

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

上面用到的数据都来自于外部调用时的传入参数，但如果我需要定义一个内部用的数据，该怎么办呢？这时候我们就需要用到`local`了，注意 `local` 的位置需要定义在 `result` 之后（如果有的话），这跟我们在 TS 里先声明函数参数、返回值，然后再声明内部变量是类似的。

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

上述函数没有命名，也没有导出，如果只是在内部调用，我们只能通过函数静态索引（下标从 0 开始）的方式来进行调用，但如果是手写`wat`代码，这样看起来就非常不直观，所以一般我们都会给函数加上命名，方便导出时使用或者供内部调用（编译成二进制 BinaryFormat 后都只有下标的形式）。

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

关于 `export` 导出的相关语法可以从[官方 export 书写规范](https://webassembly.github.io/spec/core/text/modules.html#exports)中查看。

- 直接导出

如果我们的函数不在内部进行调用，也可以用直接增加导出到表达式中的方式减少代码量。

```wasm
(module
  ;; 抛开内部调用，以下代码和上面的命名函数加导出是一致的
  (func (export "add") (param $first i32) (param $second i32)
       (result i32)
       local.get $first
       local.get $second
       i32.add)
)
```

导出的函数在浏览器中，可以通过 `WebAssembly` 提供的 API 来获取到并进行调用。

```javascript
// 假设最终编译后的wasm文件为`add.wasm`
// 调用WebAssembly对象上的`instantiateStreaming`方法
WebAssembly.instantiateStreaming(fetch("add.wasm")).then((obj) => {
  console.log(obj.instance.exports.add(1, 2)); // "3"
});
```

- 内部或导入函数调用

和我们平时写 js 等高级语言代码一样，我们经常会抽离一些函数仅供模块内部使用，在 `wat` 里这也很常见，上面在命名函数中也提到过，我们可以通过 `call` 来调用内部或者导入的函数，这里先来看看内部函数调用的例子。

```wasm
(module
  ;; 这里不考虑整数位溢出的情况
  (func $sqrt (param i32) (result i32)
    local.get 0
    local.get 0
    i32.mul
  )
  (func (export "addSqrt") (param $first i32) (param $second i32)
       (result i32)
       ;; 获取第一个参数并入栈
       local.get $first
       ;; $sqrt 要求输入一个参数，从栈中取出一个值，也即第一个参数，调用后返回一个i32的值入栈
       call $sqrt
       ;; 获取第二个参数并入栈，现在栈顶为第二个参数，栈底为调用第一个参数调用$sqrt后的返回值
       local.get $second
       ;; 从栈中取出一个值，此时即为位于栈顶的第二个参数，调用$sqrt并将结果入栈
       ;; 最终栈内栈顶为第二个参数$sqrt后的值，栈底为第一个参数$sqrt后的值
       call $sqrt
       ;; 调用i32.add，将两个参数$sqrt后的结果相加
       i32.add)
)
```

- 外部函数导入

外部函数导入作为`wasm`与宿主环境进行交互的另一个重要部分，与`wasm`函数导出一起提供了`wasm`和宿主环境互操作的能力。

#### 示例 2：

```wasm
(module
  ;; 导入的模块名为"console"，名称为"log"
  ;; 同时其类型为func函数、接受一个i32参数、无返回值，并在 wat 内命名为 $log 的函数签名
  (import "console" "log" (func $log (param i32)))
  (func (export "logIt")
    i32.const 13
    call $log)
)
```

```javascript
const importObject = {
  console: {
    log: function (arg) {
      console.log(arg);
    },
  },
};
// 假设上述wat编译后导出的wasm为logger.wasm
// 导入的值都通过调用instantiateStreaming时作为第二个参数传入
WebAssembly.instantiateStreaming(fetch("logger.wasm"), importObject).then(
  (obj) => {
    obj.instance.exports.logIt();
  }
);
```

关于 `import` 更多的相关语法可以从[官方 import 书写规范](https://webassembly.github.io/spec/core/text/modules.html#imports)中查看。

### `global` 全局变量

`global` 全局变量提供了 `wasm` 与宿主环境访问或操作同一个变量的能力。

先来看看一个从宿主环境导入到 `wat` 全局变量的例子：

```wasm
(module
  ;; 从模块"js"导入名为"global"的全局变量，其类型为i32，`mut`关键字表明该变量值可变（可被修改）
  ;; 按照import的语法，以下等价于 (import "js" "global" (global $times (mut i32)))
  (global $times (import "js" "global") (mut i32))
  ;; 对外导出函数incTimes，每次将$times的值加1
  (func (export "incTimes")
     global.get $times
     i32.const 1
     i32.add
     global.set $times
  )
)
```

在浏览器环境下，js 要传递全局变量给 `wasm`，就需要用到 [WebAssembly.Global](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Global) 对象

```javascript
// 假设上述wat编译后导出为global.wasm
const global = new WebAssembly.Global(
  {
    value: "i32", // 值类型，i32|i64|f32|f64
    mutable: true, // 是否可变
  },
  0 // 使用第二个参数赋予初始值
);
WebAssembly.instantiateStreaming(fetch("global.wasm"), { js: { global } }).then(
  ({ instance }) => {
    let i;
    for (i = 0; i < 10; i++) {
      instance.exports.incTimes();
      // global对象上有value属性，可以获取到当前对象的值
      console.log(global.value);
    }
    // 上面循环将依次输出值："1" "2" ... "10"
    global.value = 100;
    for (i = 0; i < 10; i++) {
      instance.exports.incTimes();
      console.log(global.value);
    }
    // 上面循环将依次输出值："101" "102" ... "110"
  }
);
```

再来看一个从 `wat` 内导出到宿主环境的例子。

```wasm
(module
  ;; 定义一个全局变量$times，赋予初始值0
  (global $times (mut i32) (i32.const 0))
  ;; 导出为 "TIMES"
  (export "TIMES" (global $times))
  ;; 对外导出函数incTimes，每次将$times的值加1
  (func (export "incTimes")
     global.get $times
     i32.const 1
     i32.add
     global.set $times
  )
)
```

```javascript
WebAssembly.instantiateStreaming(fetch("global.wasm")).then(({ instance }) => {
  const { incTimes, TIMES } = instance.exports;
  // 此时TIMES为WebAssembly.Global的实例，所以仍然需要通过value字段来获取或者设置值
  console.log(TIMES.value); // 输出"0"
  for (i = 0; i < 10; i++) {
    incTimes();
    console.log(TIMES.value);
  }
  // 上面循环将依次输出值："1" "2" ... "10"
});
```

### `memory` 内存

在示例 2 中，我们从（宿主环境）浏览器中导入了 `console.log` 方法，但在 `wasm` 中，我们支持的基础数据类型只有四种，在例子中，我们仅能打印出一个数字。在实际代码中，这肯定无法满足要求，因此这四种基础数据类型肯定远远不能满足我们的需求。因此我们需要更多的数据类型支持，这也就是 `memory` 相关指令要做的事情。

在讲 `memory` 内存相关指令之前，先得了解 `linear memory` 的概念，`linear memory`（或者又称作 `flat memory`） 是一种内存虚拟模型，由名字可以很容易联想到，`linear memory` 获取内存地址的方式是线性的，所有的内存地址从最小内存地址到最大内存地址都以线性的方式获取，而没有使用 [Memory segmentation](https://en.wikipedia.org/wiki/Memory_segmentation) 内存分段或者 [Memory paging](https://en.wikipedia.org/wiki/Memory_paging) 内存分页这种虚拟内存处理方式。

与 `memory` 指令关系紧密的指令还包括 `data` 指令，通过它可以往内存中写入一段字符串数据，当前版本中，字符都是按[utf-8 字符序列](https://webassembly.github.io/spec/core/text/values.html#text-string)来进行编码的，所以对于字符串我们需要进行预先的 utf-8 编码，必要时可以使用本仓库里提供的工具[string 转 utf-8](./stringToUtf8.html)进行编码转换。需要注意的是，`data` 指令不能用在 `func` 函数体内，也不能动态指定内存的索引起始位置，所以如果需要动态处理字符串数据等，只能通过其它方式来实现。

现在先来看看它们的基本用法：

```wasm
(module
  ;; 为当前模块定义一段内存，其大小为1页（1页的大小为64Kb）
  ;; 注意目前一个wasm module模块内只能定义一个内存
  (memory $m1 1)
  ;; 往内存中写入字符串"Nice"，起始位置INDEX为1，即从第1个字节后开始写入
  ;; 内存的索引与字符对应为：1: "N" 2: "i" 3: "c" 4: "e"
  (data (i32.const 1) "Nice")
  ;; 从内存起始位置0字节开始写入字符串"Hi"，字符串"Hi"占用两个字节
  ;; 内存的索引与字符对应为：0: "H" 1: "i"
  ;; 所以这里的索引1与前面的有重叠，将会覆盖上面的 "N"
  (data (i32.const 0) "Hi")
  (export "MEMORY" (memory $m1))
)
```

```javascript
// 假设上述的wat编译后的wasm文件名为memory.wasm
WebAssembly.instantiateStreaming(fetch("memory.wasm")).then(({ instance }) => {
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
```

上述示例是从 `wasm` 往宿主环境导出 `memory`，我们也可以从宿主环境导入到 `wasm`。在浏览器中，我们使用 [WebAssembly.Memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) 对象来创建一个 `Memory`。

```javascript
const memory = new WebAssembly.Memory({
  initial: 1, // 初始为1页大小，也即64Kb
  maximum: 10, // 最大为10页，也即640Kb
  // 如果要支持wasm的threads多线程，需要设置shared: true
  // 这样memory将生成 SharedArrayBuffer 而不是 ArrayBuffer
  // shared: true
});
const consoleLogString = (offset, length) => {
  const bytes = new Uint8Array(memory.buffer, offset, length);
  const string = new TextDecoder("utf8").decode(bytes);
  console.log(string);
};
const importObj = {
  js: {
    memory,
  },
  console: {
    log: consoleLogString,
  },
};

// 假设wat编译后的wasm文件名为memory.wasm
WebAssembly.instantiateStreaming(fetch("memory.wasm"), importObj).then(
  ({ instance }) => {
    const { writeHi } = instance.exports;
    writeHi(); // 输出 "Hi"
  }
);
```

```wasm
(module
  ;; 从名称"js" "memory"导入类型为memory的一段内存，大小为1页64Kb
  (import "js" "memory" (memory 1))
  ;; 导入"console" "log" 方法
  (import "console" "log" (func $log))
  ;; 往内存里写入"Hi"字符串
  (data (i32.const 0) "Hi")
  (func (export "writeHi")
    i32.const 0  ;; 内存的起始位置，以字节为单位
    i32.const 2  ;; 长度，即占用的字节数，这里即字符串 "Hi" 的字节数
    call $log)
)
```

### `table` 表

在 js 以及很多其它语言(如 c/c++,rust)中，函数都是一等公民，能以指针的形式作为参数传递、充当数组成员等，总之如果函数具有相同的签名，就能进行动态调用。对于这种需要运行时动态调用的函数，我们无法简单通过上面所说的 `call` 指令来简单执行调用。

在 `call` 指令中，`wasm` 最终都是通过指令后面指定的函数的静态索引值来进行调用的。如果要支持动态调用，那这个索引值也只能变成动态的，但如果这个动态可变的索引值是任意可设的值、不能被限制在 `wasm` 自身之内，就会带来以下混乱：

1. 无法事先验证索引指向的被调用函数是否存在、签名是否正确

2. 即便最终指定的被调用函数签名符合，这个函数也可能不在指定的动态可调用函数集合（不管是单个或多个）内，这将带来极大的安全问题

另一种可能的方案就如 `MDN` [文档](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format#webassembly_tables) 中所说，可以在 `wasm` 中定义一个 `anyfunc` 的类型（注：这个类型在 wasm 真实存在，不过在最新版本中被改成了`funcref`，更符合语义），可以用来表示任何签名的函数，然后我们将函数的指针值保存到 `Memory` 线性内存中，保存后同时得到的可能还包括线性内存的起始位置等，这样在动态调用时，我们就能根据调用时传递的索引位置在线性内存中查找到实际应该对应的函数，然后再进行调用。这在逻辑上看上去像是可行的，但从安全方面出发，这种方案就很难被接受。`Memory` 线性内存可能由宿主环境提供，又或者导出给了宿主环境，因此对于宿主环境（比如浏览器）相当于是完全透明的。这样我们保存在 `Memory` 中的函数指针对外也是完全透明的，我们可以在宿主环境中获取它、甚至篡改它，这肯定是不被允许的。

综合上述，`wasm` 的实现方案是，`call` 的指令仍然通过直接调用函数的静态索引值保持不变，新增加了一个指令 `call_indirect` (顾名思义，间接调用)，然后将要调用的动态函数列表放入 `table` 表中，然后通过保存在 `table` 表中的索引来获取到要调用的函数。

还是来看一个例子比较容易理解一点：

```wasm
(module
  ;; 定义一个初始大小为2，类型为funcref的表
  ;; 意思是该表能存放2个函数引用
  ;; table 2 3 funcref 这表示初始大小为2，最大为3，通常两者是一致的，除非需要在外部控制table的大小
  ;; 注意目前wasm的规范下一个模块只能定义1个table，这和memory类似
  (table 2 funcref)
  ;; 通过 elem 定义存放在表中的元素
  ;; (i32.const 0) 表示从下标0的位置开始存放
  ;; table-elem的指令组合，与memory-data的指令组合非常相似
  (elem (i32.const 0) $add $sub)
  ;; 定义一个type类型，将在call_indirect指令中作为类型签名验证
  (type $calc_type (func (param i32 i32) (result i32)))
  ;; 定义其中的一个函数，两数相加
  (func $add (param i32 i32) (result i32)
     local.get 0
     local.get 1
     i32.add
  )
  ;; 定义另一个函数，两数相减
  (func $sub (param i32 i32) (result i32)
     local.get 0
     local.get 1
     i32.sub
  )
  ;; 定义最终导出的支持动态调用的函数
  ;; 它接受三个参数，第一个参数表示要调用的动态函数保存在table中的下标
  ;; 这里就是 0: $add 1: $sub
  ;; 剩余的参数是调用函数时要传入的参数
  (func (export "calc") (param i32 i32 i32) (result i32)
     ;; 注意这里导入参数的顺序，最后入栈的是函数在table中的索引值
     ;; 等价于 (call_indirect (type $calc_type) (local.get 1) (local.get 2) (local.get 0))
     ;; 上面写法的位置顺序和入栈的顺序保持一致，其它指令的简写写法也一样
     local.get 1
     local.get 2
     local.get 0
     call_indirect (type $calc_type)
  )
)
```

```javascript
// 假设上述的wat编译后的wasm文件名为table.wasm
WebAssembly.instantiateStreaming(fetch("table.wasm")).then(({ instance }) => {
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
```

以上例子展示了 `table` 的基本用法，实际上我们在浏览器环境中，我们还可以通过 [WebAssembly.Table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table) 对象创建一个 `table` 然后导入到 `wasm` 中。

```wasm
(module
  ;; 从名为"js" "table"中导入table，table的类型为函数引用，初始大小为1，即只能保存1个函数引用
	(import "js" "table" (table 1 funcref))
  ;; 定义名为$call_type的函数类型
	(type $call_type (func (param i32) (result i32)))
  ;; 定义两个导出函数，签名需要符合类型$call_type
  ;; 注意在宿主环境中，对table的set操作只能是wasm内导出的函数
  (func (export "add100") (param i32) (result i32)
      local.get 0
      i32.const 100
      i32.add
  )
  (func (export "sub100") (param i32) (result i32)
      local.get 0
      i32.const 100
      i32.sub
  )
  ;; 定义一个执行函数，函数第一个参数为函数在table中的索引值
  ;; 第二个参数为传递到动态函数中的实际第一个参数
  (func (export "exec") (param i32 i32)  (result i32)
      (call_indirect (type $call_type) (local.get 1) (local.get 0) )
  )
)
```

```javascript
// 定义一个初始大小为1的table
const table = new WebAssembly.Table({
  initial: 1,
  element: "funcref",
});
const importObj = {
  js: {
    table,
  },
};
// 假设上述的wat编译后的wasm文件名为table.wasm
WebAssembly.instantiateStreaming(fetch("table.wasm"), importObj).then(
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
```

## 块级指令

上面整体介绍了一下 `wat` 的书写规范以及通过浏览器的 API，两者进行交互调用的方式，下面将对 `wasm` 支持的块级指令进行进一步的阐述，以便我们能进行真正接近实际的代码编程。

这些块级指令主要包括：

- 块：`block`
- 条件：`if`，以及对应的分支 `else`，又或者 `if` 后带有条件的写法 `if <condition> (then xxx) (else xxx)`
- 循环：`loop`

所有的区块指令都以 `end` 标识符作为区块的结束，区块指令后面也都可以后接 `id` 名为区块进行命名，以及 `(result type)` 表示区块的返回值，如果有 `result`，则最终区块的栈内应不为空，栈内的数据与 `result` 标示的类型、数量(如果 wasm 支持了多返回值的情况下)保持一致。注意这里特意说的`区块的栈`，这是因为区块指令都会开辟自己的栈，使其与函数体的栈或其它区块相隔离，这样区块就表现得与独立函数一样，可以层层嵌套。

区块指令为我们提供了独立运行某段代码的能力，但如果仅仅如此，它的作用就和普通的函数作用相差不大了。代码块最重要的能力，是它能与跳转指令配合使用，从而使 `wasm` 具备了运行区块内某部分代码、不运行某部分代码，或者运行某个区块不运行某个区块的能力。

上面所说的跳转指令，主要包括：

- `br` 后面可以接`block` 区块名、`if` 条件语句名、`loop` 循环名（下面为描述简单，统称为块名），如果后面参数为索引值，则按照自身区块为 0，往上一层区块递加 1 的方式方式进行索引。
- `br_if` 和 `br` 一样，不过 `br_if` 会从它所属的区块堆栈中取出一个值，如果值不为 0 才进行跳转。
- `br_table` 和上面的 `table` 指令类似，`br_table` 后面可接多个块名参数（从 0 开始索引），然后从堆栈中取出一个索引值，匹配到对应参数、然后跳转到参数所指向的块名。

实际上，像 `loop` 指令，如果没有这些跳转指令，我们就没法实现循环，所谓循环，无非就是<循环体>代码执行一遍后，再跳到循环代码块的开头部分，如此往复直至达到条件跳出循环。所以，大部分时候区块指令必须搭配跳转指令才能实现它所要实现的代码逻辑。另外，跳转指令都具备让代码执行跳转到某个位置的能力，除了 `loop` 是跳转回 `loop` 所在开头位置，其它都会跳转到区块之外，这里的`之外`的意思是，它会跳转到对应区块的对应 `end` 之后再继续执行，而不会再执行它（跳转指令）之后的其它指令。

### `block` 指令

```wasm
(module
  (;导入random方法，返回随机值0到1;)
  (import "math" "random" (func $random (result f32)))
  ;; 该函数根据随机数的大小，大于等于0.5则返回1，否则返回0
  (func (export "isOptional") (result i32)
    block (result i32) ;; 因为block有返回值，所以这里需要标注(result i32)，这和单独的函数是一致的
      call $random ;; 往栈中压入一个0到1的随机数
      f32.const 0.5 ;; 往栈中增加浮点数0.5
      f32.lt ;; 取出栈内的两个操作数，浮点数0.5以及随机数，对比它们的大小并将结果压入栈中
    end
  )
)
```

```javascript
const importObj = {
  math: {
    random: Math.random,
  },
};
// 假设上述的wat编译后的wasm文件名为block.wasm
WebAssembly.instantiateStreaming(fetch("block.wasm"), importObj).then(
  ({ instance }) => {
    const { isOptional } = instance.exports;
    for (let i = 0; i < 10; i++) {
      console.log(isOptional()); // 输出0或1
    }
  }
);
```

从上述示例可以看出来，`block` 块和普通的函数非常类似，都会在代码块内形成栈，都可以有返回值，除了函数能指定接受参数外，看上去基本没有太大的区别。如果 `block` 只是将代码指令聚集在块内，显然没有太大的意义，就像上面的代码一样，我们完全可以去掉 `block` 和 `end`。下面我们再来看一个更具普遍性的 `block` 指令用法（注：示例代码效率不一定最优，主要目的是为了示范用法）。

```wasm
(module
  (;和上面示例类似，从math random导入为random函数;)
  (import "math" "random" (func $random (result f32)))
  ;; 同样，该函数根据随机数的大小，大于等于0.5则返回1，否则返回0
  (func (export "isOptional") (result i32)
    block $b0
      call $random
      f32.const 0.5
      f32.lt
      ;; 如果随机数小于0.5，则返回0
      ;; 这里相当于跳转到名为"$b0"的block的end指令之后
      ;; 反之，则会继续执行跳转指令之后的指令
      br_if $b0
      ;; 注意这里的return，表示直接将当前栈中的值充当返回值
      ;; return越过了所有的块，从函数体内直接返回
      ;; 我们无法通过给block指定返回值来替代return，因为跳转指令无法指定返回值
      ;; 这样就会导致跳转指令和block本身的返回值不一致
      i32.const 1
      return
    end
    i32.const 0
  )
)
```

上面两个 `block` 示例所实现的功能完全一样，但后面的示例与跳转指令相配合才是 `block` 的常规操作。

### `if` 指令

`if` 指令从栈中取出一个值(类型必须是`i32`，`br_if`等需要判断值是否为 0 的指令也类似)，当值为 0 时，条件不成立，`if` 内的指令不会被执行，如果有 `else` 的分支的话，将执行 `else` 内的指令；当值不为 0 时，执行 `if` 内的指令。和 `block` 类似，如果 `if` 自身有返回值，需要在 `if` 后加上返回值，使用返回值时，`else` 分支的返回值和 `if` 的返回值必须保持一致。

```wasm
(module
  (;和上面block使用的示例一样，从math random导入为random函数;)
  (import "math" "random" (func $random (result f32)))
  ;; 同样，该函数根据随机数的大小，大于等于0.5则返回1，否则返回0
  (func (export "isOptional") (result i32)
   	;; 往栈中压入一个0到1的随机浮点数
    call $random
    ;; 继续往栈中压入浮点
    f32.const 0.5
    f32.lt
    ;;
    if (result i32)
    	i32.const 0
    else
    	i32.const 1
    end
  )
)
```

上面的 `if` 语句如果以 S 表达式的方式书写，需要稍微注意一下书写的语法，`if` 条件为真的情况下指令必须写在关键字 `then` 之后。

```wasm
(module
  (;和上面block使用的示例一样，从math random导入为random函数;)
  (import "math" "random" (func $random (result f32)))
  ;; 同样，该函数根据随机数的大小，大于等于0.5则返回1，否则返回0
  (func (export "isOptional") (result i32)
    ;; 这里使用了`block`与if的条件判断进行配合
   	(if (result i32) (block (result i32)
          (f32.lt
            (call $random)
            (f32.const 0.5)
          )
      )
      (then i32.const 0) ;; 这里必须使用`then`关键字，if条件为true时执行
      (else i32.const 1) ;; 显然，`then`和`else`不能交换位置
    )
  )
)
```

因为该示例与上面的 block 示例一致， js 代码就不再重复版述了。

### `loop` 指令

上面已经提到，`loop` 指令和其它区块指令有一点不同，就是跳转指令与它配合使用时，会跳转至 `loop` 区块的开头部分，正因如此，`loop` 指令才得以可以实现循环的效果。

```wasm
(module
  (func (export "factorial") (param $end i32) (result i32) (local $start i32) (local $total i32)
    ;; 设置阶乘起始值$start为1
    (local.set $start (i32.const 1))
    ;; 设置阶乘初始结果为1
    (local.set $total (i32.const 1))
    ;; 开始循环
    loop $l
      ;; 判断$start < $end，结果为1(true)才进入if区块代码
      (i32.lt_s (local.get $start) (local.get $end))
      ;; if内的代码即为循环体代码
      if
        ;; 将$start增加1
        (local.set $start (i32.add (local.get $start) (i32.const 1)))
        ;; 将$total乘以$start，实现阶乘
        (local.set $total (i32.mul (local.get $total) (local.get $start)))
        ;; 跳转回循环开头
        br $l
      end
    end
    ;;返回$total结果
    local.get $total
  )
)
```

对应的 js 调用代码如下：

```javascript
// 假设上述的wat编译后的wasm文件名为loop.wasm
WebAssembly.instantiateStreaming(fetch("loop.wasm")).then(({ instance }) => {
  const { factorial } = instance.exports;
  for (let i = 1; i < 10; i++) {
    console.log(factorial(i)); // 依次输出1、2、6、24、....
  }
});
```
