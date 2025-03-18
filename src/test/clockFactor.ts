import { CountManger } from "..";

const countManager = new CountManger({
    interval: 100
})

const startTime = Date.now();

let lastTime = startTime;

console.log(`${new Date().toJSON()}: 开始订阅`);

const subScriber = countManager.subScribe(({ value, isOver }) => {

    const now = Date.now();

    console.log(`${new Date().toJSON()}: value: ${value}, cost: `, now - lastTime);

    if (isOver) {
        console.log(`${new Date().toJSON()}: total cost:`, now - startTime);
    }
    lastTime = now;

}, {
    start: 1* 1000,
    end: 0 * 1000,
    step: 100,
    clockFactor(s) {
        return s / 10
    },
    autoUnsubscribe: true,
    name: "计时哦",
    notifyOnSubscribe: false
});

subScriber.startListening();