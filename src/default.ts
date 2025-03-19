import { TimeClock } from "./TimeClock";
import { Counter } from "./Counter";

const clock = new TimeClock();
export const counter = new Counter(clock);



