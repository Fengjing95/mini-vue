/*
 * @Date: 2022-08-08 18:55:11
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-08 19:14:47
 */
import { createRender } from '../../lib/guide-mini-vue.esm.js'
import { App } from './App.js'

const { Application, Graphics } = PIXI

const game = new Application({
  width: 500,
  height: 500,
})

document.body.append(game.view)

const { createApp } = createRender({
  createElement(type) {
    if (type === 'rect') {
      const rect = new Graphics()
      rect.beginFill(0xff0000)
      rect.drawRect(0, 0, 100, 100)
      rect.endFill()

      return rect
    }
  },
  patchProps(el, key, val) {
    el[key] = val
  },
  insert(el, parent) {
    parent.addChild(el)
  }
})

createApp(App).mount(game.stage)
