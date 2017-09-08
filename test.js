// 只是在开发时的测试代码😀

const MyPromise = require('./promise.js')




// Promise.all

// 包括非promise，全部resolve
pa1 = MyPromise.all([resAfter(1, 1000), resAfter(2, 3000), resAfter(3, 1500), Math.PI])
    .then(console.log, console.log)

// 某个promise会reject
pa2 = MyPromise.all([resAfter(1, 1000), resAfter(2, 3000, false), resAfter(3, 1500)])
pa2.then(console.log, console.log.bind(null, 'fail: '))




// Promise.race

pr1 = MyPromise.race([resAfter(1, 1000), resAfter(2, 1500), resAfter('err', 300, false)])
pr1.then(console.log, console.log.bind(null, 'fail: '))





// then

p1 = new MyPromise((res, rej) => {
    setTimeout(function () {
        res('v1')
        res('v2')
    }, 2000);
})
p2 = p1.then((val) => {
    console.log(val)
    return p2r = resAfter('replace', 1000, false)
})
p3 = p2.then((val) => {
    console.log('p2succ: ' + val)
}, (err) => {
    console.log('p2fail: ' + err)
})




// helper
setTimeout(_ => _, 2 ** 30)
function resAfter(val, time, isResolve = true) {
    return new MyPromise((res, rej) => {
        setTimeout(() => {
            let which = isResolve ? res : rej
            which(val)
        }, time);
    })
}
