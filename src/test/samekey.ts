import { counter } from "..";

console.log(`subScriber1: ${new Date().toJSON()}: 开始订阅`);
const startTime = Date.now();
const subScriber1 = counter.subScribe(function ({ value, isOver }) {
    console.log(`subScriber1: ${new Date().toJSON()}: value ${value}`)

    if (isOver) {
        console.log(`${new Date().toJSON()}: cost:`, Date.now() - startTime);
    }
}, {
    start: 5 * 1000,
    key: "down1"
});
subScriber1.startListening();

console.log(`client2: ${new Date().toJSON()}: 开始订阅`);
setTimeout(() => {
    let subScriber2 = counter.subScribe(({ value, isOver }) => {
        console.log(`subScriber2: ${new Date().toJSON()}: value ${value}`)
    }, {
        start: 10 * 1000,
        key: "down1"
    });
}, 800);
