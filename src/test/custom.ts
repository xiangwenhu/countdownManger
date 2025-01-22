import { CounClock, CountManger, Listener } from "..";

const clock = new CounClock({
    interval: 1000
});
const countDownManager = new CountManger(clock);

const sR = countDownManager.subScribe(function ({ value, isOver }) {
    console.log(`client1: ${new Date().toJSON()}: value ${value}`)
    if (isOver) {
        sR.unSubscribe()
    }
}, {
    start: 10 * 1000,
    key: "down1"
});


console.log(`client1: ${new Date().toJSON()}: 订阅完毕`);

setTimeout(() => {
    let sR2 = countDownManager.subScribe(({ value, isOver }) => {

        console.log(`client2: ${new Date().toJSON()}: value ${value}`)

        if (isOver) {
            sR2.unSubscribe();
        }

    }, {
        start: 12 * 1000,
        key: "down2"
    });
}, 100);
console.log(`client2: ${new Date().toJSON()}: 订阅完毕`);