(module
  ;; define first, then export
  (func $minus (param i32) (param i32)
       (result i32)
       get_local 0
       get_local 1
       i32.sub)
  (export "minus" (func $minus))
  ;; with export
  (func (export "minus2") (param $first i32) (param $second i32) (result i32)
    (i32.sub (get_local $first) (get_local $second))
  )
  ;; call another func
  (func (export "minus3") (param $first i32) (param $second i32) (result i32)
    get_local 0
    get_local 1
    call $minus 
  )
  ;; local
  (func (export "add100") (param i32) (result i32) (local i32) 
    (set_local 1 (i32.const 100))
    (i32.add (get_local 0) (get_local 1))
  )
)