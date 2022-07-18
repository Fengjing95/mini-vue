/*
* @Date: 2022-06-29 20:56:16
* @Author: 枫
 * @LastEditors: 枫
* @description: description
 * @LastEditTime: 2022-07-18 21:43:46
*/
import { extend } from "../shared"

let activeEffect: ReactiveEffect;
let shouldTrack: boolean;

export class ReactiveEffect {
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
    if (!this.active)
      // 如果被 stop 直接执行返回
      return this._fn()

    // 否则进行依赖收集
    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    shouldTrack = false // 依赖收集结束之后将状态重置

    return result
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
  // 上面清理之后的 deps 内容是空 set, 已经没有用了, 可以直接清空
  effect.deps.length = 0
}


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
  if (!isTracking()) return
  // target -> key -> dep
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = new Set<ReactiveEffect>())
  }

  trackEffects(dep)
}

export function trackEffects(dep: Set<ReactiveEffect>) {
  if (dep.has(activeEffect))
    // 如果已经被收集, 中断
    return
  // 收集依赖
  dep.add(activeEffect)
  // 反向收集依赖
  activeEffect.deps.push(dep)
}

export function isTracking() {
  // // 如果没有激活的 effect 中断执行
  // if (!activeEffect) return;
  // // 如果不应该收集依赖, 中断执行
  // if (!shouldTrack) return

  return shouldTrack && activeEffect !== undefined
}

export function trigger<T extends object>(target: T, key: keyof T) {
  let depsMap = targetMap.get(target)

  let dep = depsMap!.get(key) as Set<ReactiveEffect>
  
  triggerEffects(dep)
}

export function triggerEffects(dep: Set<ReactiveEffect>) {
  for (const effect of dep) {
    if (effect.scheduler)
      effect.scheduler()
    else
      effect.run()
  }
}
