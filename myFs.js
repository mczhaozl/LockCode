const fs = require('fs')


function writeFile(path, value) {
    return new Promise((a, b) => {
        fs.writeFile(path, value, (error, data) => {
            if (error) {
                b(error)
            }
            if (data) {
                a(data)
            }
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