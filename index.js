const fs = require('fs-extra')
const path = require('path')
export default function CreateLockCode(setting) {
    const config = [formatSetting, formatPathMap].reduce((per, cur) => cur(per), setting)
    class LockCode {
        // @LimitEnvironment(config.checkEnvironment)
        apply(compiler) {
            compiler.hooks.emit.callAsync(config.name, async () => {
                return check(config)
            })
        }
    }
    // 如果不支持装饰器 可以使用以下代码
    decoratorsPollfill(LockCode.prototype,'apply',LimitEnvironment(config.checkEnvironment))
    return LockCode
}
function formatSetting(setting) {
    const defaultConfig = {
        mode: 'replace', // 'replace' 取代被篡改的代码 'manual' 仅报错需要手动替换
        replace: [],
        manual: [],
        lockPath: './lock', // 锁定文件夹位置
        name: 'LockCode',
        manualCallback(filePath) {
            throw new Error(`${filePath} 文件被篡改了`)
        },
        replaceCallback(filePath, lock) {
            fs.writeFile(filePath, lock)
            console.warn(filePath, '已经自动修复了')
            return filePath
        }
    }
    // 如果是数组写法则修正为 defaultConfig.mode
    if (Array.isArray(setting)) {
        return { ...defaultConfig, [defaultConfig.mode]: setting }
    }
    return Object.assign(defaultConfig, setting)
}
function formatPathMap(config) {
    config.lockPath = path.resolve('', config.lockPath)
    const pathMap = {}
    function eachMode(mode) {
        config[mode].forEach((string, index) => {
            const localPath = path.resolve('', string)
            pathMap[localPath] = mode
            // config[mode][index] = localPath
        })
    }
    eachMode('replace')
    eachMode('manual')
    return Object.assign(config, pathMap)
}
function check(config) {
    return new Promise(async (resolve, reject) => {
        const replaceFile = createFileHandle('replace', config.replaceCallback)
        const manualFile = createFileHandle('manual', config.manualCallback)
        const replacePromise = replaceFile(config)
        const manualPromise = manualFile(config)
        Promise.all([replacePromise, manualPromise]).then(resolve).catch(reject)
    })
}
function createFileHandle(mode, callback) {
    return async function replaceFile(config) {
        return config[mode].map((filePath) => {
            return new Promise(async (resolve, reject) => {
                const lockFilePath = path.resolve(config.lockPath, filePath)
                const localPath = path.resolve('', filePath)
                try {
                    console.log(config.lockPath);
                    console.log("localPath", localPath);
                    console.log('lockFilePath', lockFilePath);
                    const [lock, src] = await Promise.all([fs.readFile(lockFilePath), fs.readFile(localPath)])
                    if (lock.toString() === src.toString()) {
                        return resolve()
                    }
                    // 不相等则直接覆盖
                    return callback(filePath, lock)
                    // fs.writeFile(filePath, lock)
                } catch (error) {
                    // 不存在文件则进行记录
                    fs.readFile(localPath).then(r => {
                        fs.outputFile(lockFilePath, r)
                    })
                }
            })
        })
    }
}
function LimitEnvironment(rules) {
    return function (target, name, descriptor) {
        const empty = { ...descriptor, value() { } }
        if (typeof rules === 'function' && !rules(NODE_ENV)) {
            return empty
        }
        if (typeof rules === 'string' && rules !== NODE_ENV) {
            return empty
        }
        if (Array.isArray(rules) && !rules.includes(NODE_ENV)) {
            return empty
        }
        return descriptor
    }
}
/**
 * 不支持 装饰器可以使用本代码
 */
function decoratorsPollfill(prototype, key, desc, modifyer) {
    return Object.defineProperty(prototype, key, modifyer(prototype, key, Object.getOwnPropertyDescriptor(prototype, key)))
}