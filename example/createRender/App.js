/*
 * @Date: 2022-08-08 19:02:24
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-08 21:33:45
 */
import { h } from '../../lib/guide-mini-vue.esm.js';
export const App = {
  setup() {
    return {
      x: 100,
      y: 200
    }
  },
  render() {
    return h('rect', { x: this.x, y: this.y })
  }
}
