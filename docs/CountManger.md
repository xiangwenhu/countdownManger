
# CountManger
计时管理器。   

示例：
```typescript
const cm = new CountManger();
const startTime = Date.now();

const subscriber = cm.subScribe(function ({ value, isOver }) {
    console.log(`${new Date().toJSON()}: ${value}`);
    if (isOver) {
        console.log(`${new Date().toJSON()}: cost:`, Date.now() - startTime);
    }
});

subscriber.startListening();
```

## 构造函数
语法：  
```typescript
const countManager = new CountManger(options?: ITimeClockOptions | ITimeClock);
```

**ITimeClockOptions**
```typescript
interface ITimeClockOptions {
    /**
     * 时钟间隔，即时钟多少间隔进行一次检查
     */
    interval: number;
}

```

**ITimeClock**   
内置了实现 `ITimeClock` 的对象为 [TimeClock](./TimeClock.md), 一般情况传入ITimeClockOptions 即可满足需要，也可以传入自行实现了 `ITimeClock` 的时钟。


## 实例方法
返回的实例，申明如下
```typescript
class CountManger {
    constructor(clock: ITimeClock | ITimeClockOptions);
    /**
     * 订阅
     */
    subScribe: (listener: Listener, subScribeOptions?: SubScribeOptions) => Readonly<SubScribeResult>;
    /**
     * 取消订阅
     */
    unSubscribe: (fn: Function, key: string) => void;
    /**
     * 获取订阅信息
     */
    getSubscribers: () => Readonly<SubscriberInfo>[];
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


interface SubScribeOptions{
    /**
     * 起始值, 默认值 60*1000
     */
    start?: number;
    /**
     * 步距 ，默认值 1000
     */
    step?: number;
    /**
     * 结束值，默认值 0
     */
    end?: number;
    /**
     * 计时完毕后是否自动取消订阅，默认值 true
     */
    autoUnsubscribe?: boolean;
    /**
     * 键, 默认值：无
     */
    key?: string;
    /**
     * 名称，统计用，默认值 空字符串
     */
    name?: string;
    /**
     * 减少还是增加，默认值 true
     */
    isDecrease?: boolean;
    /**
     * 订阅时是否执行监听函数, 默认值 true
     */
    notifyOnSubscribe?: boolean;
    /**
     * 时钟因子，默认值是时钟的interval值
     */
    clockFactor?: number | ((this: SubscriberInfo, clockInterval: number) => number);
}


interface SubScribeResult {
    /**
     * 取消订阅
     */
    unSubscribe: () => void;
    /**
     * 键
     */
    get key(): string;
    /**
     * 开始监听
     */
    startListening: (force?: boolean) => void;
    /**
     * 是否计时结束
     */
    get isOver(): boolean;
    /**
     * 是否启用了，即调用了 startListening
     */
    get enabled(): boolean;
    /**
     * 是否已经被取消订阅了
     */
    get isValid(): boolean;
}

interface SubscriberInfo extends SubScribeOptions {
    /**
     * 当前值
     */
    value: number;
    /**
     * 下一次的期待值
     */
    nextStepValue: number;
    /**
     * 是否已经启用
     */
    enabled: boolean;
}

```