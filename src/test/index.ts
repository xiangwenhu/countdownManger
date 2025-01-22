import { countManager } from "..";

console.log(`${new Date().toJSON()}`);
const startTime = Date.now();
countManager.subScribe(({ value, isOver }) => {
    console.log(`${new Date().toJSON()}: value: ${value}`);

    if(isOver){
        console.log("cost", Date.now() - startTime);
    }

}, {
    start: 10 * 1000,
    end: 58 * 1000,
    step: 2000,
    autoUnsubscribe: true,
    name: "计时哦",
    isDecrease: false
}); 

// console.log(countDownManager.getSubscribers());