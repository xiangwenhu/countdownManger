import { TimeClock } from "./TimeClock";
import { CountManger } from "./CountManger";
import { ITimeClockOptions } from "./types";

export * from "./TimeClock";
export * from "./CountManger";

export * from "./default";

export * from "./types"


export function createCountDownManger(options: ITimeClockOptions) {
    const clock = new TimeClock(options);
    return new CountManger(clock)
}