import { ITimeClock, ITimeClockOptions as ICountClockOptions, Listener } from "./types";

const defaultOptions: ICountClockOptions = {
    interval: 1000
}

export class TimeClock implements ITimeClock {

    constructor(private clockOptions: ICountClockOptions = defaultOptions) {
        this.listeners = [];
    }

    get options() {
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
    public isTiming: boolean = false;

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
            this.isTiming = false;
            this.clearTimeout();
        }
    };

    /**
     * 开始计时
     */
    startTiming = () => {
        if (this.isTiming || this.listeners.length === 0) {
            return;
        }
        this.nextExecuteTime = Date.now() + this.options.interval;
        this.isTiming = true;
        this.schedule();
    };

    /**
     * 停止计时
     */
    stopTiming = () => {
        this.isTiming = false;
        this.clearTimeout();
    };

    /**
     * 通知
     */
    private notify = () => {
        if (!this.isTiming) {
            return;
        }

        const { listeners } = this;
        const now = Date.now();

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

        const now = Date.now();
        let planWait = this.nextExecuteTime - now;

        // 当前时间已经超过本次预期执行时间，直接执行，反之，按照修正的计划执行
        if (planWait < 0) {
            // console.log(`clock time planWait < 0:  ${new Date().toJSON()}`);
            this.clearTimeout();
            this.nextExecuteTime += interval;
            this.notify();
            if (this.isTiming) {
                this.schedule();
            }
            return;
        }

        // console.log(`schedule time :  ${new Date().toJSON()}  planWait: ${planWait}`);

        this.ticket = setTimeout(() => {
            // console.log(`clock time:  ${new Date().toJSON()}`);
            this.nextExecuteTime += interval;
            this.notify();
            if (this.isTiming) {
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


     hasListener = (listener: Listener)=> {
        return  this.listeners.includes(listener);
    }
}
