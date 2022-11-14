const fs = require('fs-extra')
const path = require('path')
const dayjs = require('dayjs')
const lodash = require('lodash')
const { argv } = require('process')
const nowPath = path.resolve('') // 返回cmd 路径
const localtion = argv[1] // 返回当前文件位置
export default function CreateLockCode(setting) {
    class LockCode { }
    return LockCode
}