import { CounClock, CountManger } from "..";

const clock = new CounClock({
    interval: 1000
});
const countDownManager = new CountManger(clock);

var un1 = countDownManager.subScribe(({ value }) => {
    console.log(`client1: ${new Date().toJSON()}: value ${value}`)
    // @ts-ignore
    // un1 && un1();
}, {
    start: 10 * 1000,
    key: "down1"
});
console.log(`client1: ${new Date().toJSON()}: 订阅完毕`);

let un2 = setTimeout(() => {
    countDownManager.subScribe(({ value }) => {

        console.log(`client2: ${new Date().toJSON()}: value ${value}`)
    }, {
        start: 12 * 1000,
        key: "down1"
    });
}, 100);
console.log(`client2: ${new Date().toJSON()}: 订阅完毕`);