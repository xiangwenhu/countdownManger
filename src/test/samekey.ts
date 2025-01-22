import { countManager } from "..";

console.log(`client1: ${new Date().toJSON()}: 开始订阅`);
const sR = countManager.subScribe(function ({ value, isOver }) {
    console.log(`client1: ${new Date().toJSON()}: value ${value}`)
}, {
    start: 5 * 1000,
    key: "down1"
});


console.log(`client2: ${new Date().toJSON()}: 开始订阅`);
setTimeout(() => {
    let sR2 = countManager.subScribe(({ value, isOver }) => {
        console.log(`client2: ${new Date().toJSON()}: value ${value}`)
    }, {
        start: 5 * 1000,
        key: "down2"
    });
}, 800);
