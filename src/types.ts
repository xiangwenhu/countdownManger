export type Listener = (time: number) => void;


export interface ICountDownClockOptions {
    interval: number;
}

export interface ICountDownClock {
    subscribe(fn: Listener): () => void;
    startTiming(): void;
    stopTiming(): void;
    isTiming: boolean;
    options: ICountDownClockOptions;
}