/*
 * @Date: 2022-08-10 18:18:20
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-10 18:18:50
 */
import { h, ref } from '../../lib/guide-mini-vue.esm.js'

export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return { isChange }
  },
  render() {
    const self = this

    const prevChildren = [
      h('div', {}, 'A'),
      h('div', {}, 'B'),
    ]
    const nextChildren = [
      h('div', {}, 'C'),
      h('div', {}, 'D'),
    ]

    return self.isChange === true ?
      h('div', {}, nextChildren) :
      h('div', {}, prevChildren)
  }
}
