const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });
// readline.question(`What's class name?`, name => {
//     write(name)
//     readline.close();
// });
const fs = require('fs')
function template(className) {
    return `
    //${Math.random()}
class ${className} {
    runNum = 0
    queue = []
    constructor(max = 10) {
        this.max = max
    }
    add(promiser){
        return new Promise((resolve,reject)=>{
            this.queue.push([promiser,resolve,reject])
            this.shouldRun()
        })
    }
    // 判断是否能继续执行
    shouldRun(){
        if(this.runNum>=this.max){
            return 
        }
        if(this.queue.length===0){
            return 
        }
        this.runPromise()
    }
    runPromise(){
        this.runNum++
        const [promiser,resolve,reject] =this.queue.shift()
        promiser.then(resolve)
        .catch(reject)
        .finaly(()=>{
            this.runNum--
            // 每个异步任务结束的时候再次执行新的异步任务
            this.shouldRun()
        })
        //  一直同步调用 直到 runNum === max
        this.shouldRun()
    }
}
`
}
function write(name) {
    const string = template(name)
    fs.writeFile(`./${name}.js`, string, () => { })
}
readline.question(`What's class name?`, name => {
    write(name)
    readline.close();
});