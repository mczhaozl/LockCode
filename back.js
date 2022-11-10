const fs = require('fs')
const dayjs = require('dayjs')
const path = require('path')
const lodash = require('lodash')
var log = console.log
const usePath = path.resolve('./template.md')
const execSync = require('child_process').execSync

// fs.writeFile(path.resolve('./template.md'))
function writeFile(path, value) {
    return new Promise((a, b) => {
        fs.writeFile(path, value, (error, data) => {
            if (error) {
                b(error)
            }
            a(data)
        })
    })
}
function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => {
            if (error) {
                reject(error)
            }
            if (data) {
                resolve(data.toString())
            }
        })
    })
}
function sleep(timeout) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, timeout);
    })
}
function nthMap(map, index) {
    const keys = [...map.keys()]
    return lodash.nth(keys, index)
}
function genLogMap(string, Type = Map, isRe = true) {
    const raw = string.split('commit')
    const list = isRe ? raw.reverse() : raw
    // const list = string.split('commit').reverse()
    list.pop()
    const array = list.map((item) => {
        const CommitObj = genCommitItem(item)
        return [CommitObj.commitId, CommitObj]
    })
    const map = new Type(array)
    map.list = array
    map.items = array.map((el) => el[1])
    return map
}
function genCommitItem(item) {
    const par = item.split('\n')
    const commitId = par[0]
    const Author = par[1]
    const commitDate = lodash.get(par, [2], '').replace(/Date:\s*/, '')
    const time = +new Date(commitDate)
    const commit = par.slice(3)
    const CommitObj = {
        par,
        commitId,
        Author,
        commitDate,
        time,
        commit
    }
    return CommitObj
}
function getBarchLogs(barch = '') {
    let name = execSync(`git log ${barch}`).toString().trim()
    return genLogMap(name, Map, false)
}

function reSetCommit(old, num) {
    const map = getBarchLogs(old)
    const item = map.items[num]
    return item
}

function pickCommit(item) {
    execSync(`git cherry-pick ${item.commitId}`)
    execSync(`git reset --soft HEAD~1`)
    execSync(`git commit -m ${item.commit.join('')}`)
}
function useAdd(old, num) {
    for (let item = num; item > 0; item--) {
        const ob = reSetCommit(old, item)
        console.log(ob.commitId);
        pickCommit(ob)
    }
}

useAdd('master', 5)


// commit 08ddc44afd9a67280dac8823c323cd1a8924e13b (origin/master, master)
// Author: mczhaozl <2575630942@qq.com>
// Date:   Sun Nov 6 13:47:22 2022 +0800

//     '2022-11-06/13/47/21WithRandomKeyr0lzfjdagj'

// commit f8179697beb3cc2bbb5371b213ee052c23a0d768
// Author: mczhaozl <2575630942@qq.com>
// Date:   Sun Nov 6 13:47:21 2022 +0800

//     '2022-11-06/13/47/20WithRandomKey8md0ujyo2c'

// commit 7c78562ed6e126018239555ee0415a956c8f234f
// Author: mczhaozl <2575630942@qq.com>
// Date:   Sun Nov 6 13:47:20 2022 +0800

//     '2022-11-06/13/47/19WithRandomKeyceg74z4jh8'