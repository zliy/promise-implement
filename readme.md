# 一个简单的Promise实现

目前可以正确实现Promise的then方法，包括链式的then和then里的onSucc里返回新的Promise对象

添加了 Promise 的all，race，resolve，reject四个静态方法。

## todo：
- [ ] 对于reject且没有处理的promise抛出错误
- [ ] Promise.race 输出不稳定: `MyPromise.race([resAfter('val1', 1001), resAfter('val2', 1000)]).then(console.log)`，可能是因为使用的是 setTimeout 而非 nextTick