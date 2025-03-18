## 构造函数
语法：  
```js
const countManager = new CountManger(options);
```

* options 可选 , 可以是 ITimeClock， 也可以是 ITimeClockOptions

**ITimeClockOptions**  的类型申明如下
```typescript
interface ITimeClockOptions {
    /**
     * 时钟间隔，即时钟多少间隔进行一次检查
     */
    interval: number;
}

```

**ITimeClock** 的类型申明如下, 内置了实现接口的对象为 TimeClock, 一般情况传入ITimeClockOptions 即可满足需要，也可以传入自行实现的时钟。
```typescript
interface ITimeClock {
    /**
     * 定义
     * @param fn
     */
    subscribe(fn: Listener): () => void;
    /**
     * 取消订阅
     * @param fn 
     */
    unSubscribe(fn: Listener): any;
    /**
     * 开始计时
     */
    startTiming(): void;
    /**
     * 结束计时
     */
    stopTiming(): void;
    /**
     * 是否在计时
     */
    isTiming: boolean;
    /**
     * 始终选项
     */
    options: ITimeClockOptions;
    /**
     * 是否有监听函数
     * @param listener 
     * @returns 
     */
    hasListener: (listener: Listener) => boolean
};

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


## 实例方法
返回的实例，申明如下
```typescript
class CountManger {
    constructor(clock: ITimeClock | ITimeClockOptions);
    /**
     *清除结束的且选项未为自动清除的订阅
     */
    subScribe: (listener: Listener, subScribeOptions?: SubScribeOptions) => Readonly<SubScribeResult>;
    unSubscribe: (fn: Function, key: string) => void;
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


```