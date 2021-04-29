MyPromise.prototype.then = function(onFulfilled, onRejected){
    let self = this
    let promise2 = new MyPromise(function(resolve, reject){
    // then 函数的成功回调函数的执行结果 与 promise2的关系
    if(self.state === 'resolved'){
      try{
        let x = onFulfilled(self.value)
          resolve(x) // 这是 x 是常量的时候，但x可能是一个新的promise，
      }catch(e){
         reject(e)
      }
    }
    if(self.state === 'rejected'){
      try{
        let x = onRejected(self.reason)
          resolve(x)
        }catch(e){
          reject(e)
        }
    }
    if(self.state === 'pending'){
      self.onResolvedCallbacks.push(function(){
        try{
          let x = onFulfilled(self.value)
          resolve(x)
        }catch(e){
          reject(e)
        }
      })
      self.onRejectedCallbacks.push(function(){
        try{
          let x = onRejected(self.reason)
          resolve(x)
        }catch(e){
          reject(e)
        }
      })
   }
  })
  return promise2
  }