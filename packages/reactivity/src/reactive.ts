import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'

export const reactiveMap = new WeakMap<object, any>()
export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}
function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
    // 判断existingProxy是否存在，如果存在直接用之前的
    const existingProxy= proxyMap.get(target)
    if(existingProxy){
        return existingProxy
    }
   const proxy=new Proxy(target,baseHandlers)
   // 把target存起来
   proxyMap.set(target,proxy)
   return proxy
}
export const toReactive=<T extends unknown>(value:T):T=>{
  return isObject(value) ? reactive(value as object) : value
}
