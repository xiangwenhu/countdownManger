import { Counter } from "..";

const counter = new Counter({
    interval: 100
})

const startTime = Date.now();

let lastTime = startTime;

console.log(`${new Date().toJSON()}: 开始订阅`);

const subScriber = counter.subScribe(({ value, isOver }) => {

    const now = Date.now();

    console.log(`${new Date().toJSON()}: value: ${value}, cost: `, now - lastTime);

    if (isOver) {
        console.log(`${new Date().toJSON()}: total cost:`, now - startTime);
    }
    lastTime = now;

}, {
    start: 60 * 1000,
    end: 0 * 1000,
    step: 100,
    /**
     * 时钟每次执行值变化的数值
     * 如果变化数值直大于等于step的值，会立即会调用订阅函数
     * 如果变化的数值小于step的值，当多次累计变化的值大于等于step时，会调用订阅函数
     */
    clockFactor(s) {
        return  1000
    },
    autoUnsubscribe: true,
    name: "计时哦",
    notifyOnSubscribe: false
});

subScriber.startListening();