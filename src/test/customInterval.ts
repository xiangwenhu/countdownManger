import { Counter } from "../"

const cm = new Counter({
    interval: 100
});

const startTime = Date.now();

const subscriber = cm.subScribe(function ({ value, isOver }) {
    console.log(`${new Date().toJSON()}: ${value}`);
    if (isOver) {
        console.log(`${new Date().toJSON()}: cost:`, Date.now() - startTime);
    }
}, {
    start: 500,
    step: 100
});

subscriber.startListening();
