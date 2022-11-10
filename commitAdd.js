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
async function edit(time) {
    time = Number(time)
    if (!time) {
        console.log('!time');
    }
    const list = lodash.times(time, a => a)
    for await (let i of list) {
        await commitTemplate(i)
        console.log(`git push  ${i}`);
        execSync(`git push`)
    }
    await sleep(500)
    log('finish push')
}
async function commitTemplate(index) {
    const string = await readFile(usePath)
    const key = `${dayjs().format('YYYY-MM-DD/HH/mm/ss')}WithRandomKey${Math.random().toString(36).substring(3)}`
    await writeFile(usePath, string + `
    // ${key}
    `)
    log(`finish write ${index}`)
    const b = await execSync('git add .')
    await sleep(1000)
    execSync(`git commit -m '${key}'`)

}
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
readline.question(`What's time?`, time => {
    edit(time)
    readline.close();
});
