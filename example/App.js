/*
 * @Date: 2022-07-28 08:06:52
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-31 21:41:58
 */
import { h } from '../lib/guide-mini-vue.esm.js';

export const App = {
  render() {
    return h('div', 'Hi, ' + this.msg)
  },
  setup() {
    // composition API
    return {
      msg: 'mini-vue',
    }
  }
}
