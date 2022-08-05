/*
* @Date: 2022-08-04 16:54:13
* @Author: 枫
 * @LastEditors: 枫
* @description: Foo组件
 * @LastEditTime: 2022-08-05 22:24:21
*/

import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup() {
    return {}
  },

  render() {
    const foo = h(
      'p',
      {},
      'foo')
    console.log(this.$slots);
    return h('div',
      {},
      [
        renderSlots(this.$slots, 'main', { age: 18 }),
        foo,
        renderSlots(this.$slots, 'footer')
      ])
  }
}
