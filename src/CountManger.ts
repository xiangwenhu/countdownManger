import { ITimeClock, Listener, SubScribeOptions, SubScribeResult, SubscriberInfo } from './types';
import { noop } from './util';
import uuid from './uuid';

export class CountManger {

    constructor(private clock: ITimeClock) { }

    /**
     * 取消时钟订阅
     */
    private unSubscribeClock: () => void = noop;

    /**
     * 订阅信息
     */
    private subscribersMap: Record<string, SubscriberInfo> = {};


    /**
     * 检查订阅是否解释
     * @param subscribe 
     * @returns 
     */
    private isOver(subscribe: SubscriberInfo) {
        const isDecrease = !!subscribe.isDecrease;
        const { value } = subscribe;

        if (isDecrease) {
            return value <= subscribe.end

        }
        return value >= subscribe.end
    }

    private getExecuteInfo(subscribe: SubscriberInfo) {
        const interval = this.clock.options.interval;
        const isDecrease = !!subscribe.isDecrease;
        const { value: oldValue, nextStepValue, step } = subscribe;

        const isOver = this.isOver(subscribe);

        //  end < value < start
        if (isDecrease) {
            const newValue = subscribe.value - interval;
            return {
                isOver,
                oldValue: oldValue,
                newValue: newValue,
                // 旧的值大于 下一次期待值，新值小于等于下一次期待值
                executable: oldValue > subscribe.nextStepValue && newValue <= subscribe.nextStepValue,
                nextStepValue: nextStepValue - step
            }
        }

        // start < value < end
        const newValue = subscribe.value + interval;
        return {
            isOver,
            oldValue: oldValue,
            newValue: newValue,
            // 旧的值小于 下一次期待值，新值大于等于下一次期待值
            executable: oldValue < subscribe.nextStepValue && newValue >= subscribe.nextStepValue,
            nextStepValue: nextStepValue + step
        }

    }

    private onUpdate = () => {

        // 先执订阅函数
        for (const key in this.subscribersMap) {
            const subscribe = this.subscribersMap[key];

            const { isOver, newValue, executable, nextStepValue } = this.getExecuteInfo(subscribe);

            // 检查是否结束
            if (isOver) {
                continue;
            }
            subscribe.value = newValue;
            if (!executable) continue;

            // 重新计算下一次的期待值
            subscribe.nextStepValue = nextStepValue;

            const { listeners } = subscribe;
            const oldListeners = [...listeners];
            oldListeners.forEach(f => f.call(null, {
                value: subscribe.value,
                isOver: this.isOver(subscribe)
            }));

        }

        this.clearIsOverSubscribe();
    };

    private clearIsOverSubscribe() {
        // 检查到期切自定取消订阅的
        for (const key in this.subscribersMap) {
            const subscribe = this.subscribersMap[key];
            const info = this.getExecuteInfo(subscribe);
            if (info.isOver && subscribe.autoUnsubscribe) {
                subscribe.listeners.forEach(l => this.unSubscribe(l, subscribe.key))
            }
        }
    }

    subScribe(fn: Listener, options: SubScribeOptions = {}): SubScribeResult {

        const { key = uuid(), start = 60 * 1000, end = 0, autoUnsubscribe = true, step = 1000, name = '', isDecrease = true } = options;

        // 在clock注册
        if (Object.keys(this.subscribersMap).length === 0) {
            this.unSubscribeClock = this.clock.subscribe(this.onUpdate);
        }

        let c: SubscriberInfo = this.subscribersMap[key];

        const value = start;
        const nextStepValue = isDecrease ? start - step : start + step;
        const isOver = isDecrease ? end >= start : start >= end;

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
                isDecrease
            };

            this.subscribersMap[key] = c;
            fn.call(null, {
                value,
                isOver
            });
        }

        c.listeners.push(fn);

        // 计时器未计时，开启计时
        if (!this.clock.isTiming) {
            this.clock.startTiming();
            // Promise.resolve().then(()=> this.clock.startTiming())
        }

        return {
            unSubscribe: () => this.unSubscribe(fn, key),
            key
        };
    }



    unSubscribe = (fn: Function, key: string) => {
        const c = this.subscribersMap[key];
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
            delete this.subscribersMap[key];
        }

        // 没有监听，停止计时
        if (Object.keys(this.subscribersMap).length === 0) {
            this.unSubscribeClock();
        }
    };

    getSubscribers() {
        return Object.values(this.subscribersMap)
    }
}