/*
 * @Date: 2022-08-07 21:07:18
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-07 22:22:32
 */
import { provide, inject, h } from '../../lib/guide-mini-vue.esm.js'

const Provider = {
  name: 'provide',
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provide1'), h(ProviderSon)])
  }
}

const ProviderSon = {
  name: 'provide',
  setup() {
    provide('bar', 'barVal222')
    provide('baz', 'bazVal')
    provide('foo', 'newFoo')
    const foo = inject('foo')
    return { foo }
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provide2: ' + this.foo), h(Consumer)])
  }
}

const Consumer = {
  name: 'consumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    const baz = inject('baz')
    const abc = inject('abc', () => '123')

    return { foo, bar, baz, abc }
  },
  render() {
    return h('div',
      {},
      `Consumer: ${this.foo} - ${this.bar} - ${this.baz} - ${this.abc}`
    )
  }
}

export default {
  name: "App",
  setup() {
    return {}
  },
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(Provider)]);
  },
};