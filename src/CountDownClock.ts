import { ICountDownClock, ICountDownClockOptions, Listener } from "./types";

const defaultOptions: ICountDownClockOptions = {
    interval: 1000
}

export default class CountDownClock implements ICountDownClock {

    constructor(public options: ICountDownClockOptions = defaultOptions) {
        this.listeners = [];
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
     * 上次执行时间
     */
    private lastTime: number = 0;


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
        if (this.isTiming) {
            return;
        }
        this.lastTime = Date.now();
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
            fn.call(null, now);
        });

        // notify过程中，有可能取消订阅
        if (!this.isTiming) {
            return;
        }

        this.schedule();
    };

    /**
     * 计划
     */
    private schedule = () => {
        const now = Date.now();
        const { interval } = this.options;

        // 下次计时器执行间隔
        let planWait = interval - (now - this.lastTime);

        // 当前时间已经超过本次预期执行时间，直接执行，反之，按照修正的计划执行
        if (planWait < 0) {
            planWait = interval;
            this.lastTime = Date.now();
            this.clearTimeout();
            this.notify();
        }

        this.ticket = setTimeout(() => {
            // 记录上一次的时间
            this.lastTime = Date.now();
            this.notify();
        }, planWait);
    };

    /**
     * 停止计时
     */
    private clearTimeout = () => {
        if (this.ticket) clearTimeout(this.ticket);
        this.ticket = undefined;
    };
}
