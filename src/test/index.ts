import countDownManager from "..";

const unSubscribe = countDownManager.subScribe((left) => {

    console.log(`${new Date().toLocaleTimeString()}: left ${left}`);

    if (left <= 0) {
        unSubscribe();
    }
}, 60 * 1000, 0); 