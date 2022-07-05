/*
* @Date: 2022-07-03 19:09:56
* @Author: 枫
 * @LastEditors: 枫
* @description: description
 * @LastEditTime: 2022-07-05 16:44:03
*/
import { isReadonly, readonly } from "../reactive";

describe("happy path", () => {
  it("readonly", () => { 
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
    expect(isReadonly( wrapped )).toBe(true)
    expect(isReadonly( original )).toBe(false)
  })
  
  it("warn when set", () => {
    console.warn = jest.fn()

    const user = readonly({
      age: 10
    })

    // @ts-expect-error
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})
