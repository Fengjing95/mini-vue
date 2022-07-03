/*
 * @Date: 2022-06-29 20:56:16
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-03 15:14:30
 */
class ReactiveEffect {
  private _fn: Function
  public scheduler?: Function

  constructor(fn: Function, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }
}

let activeEffect: ReactiveEffect;

export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)

  _effect.run()
  

  const runner = _effect.run.bind(_effect)
  return runner
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

export function trigger<T extends object>(target: T, key: keyof T) {
  let depsMap = targetMap.get(target)

  let dep = depsMap!.get(key) as Set<ReactiveEffect>

  for (const effect of dep) {
    if (effect.scheduler)
      effect.scheduler()
    else
      effect.run()
  }
}
