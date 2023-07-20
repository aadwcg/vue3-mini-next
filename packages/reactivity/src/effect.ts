import { isArray } from "@vue/shared"
import { Dep, createDep } from "./dep"

type KeyToDepMap=Map<any,Dep>
const targetMap=new WeakMap<any,KeyToDepMap>

export let activeEffect:ReactiveEffect | undefined

export function effect<T = any>(fn: () => T){    
    const _effect=new ReactiveEffect(fn)    
    _effect.run()
}
export class ReactiveEffect<T=any>{
    constructor(public fn:() =>T){}
    run(){        
        activeEffect=this
        return this.fn()
    }
}
/**
 * 收集依赖
 * @param target 
 * @param key 
 */

export function track(target:object,key:unknown){    
    // 如果当前不存在执行函数就return
    if(!activeEffect)return
    // 尝试从targetMap中，根据target获取map
    let depsMap=targetMap.get(target)
    // 如果获取到的map不存在，则生成新的map对象，并把该对象赋值给对应的value
    if(!depsMap){
        targetMap.set(target,(depsMap=new Map()))
    }

    let dep = depsMap.get(key)
    if(!dep){
        depsMap.set(key,(dep=createDep()))
    }

    trackEffects(dep)
    // 为指定map，指定key，设置回调函数
    // depsMap.set(key,activeEffect)
}
/**
 * 利用dep依次跟踪指定key的所有的effect
 */
export function trackEffects(dep:Dep){    
    dep.add(activeEffect!)
}
/**
 * 触发依赖
 */
export function trigger(target:object,key:unknown,newValue:unknown){
    const depsMap=targetMap.get(target)
    if(!depsMap){
        return
    }
    const dep:Dep | undefined=depsMap.get(key)
    if(!dep){
        return
    }
    triggerEffects(dep)
}
/**
 * 依次触发dep中保存的依赖
 * @param dep 
 */
export function triggerEffects(dep:Dep){
    const effects= isArray(dep) ? dep : [...dep]
    for (const effect of effects) {
        triggerEffect(effect)
    }
}
/**
 * 触发指定依赖
 * @param effect 
 */
export function triggerEffect(effect:ReactiveEffect){
    effect.run()
}