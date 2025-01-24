const hasOwnProperty = Object.prototype.hasOwnProperty

export const noop = () => { };


export function isObject(obj: any) {
    return obj !== null && typeof obj === "object";
}

export function isFunction(fn: any) {
    return typeof fn === "function"
}

export function hasown(obj: Object, prop: PropertyKey) {
    return hasOwnProperty.call(obj, prop)
}

export function isTimeClock(obj: any) {
    if (!isObject(obj)) return false;

    return isFunction(obj.subscribe) && isFunction(obj.unSubscribe)
        && isFunction(obj.startTiming) && isFunction(obj.stopTiming)
        && hasown(obj, "isTiming") && hasown(obj, "hasListener")

}