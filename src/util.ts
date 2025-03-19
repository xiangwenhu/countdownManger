import { ITimeClock } from "./types";

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

    const clock: ITimeClock = obj as ITimeClock;

    return (
        isFunction(clock.subscribe) && isFunction(clock.unSubscribe)
        && isFunction(clock.startTiming) && isFunction(clock.stopTiming)
        && isFunction(clock.hasListener)
        && ("isTiming" in clock) && ("options" in clock)
    )
}
