import { extend } from "../shared"

/*
 * @Date: 2022-06-29 20:56:16
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-03 16:58:53
 */
class ReactiveEffect {
  private _fn: Function
  public scheduler?: Function
  deps: Set<ReactiveEffect>[] = []
  active = true
  onStop?: () => void

  constructor(fn: Function, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}


// 清除依赖 
function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  })
}

let activeEffect: ReactiveEffect;

export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)

  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}


export function stop(runner: any) {
  runner.effect.stop()
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

  if (!activeEffect) return;

  // 收集依赖
  dep.add(activeEffect)
  // 反向收集依赖
  activeEffect.deps.push(dep)
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
