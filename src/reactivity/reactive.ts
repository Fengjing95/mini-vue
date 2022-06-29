
/*
* @Date: 2022-06-29 20:50:44
* @Author: 枫
 * @LastEditors: 枫
* @description: description
 * @LastEditTime: 2022-06-29 21:15:14
*/
import { track, trigger } from "./effect";

export function reactive(raw: Record<any, any>) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      // 收集依赖
      track(target, key)
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);

      // TODO 收集依赖
      trigger(target, key)
      return res
    }
  })
}
