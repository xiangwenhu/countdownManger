/**
 * 时钟选项
 */
export interface ITimeClockOptions {
    /**
     * 时钟间隔
     */
    interval: number;
}


export type Listener = (data: {
    /**
     * 值
     */
    value: number;
    /**
     * 是否结束
     */
    isOver: boolean
}) => void;

export interface ITimeClock {
    /**
     * 定义
     * @param fn
     */
    subscribe(fn: Listener): () => void;
    /**
     * 取消订阅
     * @param fn 
     */
    unSubscribe(fn: Listener): any;
    /**
     * 开始计时
     */
    startTiming(): void;
    /**
     * 结束计时
     */
    stopTiming(): void;
    /**
     * 是否在计时
     */
    get isTiming(): boolean;
    /**
     * 始终选项
     */
    get options(): ITimeClockOptions;
    /**
     * 是否有监听函数
     * @param listener 
     * @returns 
     */
    hasListener: (listener: Listener) => boolean
}


interface SubScribeFullOptions {
    /**
     * 起始值
     */
    start: number;
    /**
     * 结束值
     */
    end: number;
    /**
     * 步距
     */
    step: number;
    /**
     * 计时完毕后是否自动取消订阅
     */
    autoUnsubscribe: boolean;
    /**
     * 键，键相同的订阅，同步更新
     */
    key: string;
    /**
     * 名称，统计用
     */
    name: string;
    /**
     * 减少还是增加
     */
    isDecrease: boolean;
    /**
     * 订阅时是否执行监听函数
     */
    notifyOnSubscribe: boolean;
    /**
     * 时钟因子，即每次时钟执行的值变化的大小， 默认值等于时钟的interval
     * 如果变化数值直大于等于step的值，会立即会调用订阅函数
     * 如果变化的数值小于step的值，当多次累计变化的值大于等于step时，会调用订阅函数
     */
    clockFactor: number | ((this: Omit<SubscriberInfo, "listeners">, clockInterval: number) => number);
}

export type SubScribeOptions = Partial<SubScribeFullOptions>;

export interface SubscriberInfo extends SubScribeFullOptions {
    /**
     * 当前值
     */
    value: number;
    /**
     * 下一次的期待值
     */
    nextStepValue: number;
    /**
     * 监听函数
     */
    listeners: Listener[];
    /**
     * 是否已经启用
     */
    enabled: boolean;
}




export interface SubScribeResult {
    /**
     * 取消订阅
     */
    unSubscribe: () => void;
    /**
     * 键
     */
    get key(): string;
    /**
     * 开始监听
     */
    startListening: (force?: boolean) => void;
    /**
     * 是否计时结束
     */
    get isOver(): boolean;
    /**
     * 是否启用了，即调用了 startListening
     */
    get enabled(): boolean;
    /**
     * 是否已经被取消订阅了
     */
    get isValid(): boolean;
}