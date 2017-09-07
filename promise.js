class MyPromise {
    constructor(executor) {
        let resolve = this._resolveOrReject.bind(this, 'resolved')
        let reject = this._resolveOrReject.bind(this, 'rejected')
        this._status = 'pending'

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
        this._thenHandler && this._thenHandler()
    }

    then(onSucc, onFail = it => {throw it}) {
        return new MyPromise((res, rej) => {
            let runHandler = () => {
                let succOrFail = this._status === 'resolved' ? onSucc : onFail
                setTimeout(() => {  // todo: 用类似nextTick替换setTimeout
                    try {
                        let thenReturn = succOrFail(this._value)
                        res(thenReturn) // then返回的新promise的resolve
                    } catch (e) {
                        rej(e)
                    }
                }, 0);
            }
            if (this._status !== 'pending') {
                runHandler()
            } else {
                this._thenHandler = runHandler
            }
        })
    }
}
