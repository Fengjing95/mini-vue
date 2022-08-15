/*
 * @Date: 2022-08-15 13:06:12
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-15 14:12:38
 */
import { ref, h, getCurrentInstance, nextTick } from '../../lib/guide-mini-vue.esm.js'

export default {
  name: 'App',
  setup() {
    const count = ref(1)
    const instance = getCurrentInstance()

    async function onClick() {
      for (let i = 0; i < 100; i++) {
        console.log('update');
        count.value = i
      }

      // nextTick(() => {

      //   console.log(instance);
      // })
      await nextTick()
      console.log(instance)

    }

    return { count, onClick }
  },
  render() {
    const button = h('button', { onClick: this.onClick }, 'count++')
    const p = h('p', {}, 'count: ' + this.count)

    return h('div', {}, [button, p])
  }
}