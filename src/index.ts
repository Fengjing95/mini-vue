/*
 * @Date: 2022-07-31 21:00:24
 * @Author: 枫
 * @LastEditors: 枫
 * @description: mini-vue 出口
 * @LastEditTime: 2022-08-20 22:12:39
 */

export * from './runtime-dom'

import { baseCompile } from './compiler-core/src'
import * as runtimeDom from './runtime-dom'
import { registerRuntimeCompiler } from './runtime-dom'

function compileToFunction(template: string) {
  const { code } = baseCompile(template)

  const render = new Function('Vue', code)(runtimeDom)

  return render
}

registerRuntimeCompiler(compileToFunction)
