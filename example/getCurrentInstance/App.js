
/*
 * @Date: 2022-07-28 08:06:52
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-06 23:14:09
 */
import { h, createTextNode, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    return h('div',
      {},
      [
        h('p', {}, 'getCurrentInstance demo'),
        h(Foo)
      ]
    )
  },
  setup() {
    const instance = getCurrentInstance()
    console.log('App: ', instance);
    return {
    }
  }
}
