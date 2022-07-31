/*
 * @Date: 2022-07-28 08:06:12
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-31 21:41:51
 */
import { createApp } from '../lib/guide-mini-vue.esm.js';
import { App } from './App.js'

const root = document.querySelector('#app');
createApp(App).mount(root)
