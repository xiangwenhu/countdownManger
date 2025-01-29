export type Listener = (data: {
    value: number;
    isOver: boolean
}) => void;


export interface ITimeClockOptions {
    interval: number;
}

export interface ITimeClock {
    subscribe(fn: Listener): () => void;
    unSubscribe(fn: Listener): any;
    startTiming(): void;
    stopTiming(): void;
    isTiming: boolean;
    options: ITimeClockOptions;
    hasListener: (listener: Listener) => boolean
}


export interface SubscriberInfo {
    start: number;
    step: number;
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
     * 时钟因子，默认是1，即每次的值变更大小为  clockFactor* clock.interval 
     */
    clockFactor: number;    
}


export type SubScribeOptions = Partial<Pick<SubscriberInfo,
    "start" | "end" | "step" | "autoUnsubscribe" | "key" | "name" | "isDecrease" | "notifyOnSubscribe"  | "clockFactor">
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