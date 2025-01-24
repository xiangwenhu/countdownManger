import { countManager } from "..";

console.log(`subScriber1: ${new Date().toJSON()}: 开始订阅`);
const subScriber1 = countManager.subScribe(function ({ value, isOver }) {
    console.log(`subScriber1: ${new Date().toJSON()}: value ${value}`)
}, {
    start: 5 * 1000,
    name: "5秒",
    key: "1"
});

console.log(`subScriber2: ${new Date().toJSON()}: 开始订阅`);

let subScriber2 = countManager.subScribe(({ value, isOver }) => {
    console.log(`subScriber2: ${new Date().toJSON()}: value ${value}`)
}, {
    start: 10 * 1000,
    name: "10秒"
});

console.log(`subScriber3: ${new Date().toJSON()}: 开始订阅`);

let subScriber3 = countManager.subScribe(({ value, isOver }) => {
    console.log(`subScriber2: ${new Date().toJSON()}: value ${value}`)
}, {
    start: 10 * 1000,
    name: "10秒",
    key: "1"
});


console.log("subscribers", countManager.getSubscribers());