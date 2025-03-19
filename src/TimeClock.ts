import { ITimeClock, ITimeClockOptions, Listener } from "./types";

const defaultOptions: ITimeClockOptions = {
    interval: 1000
}

export class TimeClock implements ITimeClock {

    constructor(private clockOptions: ITimeClockOptions = defaultOptions) {
        this.listeners = [];
    }

    get options(): ITimeClockOptions {
        return {
            ...this.clockOptions
        }
    }

    /**
     * 监听函数
     */
    private listeners: Listener[];

    /**
     * 是否在计时
     */
    private _isTiming: boolean = false;

    /**
     * 计时器id
     */
    private ticket: any;

    /**
     * 下次计划时间
     */
    private nextExecuteTime: number = 0;

    /**
     * 删除监听
     * @param fn
     */
    private removeListener = (fn: Listener) => {
        const index = this.listeners.findIndex(f => f === fn);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    };

    /**
     * 添加监听
     * @param fn
     */
    private addListener = (fn: Listener) => {
        this.listeners.push(fn);
    };

    get isTiming() {
        return this._isTiming;
    }

    /**
     * 订阅
     * @param listener
     */
    subscribe = (listener: Listener) => {
        this.addListener(listener);
        return () => this.unSubscribe(listener);
    };

    /**
     * 取消订阅
     * @param listener
     */
    unSubscribe = (listener: Listener) => {
        this.removeListener(listener);
        if (this.listeners.length === 0) {
            this._isTiming = false;
            this.clearTimeout();
        }
    };

    private get now() {
        return performance.now();
    }

    /**
     * 开始计时
     */
    startTiming = () => {
        if (this._isTiming || this.listeners.length === 0) {
            return;
        }
        this.nextExecuteTime = this.now + this.options.interval;
        this._isTiming = true;
        this.schedule();
    };

    /**
     * 停止计时
     */
    stopTiming = () => {
        this._isTiming = false;
        this.clearTimeout();
    };

    /**
     * 通知
     */
    private notify = () => {
        if (!this._isTiming) {
            return;
        }

        const { listeners } = this;
        const now = this.now;

        listeners.forEach(fn => {
            fn.call(null, {
                value: now,
                isOver: false
            });
        });
    };

    /**
     * 计划
     */
    private schedule = () => {
        const { interval } = this.options;

        const now = performance.now();
        let planWait = this.nextExecuteTime - now;

        // 当前时间已经超过本次预期执行时间，直接执行，反之，按照修正的计划执行
        if (planWait < 0) {
            // console.log(`clock time planWait < 0:  ${new Date().toJSON()}`);
            this.clearTimeout();
            this.nextExecuteTime += interval;
            this.notify();
            if (this._isTiming) {
                this.schedule();
            }
            return;
        }

        // console.log(`schedule time :  ${new Date().toJSON()}  planWait: ${planWait}`);

        this.ticket = setTimeout(() => {
            // console.log(`clock time:  ${new Date().toJSON()}`);
            this.nextExecuteTime += interval;
            this.notify();
            if (this._isTiming) {
                this.schedule();
            }
        }, planWait);
    };

    /**
     * 停止计时
     */
    private clearTimeout = () => {
        if (this.ticket) clearTimeout(this.ticket);
        this.ticket = undefined;
    };

    /**
     * 检查是否有某个监听者
     * @param listener 
     * @returns 
     */
    hasListener = (listener: Listener) => {
        return this.listeners.includes(listener);
    }
}
