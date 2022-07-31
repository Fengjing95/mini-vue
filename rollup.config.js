/*
 * @Date: 2022-07-31 20:59:58
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-31 21:49:40
 */
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [
    // 1. cjs
    {
      format: 'cjs',
      file: pkg.main
    },
    // 2. mjs
    {
      format: 'es',
      file: pkg.module
    }
  ],
  plugins: [typescript()]
}
