/*
* @Date: 2022-07-19 21:13:54
* @Author: 枫
 * @LastEditors: 枫
* @description: description
 * @LastEditTime: 2022-07-28 08:03:41
*/

import { ReactiveEffect } from "./effect";
import { RefImpl } from "./ref";

// export class ComputedImpl<T> {
//   private _getter: () => T
//   constructor(getter: () => T) {
//     this._getter = getter;
//   }

//   get value() {
//     return this._getter()
//   }
// }


// export function computed<T>(options: {
//   get: () => T,
//   set: (value: T) => void
// }): RefImpl<T>

// export function computed<T>(getter: () => T): ComputedImpl<T>

// export function computed<T>(param: any) {
//   if(typeof param === 'function')
//     return new ComputedImpl(param)
//   else {
//     return new RefImpl(1)
//   }
// }

export class ComputedImpl<T> {
  private _getter: () => T
  private _dirty: boolean = true;
  private _value: T | null = null;
  private _effect: ReactiveEffect;
  constructor(getter: () => T) {
    this._getter = getter;

    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }

  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed<T>(getter: () => T) {
  return new ComputedImpl(getter)
}