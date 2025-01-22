import { CounClock } from "./TimeClock";
import { CountManger } from "./CountManger";

const clock = new CounClock();
export const countManager = new CountManger(clock);



