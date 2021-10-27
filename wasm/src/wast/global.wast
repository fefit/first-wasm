(module
  (import "console" "log" (func $log (param i32)))
  (global $info (import "global" "info") i32)
  (global $times (import "global" "times") (mut i32))
  (func (export "logIt")
     global.get $info
     call $log
  )
  (func (export "tick")
     global.get $times
     i32.const 1
     i32.add
     global.set $times
  )
)