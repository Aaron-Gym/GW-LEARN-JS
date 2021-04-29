const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(executor) {
    let self = this;
    // 给promise构造函数增加状态，默认状态为pending
    self.status = PENDING;
    self.value = undefined;
    self.error = undefined;
    self.onFulfilledCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (value instanceof MyPromise) {
            return value.then(resolve, reject);
        }
        // resolve函数将Promise状态从pending变为fulfilled
        if (self.status === PENDING) {
            setTimeout(() => {
                self.status = FULFILLED;
                self.value = value;
                self.onFulfilledCallbacks.forEach(callback => {
                    callback();
                });
            });
        }
    }
                                                                     
    function reject(error) {
        // reject函数将Promise状态从pending变为rejected
        if (self.status === PENDING) {
            setTimeout(() => {
                self.status = REJECTED;
                self.error = error;
                self.onRejectedCallbacks.forEach(callback => {
                    callback();
                });
            });
        }
    }

    try {
        executor(resolve, reject);
    } catch(error) {
        reject(error);
    }
}

// 判断对象或者函数是否有 then 方法
function isThenable(t) {
    if (t !== null && (typeof t === 'object' || typeof t === 'function')) {
        return true;
    }

    return false;
}

// onFulfilled 和 onRejected的返回值是开发者传入的，可能有各种问题。返回值也有很多种情况，
// 所以我们需要一个函数处理, onFulfilled 和 onRejected 的返回值
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('不能循环调用'));
    }

    if (x instanceof MyPromise) {
        if (x.status === PENDING) {
            x.then(y => {
                resolvePromise(promise2, y, resolve, reject);
            }, error => {
                reject(error);
            });
        } else {
            x.then(y => resolve(y), e => reject(e));
        }

        return;
    }

   
    if (isThenable(x)) {
         // 针对对象或者方法中有 then 方法，也就是所谓的 thenable 对象
        let called;

        try {
            // 取then的时候可能会出错
            let then = x.then;

            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) {
                        return;
                    }

                    called = true;
                    // 取得 x.then()的返回值之后，仍然需要对返回值进行判断，所以这里需要再次调用resolvePromise.
                    resolvePromise(promise2, y, resolve, reject);
                }, error => {
                    if (called) {
                        return;
                    }

                    called = true;
                    reject(error);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) {
                return;
            }

            called = true;
            reject(e);
        };
    } else {
        resolve(x);
    }
};

// then 函数本质是把 onFulfilled, onRejected 的返回值，包装成一个 promise 返回出去
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    let self = this;
    // 这两个函数都是可选的，不一定要提供。它们都接受Promise对象传出的值作为参数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error };

    // 返回一个新的Promise实例
    let promise2 = new MyPromise((resolve, reject) => {
        // promise 状态变成 FULFILLED 时执行
        if (self.status === FULFILLED) {
            // FULFILLED 是用户传入的，可能会报错，所以我们把它放到 try catch 中
            setTimeout(() => {
                try {
                    // onFulfilled 可以有返回值，把返回值注入到 then 返回的promise中
                    const x = onFulfilled(self.value);
    
                    resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
        }

        // promise 状态变成 REJECTED 时执行
        if (self.status === REJECTED) {
            setTimeout(() => {
                try {
                    const x = onRejected(self.error);
    
                    resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
        }

        // promise 状态为 PENDING 时执行
        if (self.status === PENDING) {
            self.onFulfilledCallbacks.push(function() {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(self.value);

                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            self.onRejectedCallbacks.push(function() {
                setTimeout(() => {
                    try {
                        const x = onRejected(self.error);

                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
    });

    return promise2;
};

MyPromise.all = function(arr) {
    return new MyPromise((resolve, reject) => {
        if (!Array.isArray(arr)) {
            throw new TypeError('Promise.all 参数必须是数组');
        }

        // 定义存放最终结果的数组result
        let result = [];
        let count = 0;

        addResult = (key, value) => {
            count++;
            result[key] = value;

            // 当count 等于 传入数组的长度时，说明所有的promise执行完毕
            if (count === arr.length) {
                resolve(v);
            }
        }

        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];

            // 判断item是否是thenable对象, 并且item.then是function
            if (isThenable(item)) {
                try {
                    let then = item.then;

                    if (typeof then === 'function') {
                        then(v => {
                            addResult(i, v);
                        }, e => reject(e));
                    } else {
                        addResult(i, item);
                    }
                } catch (e) {
                    reject(e);
                }
            } else {
                // item是普通值，直接把值加到result中
                addResult(i, item);
            }
        }
    });
};

// 只要有一个promise成功整个race就resolve
Promise.race = function(arr){
    return new Promise((resolve, reject) => {
        for (let i = 0; i < arr.length; i++){
            let item = arr[i];

            if (isThenable(item)){
                try {
                    let then = item.then;

                    if (typeof then === 'function') {
                        then(resolve, reject);
                    } else {
                        resolve(item);
                    }
                } catch (e) {
                    reject(e);
                }
            } else {
                resolve(item);
            }
        }
    });
};

MyPromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
};

// 实现一个promise的延迟对象 defer, 在我们测试的时候需要用到
MyPromise.defer = MyPromise.deferred = function() {
    let deferred = {};

    deferred.promise = new MyPromise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
};

module.exports = MyPromise;