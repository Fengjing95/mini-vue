/*
 * @Date: 2022-07-03 22:48:13
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-05 16:43:18
 */
import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";


// 返回 getter
function createGetter(isReadOnly: boolean = false) {
  return function get(target: Record<any, any>, key: string | symbol) {
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadOnly
    else if (key === ReactiveFlags.IS_READONLY)
      return isReadOnly

    const res = Reflect.get(target, key);
    // 如果不是 readonly 收集依赖
    if (!isReadOnly)
      track(target, key);
    return res;
  }
}

// 返回 setter
function createSetter() {
  return function set(target: Record<any, any>, key: string | symbol, value: any) {
    const res = Reflect.set(target, key, value);
    trigger(target, key)
    return res
  }
}

// reactive 的 getter 和 setter, 调用一次, 后面无需再次调用
const get = createGetter()
const set = createSetter()

// reactive 的 Proxy handler
export const mutableHandlers = {
  get,
  set,
}

// readonly 的 getter
const readonlyGet = createGetter(true)

// readonly 的 Proxy handler
export const readonlyHandlers = {
  get: readonlyGet,
  set(target: Record<any, any>, key: string, value: any) {
    // readonly 不可 set, 抛出异常
    // TODO 自定义异常
    console.warn(`key: ${key}设置失败, 因为${target}是 readonly 类型`)
    return true
  }
}
