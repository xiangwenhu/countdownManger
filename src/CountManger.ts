import { DefaultSubscribeOptions } from './const';
import { TimeClock } from './TimeClock';
import { ITimeClock, ITimeClockOptions, Listener, SubScribeOptions, SubScribeResult, SubscriberInfo } from './types';
import { isTimeClock, noop } from './util';
import uuid from './uuid';

export class CountManger {

    private clock: ITimeClock;

    constructor(clock: ITimeClock | ITimeClockOptions = {
        interval: 1000
    }) {
        this.clock = isTimeClock(clock) ? clock as ITimeClock : new TimeClock(clock as ITimeClockOptions)
    }

    /**
     * 取消时钟订阅
     */
    private unSubscribeClock: () => void = noop;

    /**
     * 订阅信息
     */
    private subscribersMap: Map<string, SubscriberInfo> = new Map();


    /**
     * 检查订阅是否解释
     * @param subscriber 
     * @returns 
     */
    private isOver(subscriber: SubscriberInfo) {
        const isDecrease = !!subscriber.isDecrease;
        const { value } = subscriber;

        if (isDecrease) {
            return value <= subscriber.end

        }
        return value >= subscriber.end
    }

    private getClockFactor = (subscriber: SubscriberInfo) => {

        const interval = this.clock.options.interval;

        let clockFactor: number = interval;

        if (typeof subscriber.clockFactor === "number")
            clockFactor = subscriber.clockFactor;

        if (typeof subscriber.clockFactor === "function") {
            const factor = subscriber.clockFactor.call({ ...subscriber }, interval);
            if (typeof factor === "number")
                clockFactor = factor
        }

        return Math.ceil(clockFactor)
    }

    /**
     * 获取下执行的数据信息
     * @param subscriber 
     * @returns 
     */
    private getExecuteInfo(subscriber: SubscriberInfo) {
        const clockFactor = this.getClockFactor(subscriber);
        const isDecrease = !!subscriber.isDecrease;
        const { value: oldValue, nextStepValue, step } = subscriber;

        const isOver = this.isOver(subscriber);

        //  end < value < start
        if (isDecrease) {
            const newValue = subscriber.value - clockFactor;
            return {
                isOver,
                oldValue: oldValue,
                newValue: newValue,
                // 旧的值大于 下一次期待值，新值小于等于下一次期待值
                executable: oldValue > subscriber.nextStepValue && newValue <= subscriber.nextStepValue,
                nextStepValue: nextStepValue - step
            }
        }

        // start < value < end
        const newValue = subscriber.value + clockFactor;
        return {
            isOver,
            oldValue: oldValue,
            newValue: newValue,
            // 旧的值小于 下一次期待值，新值大于等于下一次期待值
            executable: oldValue < subscriber.nextStepValue && newValue >= subscriber.nextStepValue,
            nextStepValue: nextStepValue + step
        }

    }

    private getSubscriberInitValue = (subscriber: Pick<SubscriberInfo, "start" | "isDecrease" | "step" | "end">) => {
        const { start, isDecrease, step, end } = subscriber;

        const value = start;
        const nextStepValue = isDecrease ? start - step : start + step;
        const isOver = isDecrease ? end >= start : start >= end;

        return {
            value,
            nextStepValue,
            isOver,
            end,
            start
        }
    }

    private onUpdate = () => {
        const subscribers = this.getEnabledSubscribers();

        for (let i = 0; i < subscribers.length; i++) {
            const subscriber = subscribers[i];

            const { isOver, newValue, executable, nextStepValue } = this.getExecuteInfo(subscriber);

            // 检查是否结束
            if (isOver) {
                continue;
            }
            subscriber.value = newValue;
            if (!executable) continue;

            // 重新计算下一次的期待值
            subscriber.nextStepValue = nextStepValue;

            const { listeners } = subscriber;
            const oldListeners = [...listeners];

            let isOverValue = this.isOver(subscriber);
            // 清理
            if (isOverValue) this.clearIsOverSubscribe();
            oldListeners.forEach(f => f.call(null, {
                value: subscriber.value,
                isOver: isOverValue
            }));

        }

        // if (hasNewIsOverItem) {
        //     this.clearIsOverSubscribe();
        // }
    };

    /**
     *清除结束的且选项未为自动清除的订阅
     */
    private clearIsOverSubscribe() {
        const subscribers = this.getEnabledSubscribers();
        for (let i = 0; i < subscribers.length; i++) {
            const subscriber = subscribers[i];
            const info = this.getExecuteInfo(subscriber);
            if (info.isOver && subscriber.autoUnsubscribe) {
                // TODO::
                for (let i = subscriber.listeners.length - 1; i >= 0; i--) {
                    const l = subscriber.listeners[i];
                    this.unSubscribe(l, subscriber.key)
                }
            }
        }
    }

    subScribe = (listener: Listener, subScribeOptions: SubScribeOptions = {}) => {
        const key = subScribeOptions.key || uuid();

        const options = {
            ...subScribeOptions,
            key
        };

        this.registerSubscriber(listener, options);

        const that = this;
        const result: SubScribeResult = {
            unSubscribe: () => this.unSubscribe(listener, key),
            key,
            startListening: (force: boolean = false) => {
                const subscriber = this.getSubscriber(key);
                if (!subscriber) {
                    throw new Error(`key为${key}的订阅已经被取消`);
                }

                const isOver = this.isOver(subscriber);
                if (subscriber.enabled && !isOver) return console.warn("已经处于监听状态，无需重复调用");

                const { value, nextStepValue } = this.getSubscriberInitValue(subscriber);

                subscriber.enabled = true;
                subscriber.value = value;
                subscriber.nextStepValue = nextStepValue;
                this.check();

            },
            get isOver() {
                const subscriber = that.getSubscriber(key);
                if (!subscriber) return true;
                return that.isOver(subscriber)
            },
            get enabled() {
                const subscriber = that.getSubscriber(key);
                if (!subscriber) return false;
                return subscriber.enabled;
            },
            get isValid() {
                return that.hasSubscriber(key, listener)
            }
        }

        return Object.freeze(result);
    }

    private registerSubscriber = (listener: Listener, options: SubScribeOptions = {}) => {
        const { key = uuid(),
            start = 60 * 1000,
            end = 0,
            autoUnsubscribe = true,
            step = 1000,
            name = '',
            isDecrease = true,
            notifyOnSubscribe = true,
            clockFactor = this.clock.options.interval
        } = Object.assign({}, DefaultSubscribeOptions, options);

        let c: SubscriberInfo | undefined = this.subscribersMap.get(key);

        const { value, nextStepValue, isOver } = this.getSubscriberInitValue({ start, end, step, isDecrease });

        if (!c) {
            c = {
                start,
                end,
                step,
                value,
                nextStepValue,
                listeners: [],
                autoUnsubscribe,
                key,
                name,
                isDecrease,
                notifyOnSubscribe,
                enabled: false,
                clockFactor
            };
            this.subscribersMap.set(key, c);
        }
        c.listeners.push(listener);
        if (notifyOnSubscribe) {
            const val = this.getSubScribeValue(key) || value;
            listener.call(null, {
                // 同key的，不能取当前值
                value: val,
                isOver
            });
        }
    }

    private getSubScribeValue = (key: string) => {
        const subScribeInfo = this.getSubscriber(key);
        if (!subScribeInfo) return undefined;
        const listeners = subScribeInfo.listeners;
        if (listeners.length === 0) return undefined;
        // 一个以上
        if (listeners.length >= 1) return subScribeInfo.value;
    }


    private check = () => {

        const hasEnabledSubscribers = this.hasEnabledSubscribers();
        if (!hasEnabledSubscribers) return;

        if (!this.clock.hasListener(this.onUpdate)) {
            // 在clock注册
            this.unSubscribeClock = this.clock.subscribe(this.onUpdate);
        }

        // 计时器未计时，开启计时
        if (this.clock.isTiming) {
            return;
        }
        this.clock.startTiming();
    }


    unSubscribe = (fn: Function, key: string) => {
        const c = this.subscribersMap.get(key);
        if (!c) {
            return;
        }
        const index = c.listeners.findIndex(f => f === fn);
        if (index < 0) {
            return;
        }

        // 删除监听事件
        c.listeners.splice(index, 1);

        // 如果没有监听事件了，删除数据
        if (c.listeners.length === 0) {
            this.subscribersMap.delete(key)
        }

        const hasEnabledSubscribers = this.hasEnabledSubscribers();
        // 没有监听，停止计时
        if (!hasEnabledSubscribers) {
            this.unSubscribeClock();
        }
    };

    getSubscribers = () => {
        return [...this.subscribersMap.values()].map(v => Object.freeze(v));
    }


    private hasSubscriber = (key: string, listener: Listener) => {
        const s = this.subscribersMap.get(key);
        if (!s) return false;
        return s.listeners.includes(listener);
    }

    private getSubscriber = (key: string) => {
        const s = this.subscribersMap.get(key);
        return s
    }

    private getEnabledSubscribers = () => {
        return Array.from(this.subscribersMap.values()).filter(s => s.enabled);
    }

    private hasEnabledSubscribers = () => {
        return this.getEnabledSubscribers().length > 0;
    }

}