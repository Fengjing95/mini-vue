/*
 * @Date: 2022-08-09 17:40:49
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-09 20:35:14
 */
import { ref, h } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }

    return { count, onClick }
  },
  render() {
    return h(
      'div',
      { id: 'root' },
      [
        h('div', {}, 'count: ' + this.count),
        h('button', { onClick: this.onClick }, 'click')
      ]
    )
  }
}
