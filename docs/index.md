## count-manger

## 核心 API
* [CountManager](./CountManger.md)
* [TimeClock](./TimeClock.md) 

## 示例  

### 使用默认时钟的CountManager

内置了时钟间隔为 1000ms的 CountManager实例，可以直接导出并使用，如果不能满足需要，可以创建满足自己需要的实例。

```typescript
import { countManager } from "count-manger";

const startTime = Date.now();

console.log(`${new Date().toJSON()}: 开始订阅`);

const subScriber = countManager.subScribe(({ value, isOver }) => {
    console.log(`${new Date().toJSON()}: value: ${value}`);

    if(isOver){
        console.log(`${new Date().toJSON()}: cost:`, Date.now() - startTime);
    }
}, {
    start: 5 * 1000,
    end: 0 * 1000,
    autoUnsubscribe: true,
    name: "计时哦",
    notifyOnSubscribe: true
}); 

subScriber.startListening();
```
输出
```typescript
2025-03-19T02:44:29.843Z: 开始订阅
2025-03-19T02:44:29.845Z: value: 5000
2025-03-19T02:44:30.858Z: value: 4000
2025-03-19T02:44:31.851Z: value: 3000
2025-03-19T02:44:32.845Z: value: 2000
2025-03-19T02:44:33.857Z: value: 1000
2025-03-19T02:44:34.853Z: value: 0
2025-03-19T02:44:34.854Z: cost: 5011
```


### 使用自定义时钟的CountManager
```typescript
import { CountManger } from "count-manger"

const cm = new CountManger({
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

```

输出：   
```typescript
2025-03-19T02:45:14.381Z: 500
2025-03-19T02:45:14.492Z: 400
2025-03-19T02:45:14.587Z: 300
2025-03-19T02:45:14.686Z: 200
2025-03-19T02:45:14.786Z: 100
2025-03-19T02:45:14.889Z: 0
2025-03-19T02:45:14.890Z: cost: 510
```