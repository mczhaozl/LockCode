/**
 * config 所有兼容写法
 * 1. 数组写法 ['index.js','src/views/index.js']  
 * 2. 详细写法
 * type Tconfig = {
    // 'replace' 取代被篡改的代码 'manual' 仅报错需要手动替换
    mode?: 'replace' | 'manual',
    //  自动替换的文件
    replace?: Array<string>,
    //  手动替换的文件
    manual?: Array<string>,
    lockPath?: String,
    // 插件名称
    name?: String,
    // 手动对比出错的回调
    manualCallback?: (path: string, lock: Buffer) => void | never,
    // 自动对比出错的回调
    replaceCallback?: (path: string, lock: Buffer) => void | never,
    checkEnvironment?: Array<string> | ((env: string) => Boolean)
}
 */
const config =['demo.js']
const LockCode = require('lockcode')(config)
// 将 new LockCode()  写进 webpack plugins 中即可


