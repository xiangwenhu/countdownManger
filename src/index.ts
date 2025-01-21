import CountDownClock from "./CountDownClock";
import CountDownManger from "./CountDownManger";

const clock = new CountDownClock();
const countDownManager = new CountDownManger(clock);

export default countDownManager;


