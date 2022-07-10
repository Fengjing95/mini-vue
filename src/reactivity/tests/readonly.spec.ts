/*
* @Date: 2022-07-03 19:09:56
* @Author: 枫
 * @LastEditors: 枫
* @description: description
 * @LastEditTime: 2022-07-10 13:31:38
*/
import { isProxy, isReadonly, readonly } from "../reactive";

describe("happy path", () => {
  it("readonly", () => { 
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
    expect(isReadonly( wrapped )).toBe(true)
    expect(isReadonly(original)).toBe(false)
    
    expect(isProxy(wrapped)).toBe(true)
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

  it('nested readonly', () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    
    expect(isReadonly( wrapped )).toBe(true)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly( original.bar )).toBe(false)
    expect(isReadonly( wrapped.bar )).toBe(true)
  })
})
