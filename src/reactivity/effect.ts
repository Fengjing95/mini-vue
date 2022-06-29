/*
 * @Date: 2022-06-29 20:56:16
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-29 21:21:09
 */
class ReactiveEffect {
  _fn: Function
  constructor(fn: Function) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}


const targetMap = new WeakMap<object, Map<keyof any, Set<ReactiveEffect>>>()

export function track<T extends object>(target: T, key: keyof T) { 
  // target -> key -> dep

  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = new Set<ReactiveEffect>())
  }

  dep.add(activeEffect)

}



let activeEffect: ReactiveEffect;
export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  
  _effect.run()
}

export function trigger<T extends object>(target: T, key: keyof T) {
  let depsMap = targetMap.get(target)

  let dep = depsMap!.get(key) as Set<ReactiveEffect>

  for (const effect of dep) {
    effect.run()
  }
}
