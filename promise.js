class MyPromise {
    constructor(executor) {
        let resolve = this._resolveOrReject.bind(this, 'resolved')
        let reject = this._resolveOrReject.bind(this, 'rejected')
        this._status = 'pending'
        this._handerAtPending = []
        try {
            executor(resolve, reject)
        } catch (e) {
            this._value = e
            this._status = 'rejected'
        }
    }

    _resolveOrReject(which, val) {
        if (this._status !== 'pending') {
            return
        }
        if (val instanceof MyPromise && which === 'resolved') {
            let copyStat = () => {
                this._value = val._value
                this._status = val._status
                this._thenHandler && this._thenHandler()
            }
            val.then(copyStat, copyStat)
            return
        }
        this._value = val
        this._status = which
        for (let i = this._handerAtPending.length; i > 0; i--) {
            this._handerAtPending.shift()()
        }
    }

    then(onSucc, onFail = it => { throw it }) {
        return new MyPromise((res, rej) => {
            let runHandler = () => {
                let succOrFail = this._status === 'resolved' ? onSucc : onFail
                setTimeout(() => { // todo: 用类似nextTick替换setTimeout
                    try {
                        let thenReturn = succOrFail(this._value)
                        res(thenReturn) // then返回的新promise的resolve
                    } catch (e) {
                        rej(e)
                    }
                }, 0)
            }
            if (this._status !== 'pending') {
                runHandler()
            } else {
                this._handerAtPending.push(runHandler)
            }
        })
    }

    static resolve(val) {
        return val instanceof MyPromise ? val : new MyPromise(res => res(val))
    }

    static reject(val) {
        return new MyPromise((res, rej) => rej(val))
    }

    static all(pomsAry) {
        return new MyPromise((res, rej) => {
            let resolveVals = []
            let resolvedCount = 0
            let len = pomsAry.length

            for (let [i, poms] of pomsAry.entries()) {
                MyPromise.resolve(poms).then((val) => {
                    resolvedCount += 1
                    resolveVals[i] = val
                    if (resolvedCount === len) {
                        res(resolveVals)
                    }
                }, rej)
            }
        })
    }

    static race(pomsAry) {
        return new MyPromise((res, rej) => {
            for (let poms of pomsAry) {
                MyPromise.resolve(poms).then(res, rej)
            }
        })
    }
}


// 导出以方便测试
if (module) {
    module.exports = MyPromise
}
