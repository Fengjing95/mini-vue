
/*
 * @Date: 2022-07-28 08:06:52
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-05 22:26:43
 */
import { h } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './Foo.js'

export const App = {
  render() {
    return h('div',
      {},
      [
        h('div', {}, 'App'),
        h(Foo, {}, {
          main: ({ age }) => h('p', {}, 'age: ' + age),
          footer: () => h('div', {}, '456')
        })
      ]
    )
  },
  setup() {
    return {
    }
  }
}
