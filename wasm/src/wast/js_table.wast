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