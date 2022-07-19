/*
 * @Date: 2022-07-18 20:53:42
 * @Author: 枫
 * @LastEditors: 枫
 * @description: ref
 * @LastEditTime: 2022-07-19 20:40:50
 */

import { hasChange, isObject } from "../shared";
import { isTracking, ReactiveEffect, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";


class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep: Set<ReactiveEffect>;
  private __v_isRef = true;

  constructor(value: any) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    // 收集依赖
    trackRefValue(this)
    return this._value
  }
  
  set value(newValue) {
    if (hasChange(newValue, this._rawValue)) {
      this._rawValue = newValue;
      // 先修改 value 再触发依赖
      this._value = convert(newValue);
      triggerEffects(this.dep)
    }
  }
}

// 不同的 value 类型返回不同的值
function convert(value: any) {
  return isObject(value) ? reactive(value) : value;
}

// 手机 ref 依赖
function trackRefValue(ref: RefImpl) {
  if(isTracking())
      trackEffects(ref.dep)
}


export function ref(value: any) {
  return new RefImpl(value);
}

export function isRef(value: any) {
  return !!value.__v_isRef
}

export function unRef(value: any) {
  return isRef(value) ? value._rawValue : value
}

