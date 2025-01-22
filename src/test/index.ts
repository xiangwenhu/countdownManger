import { countManager } from "..";

const startTime = Date.now();

console.log(`${new Date().toJSON()}: 开始订阅`);

countManager.subScribe(({ value, isOver }) => {
    console.log(`${new Date().toJSON()}: value: ${value}`);
    if(isOver){
        console.log(`${new Date().toJSON()}: cost:`, Date.now() - startTime);
    }
}, {
    start: 10 * 1000,
    autoUnsubscribe: true,
    name: "计时哦"
}); 
