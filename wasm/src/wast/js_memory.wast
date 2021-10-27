(module
  ;; 从名称"js" "mem"导入类型为memory的一段内存，大小为1页64Kb
  (import "js" "memory" (memory 1))
  ;; 导入"console" "log" 方法
  (import "console" "log" (func $log (param i32 i32)))
  ;; 往内存里写入"Hi"字符串
  (data (i32.const 0) "Hi")
  (func (export "writeHi")
    i32.const 0  ;; 内存的起始位置，以字节为单位
    i32.const 2  ;; 长度，即占用的字节数，这里即字符串 "Hi" 的字节数
    call $log)
)