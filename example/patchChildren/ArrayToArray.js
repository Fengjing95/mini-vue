/*
 * @Date: 2022-08-10 18:18:20
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-13 19:26:56
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

    // 左侧对比
    // const prevChildren = [
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    //   h('div', { key: 'c' }, 'C'),
    // ]
    // const nextChildren = [
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    //   h('div', { key: 'd' }, 'D'),
    //   h('div', { key: 'e' }, 'E'),
    // ]

    // 右侧对比
    // const prevChildren = [
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    //   h('div', { key: 'c' }, 'C'),
    // ]
    // const nextChildren = [
    //   h('div', { key: 'd' }, 'D'),
    //   h('div', { key: 'e' }, 'E'),
    //   h('div', { key: 'b' }, 'B'),
    //   h('div', { key: 'c' }, 'C'),
    // ]

    // 新增
    // 后面新增
    // const prevChildren = [
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    // ]
    // const nextChildren = [
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    //   h('div', { key: 'c' }, 'C'),
    //   h('div', { key: 'd' }, 'D'),
    // ]

    // 前面新增
    // const prevChildren = [
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    // ]
    // const nextChildren = [
    //   h('div', { key: 'd' }, 'D'),
    //   h('div', { key: 'c' }, 'C'),
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    // ]

    // 老的比新的长, 删除
    // 左侧
    // const prevChildren = [
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    //   h('div', { key: 'c' }, 'C'),
    // ]

    // const nextChildren = [
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    // ]

    // 右侧
    // const prevChildren = [
    //   h('div', { key: 'c' }, 'C'),
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    // ]

    // const nextChildren = [
    //   h('div', { key: 'a' }, 'A'),
    //   h('div', { key: 'b' }, 'B'),
    // ]

    // 乱序
    const prevChildren = [
      h('div', { key: 'a' }, 'A'),
      h('div', { key: 'b' }, 'B'),
      h('div', { key: 'c' }, 'C'),
      h('div', { key: 'f' }, 'F'),
      h('div', { key: 'd' }, 'D'),
      h('div', { key: 'e' }, 'E'),
    ]

    const nextChildren = [
      h('div', { key: 'a' }, 'A'),
      h('div', { key: 'b' }, 'B'),
      h('div', { key: 'f' }, 'F'),
      h('div', { key: 'g' }, 'G'),
      h('div', { key: 'c' }, 'C'),
      h('div', { key: 'e' }, 'E'),
    ]


    return self.isChange === true ?
      h('div', {}, nextChildren) :
      h('div', {}, prevChildren)
  }
}
