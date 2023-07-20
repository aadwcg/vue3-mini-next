/**
 * 判断是否为一个数组
 */
export const isArray=Array.isArray

export const isObject=(val:unknown)=>val !==null && typeof val === 'object'

/**
 * 对比两个数据是否相同
 * @param value 
 * @param oldValue 
 * @returns 
 */
export const hasChanged=(value:any,oldValue:any):boolean=>!Object.is(value,oldValue)