/*
 * @Date: 2022-06-29 20:11:37
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-29 21:00:20
 */
import { reactive } from '../reactive';
import { effect } from '../effect';
describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 10 })
    
    let nextAge;
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)

    // update
    user.age++
    expect(nextAge).toBe(12)
  })
})
