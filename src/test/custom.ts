import CountDownClock from "../CountDownClock";
import CountDownManger from "../CountDownManger";

const clock = new CountDownClock({
    interval: 500
});
const countDownManager = new CountDownManger(clock);

countDownManager.subScribe((left) => {

    console.log(`${new Date().toLocaleTimeString()}: left ${left}`)
}, 10 * 1000, 0); 