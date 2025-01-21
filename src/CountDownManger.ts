import { ICountDownClock, Listener } from './types';
import { noop } from './util';
import uuid from './uuid';

export default class CountDownManger {

    constructor(private clock: ICountDownClock) { }

    private _unSubscribe: () => void = noop;

    private clientsMap: Record<
        string,
        {
            start: number;
            left: number;
            end: number;
            listeners: Listener[];
        }
    > = {};

    private onUpdate = () => {

        const interval = this.clock.options.interval;

        for (const p in this.clientsMap) {
            const c = this.clientsMap[p];
            if (c.left <= c.end) {
                continue;
            }
            const { listeners } = c;
            c.left = c.left - interval;
            const oldListeners = [...listeners];
            oldListeners.forEach(f => f.call(null, c.left));
        }
    };


    subScribe(fn: Listener, start = 60 * 1000, end: number = 0, key: string = `${uuid()}`): () => void {
        let c = this.clientsMap[key];
        if (!c) {
            c = {
                start,
                end,
                left: start,
                listeners: [],
            };
            // 当前没有注册，需要往countdown注册
            if (Object.keys(this.clientsMap).length === 0) {
                this._unSubscribe = this.clock.subscribe(this.onUpdate);
            }
            this.clientsMap[key] = c;
            fn.call(null, c.left);
        }

        c.listeners.push(fn);

        // 计时器未计时，开启计时
        if (!this.clock.isTiming) {
            this.clock.startTiming();
        }

        return () => {
            this.unSubscribe(fn, key);
        };
    }

    private unSubscribe = (fn: Function, key: string) => {
        const c = this.clientsMap[key];
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
            delete this.clientsMap[key];
        }

        // 没有监听，停止计时
        if (Object.keys(this.clientsMap).length === 0) {
            this._unSubscribe();
        }
    };
}