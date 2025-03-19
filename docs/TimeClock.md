# TimeClock
计时的时钟。有CountManager关联时，就一直运行，没有会自动停止运行。

示例： 
```typescript
import { CountManger, TimeClock } from "../"
// 创建时钟
const clock = new TimeClock({
    interval: 100
});

const cm = new CountManger(clock);

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
```

## 构造函数
语法：  
```typescript
const clock = new CountManger(options?: ITimeClockOptions);
```

**ITimeClockOptions**  的类型申明如下
```typescript
interface ITimeClockOptions {
    /**
     * 时钟间隔，即时钟多少间隔运行一次
     */
    interval: number;
}
```


## 实例方法

``` typescript
class TimeClock implements ITimeClock {
    constructor(clockOptions?: ITimeClockOptions);
    /**
     * 获取选项
     */
    get options(): ITimeClockOptions;
    /**
     * 是否在计时
     */
    get isTiming(): boolean;
    /**
     * 订阅
     * @param listener
     */
    subscribe: (listener: Listener) => () => void;
    /**
     * 取消订阅
     * @param listener
     */
    unSubscribe: (listener: Listener) => void;
    /**
     * 开始计时
     */
    startTiming: () => void;
    /**
     * 停止计时
     */
    stopTiming: () => void;
    hasListener: (listener: Listener) => boolean;
}

type Listener = (data: {
    /**
     * 值
     */
    value: number;
    /**
     * 是否结束
     */
    isOver: boolean
}) => void;
```
