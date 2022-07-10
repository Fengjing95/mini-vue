/*
 * @Date: 2022-06-29 20:17:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-10 12:22:52
 */
import {isReactive, reactive} from '../reactive'
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observed = reactive({ foo: 1 });
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })

  it('nested reactive', () => {
    const original = {
      nested: { foo: 1 },
      array: [{bar: 2}]
    }

    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})
