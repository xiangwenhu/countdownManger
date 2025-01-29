import { CountManger } from "..";

const countManager = new CountManger({
    interval: 100
})

const startTime = Date.now();

console.log(`${new Date().toJSON()}: 开始订阅`);

const subScriber = countManager.subScribe(({ value, isOver }) => {
    console.log(`${new Date().toJSON()}: value: ${value}`);

    if (isOver) {
        console.log(`${new Date().toJSON()}: cost:`, Date.now() - startTime);
    }
}, {
    start: 10 * 1000,
    end: 0 * 1000,
    step: 10,
    clockFactor(s) {
        return s/10
    },
    autoUnsubscribe: true,
    name: "计时哦",
    notifyOnSubscribe: false
});

subScriber.startListening();