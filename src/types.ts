
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
    isTiming: boolean;
    /**
     * 始终选项
     */
    options: ITimeClockOptions;
    /**
     * 是否有监听函数
     * @param listener 
     * @returns 
     */
    hasListener: (listener: Listener) => boolean
}


export interface SubscriberInfo {
    /**
     * 起始值
     */
    start: number;
    /**
     * 步距
     */
    step: number;
    /**
     * 结束值
     */
    end: number;
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
     * 计时完毕后是否自动取消订阅
     */
    autoUnsubscribe: boolean;
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
     * 是否已经启用
     */
    enabled: boolean;
    /**
     * 时钟因子，默认是1000，即每次的值变更大小
     */
    clockFactor: number | ((this: SubscriberInfo, clockInterval: number) => number);
}


export type SubScribeOptions = Partial<Pick<SubscriberInfo,
    "start" | "end" | "step" | "autoUnsubscribe" | "key" | "name" | "isDecrease" | "notifyOnSubscribe" | "clockFactor">
>;


export interface SubScribeResult {
    /**
     * 取消订阅
     */
    unSubscribe: () => void;
    /**
     * 键
     */
    key: string;
    /**
     * 开始监听
     */
    startListening: (force?: boolean) => void;
    /**
     * 是否计时结束
     */
    isOver: boolean;
    /**
     * 是否启用了，即调用了 startListening
     */
    enabled: boolean;
    /**
     * 是否已经被取消订阅了
     */
    isValid: boolean;
}