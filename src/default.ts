import { TimeClock } from "./TimeClock";
import { CountManger } from "./CountManger";

const clock = new TimeClock();
export const countManager = new CountManger(clock);



