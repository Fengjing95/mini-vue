/*
 * @Date: 2022-08-09 17:40:49
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-09 21:14:58
 */
import { ref, h } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }
    const props = ref({
      foo: 'foo',
      bar: 'bar',
    })

    const onChangePropsDemo1 = () => {
      props.value.foo = 'newFoo'
    }

    const onChangePropsDemo2 = () => {
      props.value.bar = undefined
    }

    const onChangePropsDemo3 = () => {
      props.value = {
        foo: 'foo',
      }
    }

    return {
      count,
      onClick,
      props,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3
    }
  },
  render() {
    return h(
      'div',
      { id: 'root', ...this.props },
      [
        h('div', {}, 'count: ' + this.count),
        h('button', { onClick: this.onClick }, 'click'),
        h('button', { onClick: this.onChangePropsDemo1 }, 'demo1-修改值'),
        h('button', { onClick: this.onChangePropsDemo2 }, 'demo2-undefined'),
        h('button', { onClick: this.onChangePropsDemo3 }, 'demo1-属性消失')
      ]
    )
  }
}
