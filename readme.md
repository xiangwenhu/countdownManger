
## 起因
直播业务，活动入口显示倒计时，点击活动入口后也显示倒计时。    
最初的倒计时组件倒计时的逻辑是组件内部实现的，各自计算各自的，导致了活动内外的倒计时显示不一致。    

所以把计时逻辑分离，通过key来分组，同样的key具备同样的计时逻辑。


## 示例

### 正常的倒计时
```typescript
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

// 输出：
// 2025-01-22T17:11:39.994Z: 开始订阅
// 2025-01-22T17:11:39.996Z: value: 10000
// 2025-01-22T17:11:41.011Z: value: 9000
// 2025-01-22T17:11:42.006Z: value: 8000
// 2025-01-22T17:11:43.004Z: value: 7000
// 2025-01-22T17:11:44.005Z: value: 6000
// 2025-01-22T17:11:45.001Z: value: 5000
// 2025-01-22T17:11:46.009Z: value: 4000
// 2025-01-22T17:11:47.011Z: value: 3000
// 2025-01-22T17:11:48.010Z: value: 2000
// 2025-01-22T17:11:49.003Z: value: 1000
// 2025-01-22T17:11:50.006Z: value: 0
// 2025-01-22T17:11:50.007Z: cost: 10013

```

## 同样的key
```typescript
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


// 输出
// client1: 2025-01-22T17:14:35.638Z: 开始订阅
// client1: 2025-01-22T17:14:35.640Z: value 5000
// client2: 2025-01-22T17:14:35.640Z: 开始订阅
// client2: 2025-01-22T17:14:36.456Z: value 5000
// client1: 2025-01-22T17:14:36.656Z: value 4000
// client2: 2025-01-22T17:14:36.656Z: value 4000
// client1: 2025-01-22T17:14:37.654Z: value 3000
// client2: 2025-01-22T17:14:37.654Z: value 3000
// client1: 2025-01-22T17:14:38.640Z: value 2000
// client2: 2025-01-22T17:14:38.641Z: value 2000
// client1: 2025-01-22T17:14:39.656Z: value 1000
// client2: 2025-01-22T17:14:39.656Z: value 1000
// client1: 2025-01-22T17:14:40.654Z: value 0
// client2: 2025-01-22T17:14:40.655Z: value 0
```


## 结构图



## 特点
1. CountManager支持多实例，比如常见的验证码计时， 1000ms为间隔。
2. 会根据当前时间和下一次预计时间点，通过setTimeout动态调整执行计划，确保计时尽可能准确。
3. 支持倒计时，也支持正向计时。
4. 支持统计运行中的计时器