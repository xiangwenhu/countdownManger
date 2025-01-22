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
    listeners: Listener[];
    autoUnsubscribe: boolean;
    key: string;
    name: string;
    isDecrease: boolean;
}


export type  SubScribeOptions = Partial<Pick<SubscriberInfo, "start" | "end" | "step" | "autoUnsubscribe" | "key" | "name" | "isDecrease">> 