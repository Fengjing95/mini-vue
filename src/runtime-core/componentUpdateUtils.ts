/*
 * @Date: 2022-08-14 22:10:48
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 组件更新工具函数
 * @LastEditTime: 2022-08-14 22:14:01
 */
export function shouldUpdateComponent(prevNode: any, nextNode: any) {
  const { props: prevProps } = prevNode
  const { props: nextProps } = nextNode

  for (const key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }

  return false
}
