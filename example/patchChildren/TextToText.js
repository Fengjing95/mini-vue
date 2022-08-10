/*
 * @Date: 2022-08-10 17:30:38
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-10 17:32:07
 */
import { h, ref } from '../../lib/guide-mini-vue.esm.js'

export default {
  name: 'TextToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return { isChange }
  },
  render() {
    const self = this

    const prevChildren = 'oldChildren'
    const nextChildren = 'newChildren'

    return self.isChange === true ?
      h('div', {}, nextChildren) :
      h('div', {}, prevChildren)
  }
}
