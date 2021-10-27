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